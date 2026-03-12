from __future__ import annotations

import csv
import io


def build_csv_bytes(headers: list[str], rows: list[list[object]]) -> bytes:
    buffer = io.StringIO()
    writer = csv.writer(buffer)

    writer.writerow(headers)
    for row in rows:
        writer.writerow(row)

    return buffer.getvalue().encode("utf-8-sig")