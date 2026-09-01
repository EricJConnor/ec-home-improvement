#!/usr/bin/env python3
"""Build a single self-contained HTML file from the running dev/prod server.

Eric reviews on his phone, and there's no Vercel preview yet, so the landing gets
published as an Artifact instead. Generating it from the live server (rather than
maintaining a second copy of the markup) guarantees the reviewed page and the
shipped page are the same page.

    npm run start &          # or npm run dev
    python3 scripts/build-preview.py [out.html]
"""
import base64, pathlib, re, sys, urllib.request

BASE = 'http://localhost:3000'
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'preview.html')
PATH = sys.argv[2] if len(sys.argv) > 2 else '/'
ROOT = pathlib.Path(__file__).resolve().parent.parent

html = urllib.request.urlopen(BASE + PATH).read().decode()

hrefs = re.findall(r'<link rel="stylesheet" href="([^"]+\.css)"', html)
assert hrefs, 'no stylesheet in the served HTML — is the server running?'
css = '\n'.join(urllib.request.urlopen(BASE + h).read().decode() for h in hrefs)

# next/font points at ../media/<file>.woff2 relative to the chunk; inline them so
# the page needs no font CDN and can't silently fall back to a system face.
fonts = {}
def font(m):
    n = m.group(1)
    if n not in fonts:
        fonts[n] = base64.b64encode(urllib.request.urlopen(BASE + '/_next/static/media/' + n).read()).decode()
    return 'url(data:font/woff2;base64,%s)' % fonts[n]
css = re.sub(r'url\(\.\./media/([^)]+\.woff2)\)', font, css)
assert fonts, 'no webfont inlined'

# the app sets --font-bricolage via a class on <html>; the artifact wraps us in <body>
css = ":root{--font-bricolage:'Bricolage Grotesque'}\n" + css

body = re.search(r'<body[^>]*>(.*)</body>', html, re.S).group(1)
for pat in (r'<script\b.*?</script>', r'<template\b.*?</template>',
            r'<next-route-announcer\b.*?</next-route-announcer>'):
    body = re.sub(pat, '', body, flags=re.S)
body = re.sub(r'<link\b[^>]*/?>', '', body)

def _inline(rel, max_px=None, q=82):
    f = ROOT / 'public' / rel.lstrip('/')
    data = f.read_bytes()
    if max_px:
        from PIL import Image
        import io
        im = Image.open(io.BytesIO(data)).convert('RGB')
        if max(im.size) > max_px:
            im.thumbnail((max_px, max_px))
        buf = io.BytesIO(); im.save(buf, 'JPEG', quality=q, optimize=True)
        data = buf.getvalue()
    return base64.b64encode(data).decode()

def img(m):
    return 'src="data:image/jpeg;base64,%s"' % _inline(m.group(1))
body, n = re.subn(r'src="(/assets/[^"]+)"', img, body)

def tile(m):
    # tiles render around 110px on screen, so 256 is still 2x on a retina display
    return 'src="data:image/jpeg;base64,%s"' % _inline(m.group(1), 256, 80)
body, t_ = re.subn(r'src="(/work/[^"]+\.jpg)"', tile, body)

# the background field is blurred to 58px, so it needs almost no resolution at all
def field(m):
    return 'src="data:image/jpeg;base64,%s"' % _inline(m.group(1), 400, 70)
body, _f = re.subn(r'src="(/full/[^"]+\.jpg)"', field, body)

# the closer look loads on click, so downscale it hard — nothing here is displayed
# above about 760px wide anyway
def fullsize(m):
    return 'data-full="data:image/jpeg;base64,%s"' % _inline(m.group(1), 560, 70)
body, f_ = re.subn(r'data-full="(/full/[^"]+\.jpg)"', fullsize, body)
if t_: n += t_; print('work: %d tiles, %d full-size inlined' % (t_, f_))

# The hero footage has to travel inside the file too, but a 1080p master would
# make this a multi-megabyte download on a phone. Prefer a 720p preview cut when
# one exists; it is plenty for judging framing, and the repo keeps the master.
vdir = ROOT / 'public' / 'video'
mp4 = vdir / 'hero-preview.mp4' if (vdir / 'hero-preview.mp4').exists() else vdir / 'hero.mp4'
srcs = [(vdir / 'hero.webm', 'video/webm'), (mp4, 'video/mp4')]
srcs = [(f, t) for f, t in srcs if f.exists()] if '</video>' in body else []
if srcs:
    body = re.sub(r'<source[^>]*>', '', body)                 # the app's file-path sources
    tags = ''.join('<source src="data:%s;base64,%s" type="%s">'
                   % (t, base64.b64encode(f.read_bytes()).decode(), t) for f, t in srcs)
    body = body.replace('</video>', tags + '</video>')
    master = srcs[-1][0]
    poster = vdir / 'hero-poster.jpg'
    if poster.exists():
        body = re.sub(r'poster="[^"]*"',
                      'poster="data:image/jpeg;base64,%s"'
                      % base64.b64encode(poster.read_bytes()).decode(), body)
    print('inlined hero video: %s (%.2f MB)' % (master.name, master.stat().st_size / 1048576))

title = re.search(r'<title>(.*?)</title>', html, re.S)
scripts = ''.join('\n<script>\n%s\n</script>' % (ROOT / 'public' / s_).read_text()
                  for s_ in ('globe.js', 'motion.js')
                  if ('/' + s_) in html and (ROOT / 'public' / s_).exists())
OUT.write_text("<title>%s</title>\n<style>\n%s\n</style>\n%s%s\n"
               % (title.group(1) if title else 'EC Home Improvement', css, body, scripts))
print('%s  %d photos, %d webfonts, %.2f MB' % (OUT, n, len(fonts), OUT.stat().st_size / 1048576))
