#!/usr/bin/env python3
"""Regenerate the business-card QR. Run after changing the domain:

    python3 scripts/build-qr.py                 # https://ec-homes.com/card
    python3 scripts/build-qr.py https://…/card  # anything else

The QR points at /card rather than carrying a vCard directly: a URL stays small enough
to scan instantly from a phone screen held at arm's length, and it puts the work one tap
away instead of only dropping a contact in.
"""
import re, sys, pathlib, segno

url = sys.argv[1] if len(sys.argv) > 1 else 'https://ec-homes.com/card'
out = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'qr.svg'
# error correction M survives a fingerprint or a bit of screen glare without bloating it
qr = segno.make(url, error='m')
qr.save(str(out), kind='svg', scale=1, border=2,
        dark='#141414', light=None, svgclass=None, lineclass=None)

# segno writes width/height in module units and no viewBox, so the SVG will not scale —
# stretch the box and the pattern just sits in the corner at its original 29px. Swap the
# fixed size for a viewBox so CSS can size it.
svg = out.read_text()
m = re.search(r'<svg([^>]*?)width="(\d+)"\s+height="(\d+)"', svg)
w, h = m.group(2), m.group(3)
svg = svg.replace(f'width="{w}" height="{h}"', f'viewBox="0 0 {w} {h}"', 1)
out.write_text(svg)
print(f'{out}  ->  {url}  ({w}x{h} modules, viewBox)')
