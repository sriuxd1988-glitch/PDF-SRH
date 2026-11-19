import os
import boto3
from botocore.client import Config
import logging

logger = logging.getLogger("WorkerStorage")

S3_ENDPOINT = os.getenv("S3_ENDPOINT", "http://localhost:9000")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY", "minioadmin")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY", "minioadmin")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "simplifypdf-files")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

s3_client = boto3.client(
    "s3",
    endpoint_url=S3_ENDPOINT,
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
    region_name=AWS_REGION,
    config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),
)

def download_file(s3_key: str, local_path: str):
    logger.info(f"Downloading s3://{S3_BUCKET_NAME}/{s3_key} -> {local_path}")
    s3_client.download_file(S3_BUCKET_NAME, s3_key, local_path)

def upload_file(local_path: str, s3_key: str, content_type: str = "application/pdf"):
    logger.info(f"Uploading {local_path} -> s3://{S3_BUCKET_NAME}/{s3_key}")
    s3_client.upload_file(
        local_path,
        S3_BUCKET_NAME,
        s3_key,
        ExtraArgs={"ContentType": content_type},
    )
