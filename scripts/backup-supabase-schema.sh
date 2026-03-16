#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
OUTDIR="backups/schema"
LATEST_FILE="$OUTDIR/schema-latest.sql"
TIMESTAMPED_FILE="$OUTDIR/schema-$TIMESTAMP.sql"

mkdir -p "$OUTDIR"

echo "==> Backing up Supabase schema"

npx supabase db dump --schema public,storage --linked > "$LATEST_FILE"
cp "$LATEST_FILE" "$TIMESTAMPED_FILE"

echo "Schema backup written to:"
echo "  $LATEST_FILE"
echo "  $TIMESTAMPED_FILE"
