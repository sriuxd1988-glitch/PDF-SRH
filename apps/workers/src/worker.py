import os
import sys
import time
import json
import logging
import traceback
import redis
import psycopg2
from storage import download_file, upload_file
from scanner import scan_file_stream
from tools.compress import compress_pdf
from tools.merge import merge_pdfs
from tools.split import split_pdf
from tools.pdf_to_images import convert_pdf_to_images
from tools.images_to_pdf import convert_images_to_pdf
from tools.security import protect_pdf, unlock_pdf
from tools.office import convert_office_to_pdf, convert_pdf_to_word

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s",
)
logger = logging.getLogger("SimplifyPDFWorker")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://simplifypdf:password@localhost:5432/simplifypdf_db")
STREAM_NAME = "stream:pdf-jobs"
CONSUMER_GROUP = "pdf-workers-group"
CONSUMER_NAME = f"worker-{os.getpid()}"

r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def setup_stream_group():
    try:
        r.xgroup_create(STREAM_NAME, CONSUMER_GROUP, id="0", mkstream=True)
        logger.info(f"Consumer group '{CONSUMER_GROUP}' created on '{STREAM_NAME}'")
    except redis.exceptions.ResponseError as e:
        if "BUSYGROUP" in str(e):
            logger.info(f"Consumer group '{CONSUMER_GROUP}' already exists")
        else:
            raise e

def publish_job_progress(job_id: str, status: str, progress: int, error_reason: str = None, download_url: str = None):
    payload = {
        "jobId": job_id,
        "status": status,
        "progress": progress,
        "errorReason": error_reason,
        "downloadUrl": download_url,
    }
    r.publish(f"job:status:{job_id}", json.dumps(payload))

