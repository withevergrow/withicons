"""Re-encode oversized blog photos so pages stay light on phones.

  python blog/tools/cap-images.py [--dry-run] [--out DIR]

Every blog/images/<key>-1600.webp over 300 KB and <key>-800.webp over 120 KB is re-encoded as WebP at the highest
quality from 75 down to 65 that fits the cap (q65 if none does: lower visibly dulls fine detail). Files already under their cap are left alone, so
running it twice changes nothing (a photo that would shrink by less than 15% is kept as is). Needs Pillow (pip install pillow). blog/build.mjs warns when a photo is well over its cap (400 KB / 160 KB).
"""
import io, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'images')
CAPS = {'-1600.webp': 300_000, '-800.webp': 120_000}

def encode(im, q):
    b = io.BytesIO(); im.save(b, 'WEBP', quality=q, method=6); return b.getvalue()

def main():
    dry = '--dry-run' in sys.argv
    out = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else SRC
    os.makedirs(out, exist_ok=True)
    for f in sorted(os.listdir(SRC)):
        cap = next((c for s, c in CAPS.items() if f.endswith(s)), None)
        p = os.path.join(SRC, f)
        if cap is None or os.path.getsize(p) <= cap: continue
        im = Image.open(p); im.load()
        best = None
        for q in range(75, 64, -5):
            best = (q, encode(im, q))
            if len(best[1]) <= cap: break
        q, data = best
        size = os.path.getsize(p)
        # already squeezed once (a further pass would only stack generation loss for a few KB): leave it
        if len(data) > size * 0.85:
            print(f'{f}: {size // 1000} KB, already at its floor, kept'); continue
        print(f'{f}: {size // 1000} KB -> {len(data) // 1000} KB (q{q})')
        if not dry:
            with open(os.path.join(out, f), 'wb') as fh: fh.write(data)

main()
