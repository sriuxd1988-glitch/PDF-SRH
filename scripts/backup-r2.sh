#!/usr/bin/env bash
# =============================================================================
# SimplifyPDF Off-Site Backup Pipeline (Cloudflare R2 Bucket)
# Performs compressed pg_dump, generates SHA256 verification hash,
# and syncs to Cloudflare R2 object storage.
# =============================================================================

set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/tmp/simplifypdf_backups"
DB_NAME="${POSTGRES_DB:-simplifypdf_db}"
DB_USER="${POSTGRES_USER:-simplifypdf}"
DB_CONTAINER="${POSTGRES_CONTAINER:-simplifypdf-postgres}"
R2_BUCKET="${R2_BACKUP_BUCKET:-s3://simplifypdf-backups/database}"

mkdir -p "${BACKUP_DIR}"

DUMP_FILE="${BACKUP_DIR}/dump_${DB_NAME}_${TIMESTAMP}.sql.gz"
SHA_FILE="${DUMP_FILE}.sha256"

echo "💾 [R2 BACKUP] Starting database dump for ${DB_NAME} at $(date)..."

# 1. Execute compressed PostgreSQL dump via Docker container
docker exec -t "${DB_CONTAINER}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" --clean --if-exists | gzip > "${DUMP_FILE}"

# 2. Generate cryptographic SHA-256 verification hash
sha256sum "${DUMP_FILE}" > "${SHA_FILE}"
FILE_SIZE=$(du -h "${DUMP_FILE}" | cut -f1)

echo "✅ Database dump complete: ${DUMP_FILE} (${FILE_SIZE})"
echo "🔒 SHA256: $(cat "${SHA_FILE}")"

# 3. Upload to Cloudflare R2 Bucket via AWS CLI S3 endpoint
if command -v aws &> /dev/null && [ -n "${R2_ENDPOINT_URL:-}" ]; then
  echo "☁️  Uploading snapshot to Cloudflare R2 bucket (${R2_BUCKET})..."
  aws s3 cp "${DUMP_FILE}" "${R2_BUCKET}/" --endpoint-url "${R2_ENDPOINT_URL}"
  aws s3 cp "${SHA_FILE}" "${R2_BUCKET}/" --endpoint-url "${R2_ENDPOINT_URL}"
  echo "✅ Cloudflare R2 off-site sync completed successfully!"
else
  echo "ℹ️  R2_ENDPOINT_URL not set or AWS CLI absent. Snapshot stored locally at ${DUMP_FILE}."
fi

# 4. Prune local backups older than 7 days
find "${BACKUP_DIR}" -type f -mtime +7 -delete

echo "🏆 Backup pipeline completed successfully."
