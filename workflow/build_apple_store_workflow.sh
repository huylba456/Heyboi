#!/usr/bin/env bash
set -euo pipefail
# Build AppleStore Workflow.xlsx from the extracted OpenXML contents to avoid committing binary artifacts.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PYTHON_BIN="${PYTHON_BIN:-python3}"

if ! command -v "$PYTHON_BIN" >/dev/null 2>&1; then
  if command -v python >/dev/null 2>&1; then
    PYTHON_BIN=python
  else
    echo "Python is required to build the workflow package. Install Python 3 and retry." >&2
    exit 1
  fi
fi

"$PYTHON_BIN" "$ROOT_DIR/workflow/build_apple_store_workflow.py"
