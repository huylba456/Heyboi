#!/usr/bin/env bash
set -euo pipefail

# Build AppleStore Workflow.xlsx from the extracted OpenXML contents to avoid committing binary artifacts.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT_DIR/workflow/apple_store"
OUTPUT_FILE="$ROOT_DIR/AppleStore Workflow.xlsx"

cd "$SOURCE_DIR"
rm -f "$OUTPUT_FILE"
zip -qr "$OUTPUT_FILE" .
echo "Generated: $OUTPUT_FILE"

