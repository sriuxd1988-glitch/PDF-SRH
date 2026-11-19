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
from tools.organize import organize_pdf
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

STREAM_STANDARD = "stream:pdf-jobs"
STREAM_PRO = "stream:pdf-jobs:pro"
CONSUMER_GROUP = "pdf-workers-group"
CONSUMER_NAME = f"worker-{os.getpid()}"

r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def setup_stream_groups():
    for stream in [STREAM_PRO, STREAM_STANDARD]:
        try:
            r.xgroup_create(stream, CONSUMER_GROUP, id="0", mkstream=True)
            logger.info(f"Consumer group '{CONSUMER_GROUP}' created on '{stream}'")
        except redis.exceptions.ResponseError as e:
            if "BUSYGROUP" in str(e):
                logger.info(f"Consumer group '{CONSUMER_GROUP}' ready on '{stream}'")
            else:
                raise e

def publish_job_progress(job_id: str, status: str, progress: int, detail: str = "", error_reason: str = None, download_url: str = None):
    payload = {
        "jobId": job_id,
        "status": status,
        "progress": progress,
        "detail": detail,
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

def process_single_job(message_id: str, data: dict, stream_source: str):
    start_time = time.time()
    job_id = data.get("jobId")
    tool_type = data.get("toolType")
    source_key = data.get("sourceKey")
    source_filename = data.get("sourceFilename", "document.pdf")
    options = json.loads(data.get("optionsJson", "{}"))
    priority_label = "PRO" if stream_source == STREAM_PRO else "STANDARD"

    logger.info(f"⚡ [{priority_label}] Job {job_id} | Tool: {tool_type} | File: {source_filename}")

    temp_dir = f"/tmp/simplifypdf_{job_id}"
    os.makedirs(temp_dir, exist_ok=True)
    local_input = os.path.join(temp_dir, source_filename)

    try:
        # Step 1: Download from MinIO S3
        publish_job_progress(job_id, "SCANNING", 15, detail="Downloading source document from S3 storage...")
        update_db_job_status(job_id, "SCANNING")
        download_file(source_key, local_input)

        # Step 2: ClamAV Antivirus Stream Scan
        publish_job_progress(job_id, "SCANNING", 30, detail="Running ClamAV antivirus stream scan...")
        is_clean, virus_info = scan_file_stream(local_input)
        if not is_clean:
            err = f"MALWARE_DETECTED: {virus_info}"
            logger.error(f"Security Alert: Job {job_id} failed malware check: {err}")
            update_db_job_status(job_id, "FAILED", error_reason=err)
            publish_job_progress(job_id, "FAILED", 100, detail=err, error_reason=err)
            return

        # Step 2.5: Polyglot Guard & JavaScript Sanitization
        if source_filename.lower().endswith(".pdf"):
            publish_job_progress(job_id, "SCANNING", 38, detail="Verifying magic bytes and stripping malicious actions...")
            try:
                from security_guard import inspect_and_sanitize
                inspect_and_sanitize(local_input)
            except Exception as sec_err:
                err = f"SECURITY_VIOLATION: {sec_err}"
                logger.error(f"Security Alert: Job {job_id} failed security guard: {err}")
                update_db_job_status(job_id, "FAILED", error_reason=err)
                publish_job_progress(job_id, "FAILED", 100, detail=err, error_reason=err)
                return

        # Step 3: Permissive Open-Source Tool Execution
        publish_job_progress(job_id, "PROCESSING", 45, detail="Executing permissive open-source engine...")
        update_db_job_status(job_id, "PROCESSING")

        base_name, ext = os.path.splitext(source_filename)
        output_filename = f"processed_{base_name}.pdf"
        local_output = os.path.join(temp_dir, output_filename)
        content_type = "application/pdf"

        if tool_type == "COMPRESS":
            publish_job_progress(job_id, "PROCESSING", 55, detail="Linearizing object streams and compressing...")
            compress_pdf(local_input, local_output, level=options.get("level", "recommended"))
        elif tool_type == "MERGE":
            publish_job_progress(job_id, "PROCESSING", 55, detail="Merging PDF pages via pikepdf...")
            merge_pdfs([local_input], local_output)
        elif tool_type == "SPLIT":
            publish_job_progress(job_id, "PROCESSING", 55, detail="Extracting page ranges via pikepdf...")
            page_ranges = options.get("pages")
            if not page_ranges:
                output_filename = f"{base_name}_pages.zip"
                local_output = os.path.join(temp_dir, output_filename)
                content_type = "application/zip"
            split_pdf(local_input, local_output, page_ranges=page_ranges)
        elif tool_type in ("ORGANIZE", "ROTATE"):
            publish_job_progress(job_id, "PROCESSING", 55, detail="Applying page rotations and layout organization...")
            organize_pdf(
                local_input,
                local_output,
                rotations=options.get("rotations"),
                delete_pages=options.get("delete_pages"),
                page_order=options.get("page_order"),
            )
        elif tool_type == "PDF_TO_IMAGES":
            publish_job_progress(job_id, "PROCESSING", 55, detail="Rasterizing PDF pages to images via pypdfium2...")
            output_filename = f"{base_name}_images.zip"
            local_output = os.path.join(temp_dir, output_filename)
            content_type = "application/zip"
            convert_pdf_to_images(local_input, local_output, dpi=options.get("dpi", 150))
        elif tool_type == "IMAGES_TO_PDF":
            publish_job_progress(job_id, "PROCESSING", 55, detail="Compiling images to PDF via Pillow...")
            convert_images_to_pdf([local_input], local_output)
        elif tool_type == "PROTECT":
            publish_job_progress(job_id, "PROCESSING", 55, detail="Applying 256-bit AES encryption...")
            protect_pdf(local_input, local_output, user_password=options.get("password", "1234"))
        elif tool_type == "UNLOCK":
            publish_job_progress(job_id, "PROCESSING", 55, detail="Decrypting permissions...")
            unlock_pdf(local_input, local_output, password=options.get("password", ""))
        elif tool_type == "WORD_TO_PDF":
            publish_job_progress(job_id, "PROCESSING", 55, detail="Executing sandboxed LibreOffice conversion...")
            convert_office_to_pdf(local_input, local_output)
        elif tool_type == "PDF_TO_WORD":
            publish_job_progress(job_id, "PROCESSING", 55, detail="Extracting document layout to Word via pdf2docx...")
            output_filename = f"{base_name}.docx"
            local_output = os.path.join(temp_dir, output_filename)
            content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            convert_pdf_to_word(local_input, local_output)
        else:
            compress_pdf(local_input, local_output)

        publish_job_progress(job_id, "PROCESSING", 85, detail="Uploading processed document back to S3...")

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
        publish_job_progress(job_id, "COMPLETED", 100, detail="Completed successfully!")
        logger.info(f"✅ Job {job_id} successfully completed in {duration_ms}ms")

    except Exception as e:
        logger.error(f"❌ Error processing job {job_id}: {e}\n{traceback.format_exc()}")
        duration_ms = int((time.time() - start_time) * 1000)
        update_db_job_status(job_id, "FAILED", error_reason=str(e), duration_ms=duration_ms)
        publish_job_progress(job_id, "FAILED", 100, detail=str(e), error_reason=str(e))
    finally:
        # Step 6: Cleanup local temporary files
        try:
            for f in os.listdir(temp_dir):
                os.remove(os.path.join(temp_dir, f))
            os.rmdir(temp_dir)
        except Exception:
            pass

def main():
    logger.info("SimplifyPDF Permissive Worker Daemon starting...")
    setup_stream_groups()
    logger.info(f"Listening on priority streams ['{STREAM_PRO}', '{STREAM_STANDARD}'] as '{CONSUMER_NAME}'...")

    while True:
        try:
            # Read Pro priority stream first, then standard stream
            response = r.xreadgroup(
                CONSUMER_GROUP,
                CONSUMER_NAME,
                {STREAM_PRO: ">", STREAM_STANDARD: ">"},
                count=1,
                block=3000,
            )

            if not response:
                continue

            for stream_name, messages in response:
                for message_id, data in messages:
                    process_single_job(message_id, data, stream_name)
                    r.xack(stream_name, CONSUMER_GROUP, message_id)

        except Exception as e:
            logger.error(f"Worker loop error: {e}")
            time.sleep(2)

if __name__ == "__main__":
    main()
