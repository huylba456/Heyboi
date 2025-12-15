"""Build AppleStore Workflow.xlsx from the extracted OpenXML contents.

This script mirrors the layout inside workflow/apple_store/ and zips the
text-based OpenXML parts into a ready-to-open .xlsx package. It avoids
platform-specific tooling so it can be run from VS Code terminals on
Windows, macOS, or Linux as long as Python 3 is available.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED


def build_package(source_dir: Path, output_file: Path) -> None:
    if not source_dir.is_dir():
        raise FileNotFoundError(f"Source directory not found: {source_dir}")

    output_file.unlink(missing_ok=True)

    # Sort entries for deterministic archives and easier diffs.
    entries = sorted(source_dir.rglob("*"))

    with ZipFile(output_file, "w", ZIP_DEFLATED) as zf:
        for entry in entries:
            if entry.is_dir():
                continue
            zf.write(entry, entry.relative_to(source_dir))

    print(f"Generated: {output_file}")


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Zip workflow/apple_store into AppleStore Workflow.xlsx",
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=Path(__file__).resolve().parent / "apple_store",
        help="Path to the extracted OpenXML folder (default: workflow/apple_store)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parent.parent / "AppleStore Workflow.xlsx",
        help="Destination .xlsx file (default: repository root)",
    )
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    try:
        build_package(args.source, args.output)
    except Exception as exc:  # noqa: BLE001 - show concise failure reason to user
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
