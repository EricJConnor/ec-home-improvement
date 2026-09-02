#!/usr/bin/env python3
"""Pack the 137 globe tiles into one progressive JPEG.

The globe used to fetch 137 separate files. Bytes were never the problem — together
they are under a megabyte — the count was: on a phone the browser queues them, the
sphere fills in one square at a time, and it can take the better part of a minute on
a weak signal. One file means one request, and a *progressive* JPEG means the whole
sphere appears at once (softly) and then sharpens, instead of populating.

Reads   public/work/<slug>.jpg      (the 200px tiles, still the source of truth)
Writes  public/work/atlas-<hash>.jpg
        app/work-atlas.json         (where each slug sits in the sheet, and the
                                     full-size photo's dimensions for the closer look)

Run it again after changing any tile. The filename carries a content hash so the
atlas can be cached forever and still update the moment it changes.
"""
import hashlib, io, json, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
WORK, FULL = ROOT / 'public' / 'work', ROOT / 'public' / 'full'
manifest = json.loads((ROOT / 'app' / 'work-manifest.json').read_text())

PAD = 2          # edge-replicated gutter, so a scaled tile never samples its neighbour
WIDTH = 1600     # sheet width; height follows

tiles = []
for t in manifest:
    im = Image.open(WORK / (t['slug'] + '.jpg')).convert('RGB')
    fw, fh = Image.open(FULL / (t['slug'] + '.jpg')).size
    tiles.append((t['slug'], im, fw, fh))

# shelf packing: tallest first, rows filled left to right
order = sorted(tiles, key=lambda x: (-x[1].height, -x[1].width))
rows, row, x = [], [], 0
for item in order:
    w = item[1].width + PAD * 2
    if x + w > WIDTH and row:
        rows.append(row); row, x = [], 0
    row.append(item); x += w
if row: rows.append(row)

H = sum(max(i[1].height for i in r) + PAD * 2 for r in rows)
sheet = Image.new('RGB', (WIDTH, H), (27, 27, 27))
pos, y = {}, 0
for r in rows:
    rh = max(i[1].height for i in r)
    x = 0
    for slug, im, fw, fh in r:
        w, h = im.size
        # replicate the edges into the gutter rather than leaving a dark ring
        padded = Image.new('RGB', (w + PAD * 2, h + PAD * 2))
        padded.paste(im.resize((w + PAD * 2, h + PAD * 2)), (0, 0))
        padded.paste(im, (PAD, PAD))
        sheet.paste(padded, (x, y))
        pos[slug] = {'x': x + PAD, 'y': y + PAD, 'w': w, 'h': h, 'fw': fw, 'fh': fh}
        x += w + PAD * 2
    y += rh + PAD * 2

def save(im, q, tag):
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=q, optimize=True, progressive=True, subsampling=1)
    data = buf.getvalue()
    out = WORK / ('atlas%s-%s.jpg' % (tag, hashlib.md5(data).hexdigest()[:8]))
    out.write_bytes(data)
    print('%s  %dx%d  %.0f KB' % (out.name, im.width, im.height, len(data) / 1024))
    return '/work/' + out.name

for old in WORK.glob('atlas*.jpg'):
    old.unlink()
big = save(sheet, 76, '')
# The phone sheet is the same picture at 0.8 scale, so every crop — stored as a ratio of the
# sheet — is identical, and the browser picks between the two by srcset alone.
PH = 0.8
small = save(sheet.resize((round(WIDTH * PH), round(H * PH)), Image.LANCZOS), 70, '-phone')
(ROOT / 'app' / 'work-atlas.json').write_text(json.dumps(
    {'file': big, 'w': WIDTH, 'h': H, 'phone': small, 'pw': round(WIDTH * PH), 'tiles': pos},
    separators=(',', ':')))
print('%d tiles' % len(pos))
