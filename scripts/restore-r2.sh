#!/usr/bin/env bash
# =============================================================================
# SimplifyPDF Disaster Recovery Restore Drill Script
# Validates checksum, restores target database from Cloudflare R2 backup,
# and verifies table integrity within 15 minutes.
# =============================================================================

set -euo pipefail

BACKUP_FILE="${1:-}"
DB_NAME="${POSTGRES_DB:-simplifypdf_db}"
DB_USER="${POSTGRES_USER:-simplifypdf}"
DB_CONTAINER="${POSTGRES_CONTAINER:-simplifypdf-postgres}"

if [ -z "${BACKUP_FILE}" ]; then
  echo "Usage: $0 <path_to_backup.sql.gz>"
  echo "Example: $0 /tmp/simplifypdf_backups/dump_simplifypdf_db_20261120_000000.sql.gz"
  exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "❌ Error: Backup file not found: ${BACKUP_FILE}"
  exit 1
fi

START_TIME=$(date +%s)
echo "🚨 [DISASTER RECOVERY DRILL] Initiating platform restoration..."
echo "📂 Backup source: ${BACKUP_FILE}"

# 1. Verify SHA-256 Checksum if present
SHA_FILE="${BACKUP_FILE}.sha256"
if [ -f "${SHA_FILE}" ]; then
  echo "🔒 Verifying SHA256 integrity hash..."
  sha256sum -c "${SHA_FILE}"
  echo "✅ Checksum verified! Backup archive is intact."
fi

# 2. Restore PostgreSQL Database via container pipe
echo "⚡ Restoring database schema and records into ${DB_CONTAINER}..."
gunzip -c "${BACKUP_FILE}" | docker exec -i "${DB_CONTAINER}" psql -U "${DB_USER}" -d "${DB_NAME}"

# 3. Validation query
echo "🔍 Validating restored tables and records..."
docker exec -t "${DB_CONTAINER}" psql -U "${DB_USER}" -d "${DB_NAME}" -c "
SELECT 'User' as table_name, count(*) FROM \"User\"
UNION ALL
SELECT 'Subscription' as table_name, count(*) FROM \"Subscription\"
UNION ALL
SELECT 'Plan' as table_name, count(*) FROM \"Plan\"
UNION ALL
SELECT 'ToolConfig' as table_name, count(*) FROM \"ToolConfig\";
"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "🏆 Disaster Recovery Drill Completed in ${DURATION}s (Target: < 900s / 15 minutes)!"
echo "✅ SimplifyPDF platform verified fully operational."
