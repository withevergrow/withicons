#!/usr/bin/env node
// Self-host the demo photos: download every Pexels / Unsplash image a published demo page uses into
// site/demos/_img/<slug>/<id>-<w>.jpg and point the page at the local copy. Idempotent: files that already exist are
// kept, pages that are already local are left alone, and each run records the local paths in demos/_data/photos/<slug>.json
// (photo.local = { "<w>": "_img/<slug>/<id>-<w>.jpg" }).
//
//   node demos/_tools/localize-photos.mjs [slug ...]      default: every site/demos/<slug>.html
//   node demos/_tools/localize-photos.mjs --check         exit 1 if a page still hot-links a photo or misses a local file
//
// What it understands in a page:
//   1. literal hot links  https://images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?...w=<W>
//                         https://images.unsplash.com/photo-<...>?...w=<W>          (src, srcset, CSS url(), JS strings)
//      -> rewritten to _img/<slug>/<id>-<W>.jpg
//   2. local references   <id>-<W>.jpg (also when a page builds the path in JS, e.g. IMG + '123-600.jpg')
//   3. pages that build the width at runtime (helper(id, w)) declare "localize": { "widths": [...] } in their catalogue:
//      every catalogue photo whose id appears in the page is fetched at each of those widths.
// Credit links to photographer / photo pages (www.pexels.com, unsplash.com) are untouched.
// Image bytes: Pexels ?auto=compress&cs=tinysrgb&w=W (JPEG), Unsplash ?fm=jpg&fit=max&w=W&q=75 (JPEG). Hero widths are capped at 1600.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const SITE = path.join(ROOT, 'site', 'demos')
const DATA = path.join(ROOT, 'demos', '_data', 'photos')
const MAX_W = 1600

const args = process.argv.slice(2)
const check = args.includes('--check')
const slugs = args.filter(a => !a.startsWith('--'))
const pages = slugs.length ? slugs : fs.readdirSync(SITE).filter(f => f.endsWith('.html') && f !== 'index.html').map(f => f.slice(0, -5))

const HOT = /https:\/\/images\.(pexels|unsplash)\.com\/(?:photos\/(\d+)\/pexels-photo-\d+\.jpeg|(photo-[\w-]+))(\?[^"'\s)<>,]*)?/g
const LOCAL = /(\d{4,}|photo-\d+-[0-9a-f]+)-(\d{2,4})\.jpg/g

const remote = (id, w) => /^\d+$/.test(id)
  ? `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`
  : `https://images.unsplash.com/${id}?fm=jpg&fit=max&w=${w}&q=75`

async function download(url, file) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'withicons-demos/1.0' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('not a JPEG')
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, buf)
      return buf.length
    } catch (e) { if (i === 2) throw new Error(`${url}: ${e.message}`) }
  }
}

let bad = 0, total = 0, files = 0, fetched = 0
for (const slug of pages) {
  const pageFile = path.join(SITE, `${slug}.html`)
  let html = fs.readFileSync(pageFile, 'utf8')
  const catFile = path.join(DATA, `${slug}.json`)
  const cat = fs.existsSync(catFile) ? JSON.parse(fs.readFileSync(catFile, 'utf8')) : null
  const want = new Map() // "<id>-<w>" -> {id, w}
  const need = (id, w) => { w = Math.min(Number(w), MAX_W); want.set(`${id}-${w}`, { id, w }); return `_img/${slug}/${id}-${w}.jpg` }

  // 1. literal hot links
  html = html.replace(HOT, (m, host, pid, uid, q = '') => {
    const id = pid || uid
    const w = (q.replace(/&amp;/g, '&').match(/[?&]w=(\d+)/) || [])[1]
    if (!w) { if (check) console.log(`  ${slug}: hot link without width ${m}`); return m } // built in JS; must be fixed by hand
    return need(id, w)
  })
  // 2. local references
  for (const m of html.matchAll(LOCAL)) need(m[1], m[2])
  // 3. runtime widths
  if (cat?.localize?.widths) for (const p of cat.photos) {
    const id = p.src === 'pexels' ? p.id : p.url.split('/').pop()
    if (html.includes(id)) for (const w of cat.localize.widths) need(id, w)
  }

  const left = [...html.matchAll(HOT)].length
  if (left) { bad++; console.log(`  ${slug}: ${left} hot link(s) left`) }
  for (const { id, w } of want.values()) {
    const file = path.join(SITE, '_img', slug, `${id}-${w}.jpg`)
    if (!fs.existsSync(file)) {
      if (check) { bad++; console.log(`  ${slug}: missing ${path.relative(ROOT, file)}`); continue }
      await download(remote(id, w), file); fetched++
    }
    total += fs.statSync(file).size; files++
  }
  if (!check) {
    fs.writeFileSync(pageFile, html)
    if (cat) {
      for (const p of cat.photos) {
        const id = p.src === 'pexels' ? p.id : p.url.split('/').pop()
        const local = {}
        for (const { id: i, w } of [...want.values()].sort((a, b) => a.w - b.w)) if (i === id) local[w] = `_img/${slug}/${id}-${w}.jpg`
        if (Object.keys(local).length) p.local = local; else delete p.local
      }
      fs.writeFileSync(catFile, JSON.stringify(cat, null, 2) + '\n')
    }
    // drop files the page no longer uses
    const dir = path.join(SITE, '_img', slug)
    if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (!want.has(f.replace(/\.jpg$/, ''))) fs.rmSync(path.join(dir, f))
  }
  console.log(`${slug.padEnd(22)} ${String(want.size).padStart(3)} images`)
}
console.log(`${files} files, ${(total / 1048576).toFixed(1)} MB, ${fetched} downloaded${check ? `, ${bad} problem(s)` : ''}`)
process.exit(bad ? 1 : 0)
