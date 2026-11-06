"""Fetch a free photo from Unsplash or Pexels for a designed Journal image.

  python blog/tools/get-photo.py <photo page URL> <name>

  python blog/tools/get-photo.py https://unsplash.com/photos/macbook-pro-hGV2TfOh0ns desk-mac
  python blog/tools/get-photo.py https://www.pexels.com/photo/person-using-laptop-1181244/ laptop-hands

Saves blog/media/photos/<name>.jpg (at most 1600 px wide, JPEG q85). Use it in a hero or in-post image spec as
  photoFile: '<name>.jpg', credit: { by: 'Photographer', profile: '<their profile URL>', source: '<the page URL>', license: 'Unsplash License' | 'Pexels License' }
Only use photos from unsplash.com or pexels.com (free licences); the credit is shown under the image. Needs Pillow.
"""
import io, os, re, subprocess, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'media', 'photos')

def download_url(page):
    m = re.match(r'https?://(www\.)?unsplash\.com/photos/(?:[a-z0-9-]*-)?([A-Za-z0-9_-]{11})/?$', page)
    if m: return f'https://unsplash.com/photos/{m.group(2)}/download?force=true&w=2000'
    m = re.match(r'https?://(www\.)?pexels\.com/photo/(?:[a-z0-9-]*-)?(\d+)/?$', page)
    if m: i = m.group(2); return f'https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?auto=compress&cs=tinysrgb&w=2000'
    sys.exit('get-photo: give an unsplash.com/photos/... or pexels.com/photo/... page URL')

def main():
    if len(sys.argv) != 3: sys.exit(__doc__)
    page, name = sys.argv[1], sys.argv[2]
    if not re.fullmatch(r'[a-z0-9-]+', name): sys.exit('get-photo: name must be kebab-case (a-z, 0-9, -)')
    # curl, not urllib: Unsplash's download link redirects to a signed image URL that urllib's redirect handling breaks (HTTP 401)
    r = subprocess.run(['curl', '-sSL', '--fail', '-A', 'withicons-journal/1.0', download_url(page)], capture_output=True)
    if r.returncode != 0:
        sys.exit('get-photo: download failed (%s). If it is an Unsplash+ photo it is paid, not free: pick another one.' % r.stderr.decode(errors='replace').strip())
    data = r.stdout
    im = Image.open(io.BytesIO(data)).convert('RGB')
    if im.width > 1600: im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    dest = os.path.join(OUT, f'{name}.jpg')
    im.save(dest, 'JPEG', quality=85, optimize=True, progressive=True)
    print(f'saved blog/media/photos/{name}.jpg ({im.width}x{im.height}, {os.path.getsize(dest) // 1000} KB). Add its credit to your spec.')

if __name__ == '__main__':
    main()
