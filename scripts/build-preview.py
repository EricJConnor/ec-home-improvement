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
ROOT = pathlib.Path(__file__).resolve().parent.parent

html = urllib.request.urlopen(BASE + '/').read().decode()

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

def img(m):
    return 'src="data:image/jpeg;base64,%s"' % base64.b64encode(
        (ROOT / 'public' / m.group(1).lstrip('/')).read_bytes()).decode()
body, n = re.subn(r'src="(/assets/[^"]+)"', img, body)

OUT.write_text(
    "<title>EC Home Improvement</title>\n<style>\n%s\n</style>\n%s\n<script>\n%s\n</script>\n"
    % (css, body, (ROOT / 'public' / 'motion.js').read_text()))
print('%s  %d photos, %d webfonts, %.2f MB' % (OUT, n, len(fonts), OUT.stat().st_size / 1048576))
