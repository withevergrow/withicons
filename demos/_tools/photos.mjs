#!/usr/bin/env node
// Photo catalogue tool for the demos. Catalogues live in demos/_data/photos/<slug>.json (see demos/README.md).
//
//   node demos/_tools/photos.mjs probe <image-url> [...]   status + real pixel size of each URL (no download kept)
//   node demos/_tools/photos.mjs build <slug>              re-probe every photo of a catalogue, fill width/height/orientation, exit 1 on any non-200
//   node demos/_tools/photos.mjs sheet <slug>              contact sheet PNG -> .preview/photos-<slug>.png  (LOOK at it before you trust a photo)
//   node demos/_tools/photos.mjs url <slug> <index|id> [w]  print the final hot-link URL at a width
//
// Hot-link rules: Pexels  https://images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?auto=compress&cs=tinysrgb&w=<W>
//                 Unsplash <catalogue url>?auto=format&fit=max&w=<W>&q=75      (the catalogue url is the bare images.unsplash.com/photo-... link)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { launch, sleep } from './browser.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DATA = path.join(ROOT, 'demos', '_data', 'photos')

export function photoUrl(p, w = 1200) {
  if (p.src === 'pexels') return `${p.url}?auto=compress&cs=tinysrgb&w=${w}`
  return `${p.url}${p.url.includes('?') ? '&' : '?'}auto=format&fit=max&w=${w}&q=75`
}

// Read the head of the image and pull the size out of the JPEG start-of-frame marker.
export async function probe(url) {
  const out = { url, status: 0, type: '', width: 0, height: 0 }
  try {
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 30000)
    const res = await fetch(url, { signal: ctl.signal, headers: { Range: 'bytes=0-262143', 'User-Agent': 'withicons-demos/1.0' } })
    out.status = res.status
    out.type = res.headers.get('content-type') || ''
    if (res.ok || res.status === 206) {
      const chunks = []; let got = 0
      const reader = res.body.getReader()
      while (got < 262144) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value); got += value.length
      }
      try { await reader.cancel() } catch {}
      const b = Buffer.concat(chunks.map(c => Buffer.from(c)))
      let i = 2
      while (i + 9 < b.length) {
        if (b[i] !== 0xff) { i++; continue }
        const m = b[i + 1]
        if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) { out.height = b.readUInt16BE(i + 5); out.width = b.readUInt16BE(i + 7); break }
        i += 2 + b.readUInt16BE(i + 2)
      }
    }
    clearTimeout(t)
  } catch (e) { out.error = String(e.message || e) }
  return out
}

const orient = (w, h) => !w || !h ? '' : w / h > 1.15 ? 'landscape' : w / h < 0.87 ? 'portrait' : 'square'

function load(slug) {
  const f = path.join(DATA, `${slug}.json`)
  if (!fs.existsSync(f)) throw new Error(`No catalogue ${f}`)
  return { f, doc: JSON.parse(fs.readFileSync(f, 'utf8')) }
}

const [cmd, ...rest] = process.argv.slice(2)
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('photos.mjs')) {
  if (cmd === 'probe') {
    for (const u of rest) console.log(JSON.stringify(await probe(u)))
  } else if (cmd === 'build') {
    const { f, doc } = load(rest[0])
    let bad = 0
    for (const p of doc.photos) {
      const r = await probe(photoUrl(p, 1200))
      p.width = r.width || p.width; p.height = r.height || p.height; p.orientation = orient(p.width, p.height)
      const ok = r.status === 200 || r.status === 206
      if (!ok) bad++
      console.log(`${ok ? 'ok ' : 'BAD'} ${String(r.status).padEnd(4)} ${String(p.width).padStart(5)}x${String(p.height).padEnd(5)} ${p.orientation.padEnd(9)} ${p.slot.padEnd(14)} ${p.src}:${p.id}  ${p.photographer}`)
    }
    fs.writeFileSync(f, JSON.stringify(doc, null, 2) + '\n')
    console.log(`${doc.photos.length} photos, ${bad} bad`)
    process.exit(bad ? 1 : 0)
  } else if (cmd === 'url') {
    const { doc } = load(rest[0])
    const p = doc.photos[Number(rest[1])] || doc.photos.find(x => x.id === rest[1])
    console.log(photoUrl(p, Number(rest[2]) || 1200))
  } else if (cmd === 'sheet') {
    const { doc } = load(rest[0])
    const cells = doc.photos.map((p, i) => `<figure><img src="${photoUrl(p, 520)}" alt=""><figcaption><b>#${i} ${p.slot}</b> <i>${p.orientation || ''} ${p.width || ''}x${p.height || ''}</i><br>${p.src} ${p.id}<br>${p.photographer}<br><span>${(p.alt || '').replace(/</g, '&lt;')}</span></figcaption></figure>`).join('')
    const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:14px;background:#f3f1ed;font:12px/1.35 system-ui,sans-serif;color:#222}h1{font-size:16px;margin:0 0 10px}main{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}figure{margin:0;background:#fff;border-radius:8px;overflow:hidden}img{display:block;width:100%;height:230px;object-fit:cover;background:#ddd}figcaption{padding:6px 8px}i{color:#777;font-style:normal}span{color:#555}</style><h1>${doc.slug || rest[0]}: ${doc.photos.length} photos</h1><main>${cells}</main>`
    fs.mkdirSync(path.join(ROOT, '.preview'), { recursive: true })
    const htmlFile = path.join(ROOT, '.preview', `photos-${rest[0]}.html`)
    fs.writeFileSync(htmlFile, html)
    const browser = await launch()
    const page = await browser.newPage()
    await page.setViewport({ width: 1500, height: 900 })
    await page.goto('file:///' + htmlFile.replace(/\\/g, '/'), { waitUntil: 'networkidle2', timeout: 90000 })
    await sleep(600)
    const out = path.join(ROOT, '.preview', `photos-${rest[0]}.png`)
    await page.screenshot({ path: out, fullPage: true })
    await browser.close()
    console.log(out)
  } else {
    console.log('usage: photos.mjs probe <url...> | build <slug> | sheet <slug> | url <slug> <index|id> [w]')
    process.exit(2)
  }
}