def update_db_job_status(job_id: str, status: str, output_key: str = None, output_size: int = None, duration_ms: int = None, error_reason: str = None, output_filename: str = None):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE "Job"
                SET "status" = %s,
                    "outputKey" = COALESCE(%s, "outputKey"),
                    "outputSizeBytes" = COALESCE(%s, "outputSizeBytes"),
                    "durationMs" = COALESCE(%s, "durationMs"),
                    "errorReason" = COALESCE(%s, "errorReason"),
                    "outputFilename" = COALESCE(%s, "outputFilename"),
                    "updatedAt" = NOW()
                WHERE "id" = %s
                """,
                (status, output_key, output_size, duration_ms, error_reason, output_filename, job_id),
            )
            conn.commit()
    finally:
        conn.close()

def process_single_job(message_id: str, data: dict):
    start_time = time.time()
    job_id = data.get("jobId")
    tool_type = data.get("toolType")
    source_key = data.get("sourceKey")
    source_filename = data.get("sourceFilename", "file.pdf")
    options = json.loads(data.get("optionsJson", "{}"))

    logger.info(f"⚡ Processing Job {job_id} | Tool: {tool_type} | File: {source_filename}")

    temp_dir = f"/tmp/simplifypdf_{job_id}"
    os.makedirs(temp_dir, exist_ok=True)
    local_input = os.path.join(temp_dir, source_filename)

    try:
        # Step 1: Download from S3 / MinIO
        publish_job_progress(job_id, "SCANNING", 15)
        update_db_job_status(job_id, "SCANNING")
        download_file(source_key, local_input)

        # Step 2: ClamAV Antivirus Scan
        publish_job_progress(job_id, "SCANNING", 30)
        is_clean, virus_info = scan_file_stream(local_input)
        if not is_clean:
            err = f"Security Alert: File infected with {virus_info}"
            logger.error(f"Job {job_id} failed malware check: {err}")
            update_db_job_status(job_id, "FAILED", error_reason=err)
            publish_job_progress(job_id, "FAILED", 100, error_reason=err)
            return

        # Step 3: Processing with Permissive Open-Source Engines
        publish_job_progress(job_id, "PROCESSING", 50)
        update_db_job_status(job_id, "PROCESSING")

        base_name, ext = os.path.splitext(source_filename)
        output_filename = f"processed_{base_name}.pdf"
        local_output = os.path.join(temp_dir, output_filename)
        content_type = "application/pdf"

        if tool_type == "COMPRESS":
            compress_pdf(local_input, local_output, level=options.get("level", "medium"))
        elif tool_type == "SPLIT":
            page_ranges = options.get("pages")
            if not page_ranges:
                output_filename = f"{base_name}_pages.zip"
                local_output = os.path.join(temp_dir, output_filename)
                content_type = "application/zip"
            split_pdf(local_input, local_output, page_ranges=page_ranges)
        elif tool_type == "PDF_TO_IMAGES":
            output_filename = f"{base_name}_images.zip"
            local_output = os.path.join(temp_dir, output_filename)
            content_type = "application/zip"
            convert_pdf_to_images(local_input, local_output, dpi=options.get("dpi", 150))
        elif tool_type == "IMAGES_TO_PDF":
            convert_images_to_pdf([local_input], local_output)
        elif tool_type == "PROTECT":
            protect_pdf(local_input, local_output, user_password=options.get("password", "1234"))
        elif tool_type == "UNLOCK":
            unlock_pdf(local_input, local_output, password=options.get("password", ""))
        elif tool_type == "WORD_TO_PDF":
            convert_office_to_pdf(local_input, local_output)
        elif tool_type == "PDF_TO_WORD":
            output_filename = f"{base_name}.docx"
            local_output = os.path.join(temp_dir, output_filename)
            content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            convert_pdf_to_word(local_input, local_output)
        else:
            # Fallback default: pass-through optimization
            compress_pdf(local_input, local_output)

        publish_job_progress(job_id, "PROCESSING", 85)

        # Step 4: Upload result back to S3
        output_s3_key = f"outputs/{job_id}/{output_filename}"
        upload_file(local_output, output_s3_key, content_type=content_type)
        output_size = os.path.getsize(local_output)
        duration_ms = int((time.time() - start_time) * 1000)

        # Step 5: Mark Job as COMPLETED in DB & notify SSE rail
        update_db_job_status(
            job_id,
            "COMPLETED",
            output_key=output_s3_key,
            output_size=output_size,
            duration_ms=duration_ms,
            output_filename=output_filename,
        )
        publish_job_progress(job_id, "COMPLETED", 100)
        logger.info(f"✅ Job {job_id} successfully completed in {duration_ms}ms")

    except Exception as e:
        logger.error(f"❌ Error processing job {job_id}: {e}\n{traceback.format_exc()}")
        duration_ms = int((time.time() - start_time) * 1000)
        update_db_job_status(job_id, "FAILED", error_reason=str(e), duration_ms=duration_ms)
        publish_job_progress(job_id, "FAILED", 100, error_reason=str(e))
    finally:
        # Step 6: Cleanup local temporary files
        try:
            for f in os.listdir(temp_dir):
                os.remove(os.path.join(temp_dir, f))
            os.rmdir(temp_dir)
        except Exception:
            pass

def main():
    logger.info("SimplifyPDF Worker Daemon starting up...")
    setup_stream_group()
    logger.info(f"Listening on Redis stream '{STREAM_NAME}' as consumer '{CONSUMER_NAME}'...")

    while True:
        try:
            # Read new messages from stream group
            response = r.xreadgroup(
                CONSUMER_GROUP,
                CONSUMER_NAME,
                {STREAM_NAME: ">"},
                count=1,
                block=5000,
            )

            if not response:
                continue

            for stream_name, messages in response:
                for message_id, data in messages:
                    process_single_job(message_id, data)
                    r.xack(STREAM_NAME, CONSUMER_GROUP, message_id)

        except Exception as e:
            logger.error(f"Worker loop error: {e}")
            time.sleep(2)

if __name__ == "__main__":
    main()
