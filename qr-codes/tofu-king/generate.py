#!/usr/bin/env python3
"""
Generate QR codes for Tofu King's tables.

Usage:
  python3 generate.py            # generates PNGs + printable HTML sheet
"""
import os
import qrcode
from qrcode.constants import ERROR_CORRECT_H

RESTAURANT_SLUG = "tofu-king"
RESTAURANT_NAME = "Tofu King"
BASE_URL = "https://dine-in.foodservai.com"
TABLES = ["A1", "A2", "A3",
          "B1", "B2", "B3",
          "C1", "C2", "C3",
          "D1", "D2", "D3",
          "E1", "E2",
          "J", "Q", "K"]

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
PNG_DIR = os.path.join(OUT_DIR, "png")
os.makedirs(PNG_DIR, exist_ok=True)


def url_for(table):
    return f"{BASE_URL}/?r={RESTAURANT_SLUG}&table={table}&mode=full"


def make_png(table):
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=12,
        border=2,
    )
    qr.add_data(url_for(table))
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    path = os.path.join(PNG_DIR, f"table-{table}.png")
    img.save(path)
    return path


def make_html_sheet():
    cells = []
    for t in TABLES:
        cells.append(f"""
        <div class="card">
          <img src="png/table-{t}.png" alt="QR for {t}" />
          <div class="label">{RESTAURANT_NAME}</div>
          <div class="table">Table {t}</div>
          <div class="hint">Scan to order &middot; ask for water &middot; pay &middot; get help</div>
        </div>""")
    html = f"""<!doctype html>
<html><head><meta charset="utf-8"><title>{RESTAURANT_NAME} Table QR Codes</title>
<style>
  @page {{ size: letter; margin: 0.4in; }}
  body {{ font-family: -apple-system, system-ui, sans-serif; margin: 0; padding: 16px; }}
  h1 {{ font-size: 18px; margin: 0 0 12px; }}
  .grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }}
  .card {{
    border: 2px solid #111; border-radius: 12px; padding: 16px;
    text-align: center; page-break-inside: avoid;
  }}
  .card img {{ width: 100%; max-width: 220px; height: auto; }}
  .label {{ font-size: 13px; color: #555; margin-top: 8px; }}
  .table {{ font-size: 36px; font-weight: 800; letter-spacing: 1px; }}
  .hint {{ font-size: 11px; color: #777; margin-top: 4px; }}
  @media print {{ .grid {{ gap: 12px; }} }}
</style></head>
<body>
  <h1>{RESTAURANT_NAME} &mdash; Table QR Codes ({len(TABLES)} tables)</h1>
  <div class="grid">{''.join(cells)}</div>
</body></html>"""
    path = os.path.join(OUT_DIR, "print-sheet.html")
    with open(path, "w") as f:
        f.write(html)
    return path


if __name__ == "__main__":
    print(f"Generating {len(TABLES)} QR codes for {RESTAURANT_NAME}...")
    for t in TABLES:
        p = make_png(t)
        print(f"  {t:4s} -> {url_for(t)}  ({os.path.basename(p)})")
    sheet = make_html_sheet()
    print(f"\nPrintable sheet: {sheet}")
    print(f"Open it in a browser and Cmd-P to print.")
