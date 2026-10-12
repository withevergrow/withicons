#!/usr/bin/env node
// Load a demo ONCE and walk it through every style (and the three levels): per-style metrics + an optional montage PNG.
//
//   node demos/_tools/sweep.mjs site/demos/haunted-hollow.html                          all 34 styles at level 2, metrics only
//   node demos/_tools/sweep.mjs site/demos/haunted-hollow.html --montage clay,line,kawaii,engrave,glass,sticker --out .preview/hh-sweep
//   options: --level 2   --width 1280   --height 800   --styles a,b,c (subset)   --scroll 0 (scroll position in px for the montage frames)
// Metrics per style: icons not rendered, icons that look empty (no paths), console errors, horizontal overflow, page height.
// Exit code 1 when any style leaves icons unrendered, errors in the console, or overflows horizontally.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { launch, autoscroll, sleep } from './browser.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const ALL = 'line solid duo suite bento dock brutal bauhaus clay glass liquid chrome soft3d luxe skeuo kawaii plush sticker gloss pastel pixel retro sketch engrave blueprint anime gothic coquette utsav rangoli halloween christmas lunar valentine'.split(' ')
const argv = process.argv.slice(2), a = { _: [] }
for (let i = 0; i < argv.length; i++) { if (argv[i].startsWith('--')) { a[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true } else a._.push(argv[i]) }
if (!a._[0]) { console.error('usage: sweep.mjs <page.html> [--montage a,b,c] [--styles a,b] [--level 2] [--out prefix]'); process.exit(2) }
const file = path.resolve(a._[0]), slug = path.basename(file, '.html')
const W = Number(a.width || 1280), H = Number(a.height || 800), level = Number(a.level ?? 2)
const styles = a.styles ? String(a.styles).split(',') : ALL
const montage = a.montage ? String(a.montage).split(',') : []
const out = a.out ? path.resolve(a.out) : path.join(ROOT, '.preview', `sweep-${slug}`)
fs.mkdirSync(path.dirname(out), { recursive: true })

const browser = await launch()
const page = await browser.newPage()
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 })
await page.evaluateOnNewDocument(() => { try { localStorage.clear() } catch (e) {} })
let errs = []
page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)) })
page.on('pageerror', e => errs.push('pageerror: ' + String(e.message).slice(0, 200)))
await page.goto(pathToFileURL(file).href + `#lv=${level}&panel=hide`, { waitUntil: 'networkidle2', timeout: 90000 })
await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {})
await autoscroll(page)
const scrollTo = Number(a.scroll || 0)

const rows = [], frames = []
const hashes = () => page.evaluate(() => {
  const vis = h => h.getClientRects().length > 0
  const h32 = str => { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return h }
  return [...document.querySelectorAll('.kit-ico,.kit-live')].filter(vis).map(h => { const e = h.querySelector('with-icon,with-live-icon'); const sv = e && e.shadowRoot && e.shadowRoot.querySelector('svg'); return sv ? h32(sv.outerHTML + (h.hasAttribute('data-fixed-style') ? 'F' + Math.random() : '')) : 0 })
})
let prev = await hashes()
for (const s of styles) {
  errs = []
  await page.evaluate(st => window.WithKit.setStyle(st), s)
  const t0 = Date.now()
  let last = null, stable = 0, cur = prev
  while (Date.now() - t0 < 14000) {
    await sleep(300)
    cur = await hashes()
    const same = last && cur.length === last.length && cur.every((x, i) => x === last[i])
    stable = same ? stable + 1 : 0
    last = cur
    if (stable >= 3) break
  }
  const m = await page.evaluate(() => {
    const vis = h => h.getClientRects().length > 0
    const hosts = [...document.querySelectorAll('.kit-ico,.kit-live')].filter(vis)
    const wi = h => h.querySelector('with-icon,with-live-icon')
    const bad = hosts.filter(h => { const e = wi(h); const sv = e && e.shadowRoot && e.shadowRoot.querySelector('svg'); return !sv })
    const empty = hosts.filter(h => { const e = wi(h); const sv = e && e.shadowRoot && e.shadowRoot.querySelector('svg'); return sv && !sv.querySelector('path,circle,rect,ellipse,line,polyline,polygon,g,use') })
    return { total: hosts.length, notRendered: bad.length, sample: bad.slice(0, 3).map(h => h.getAttribute('data-ico') || h.getAttribute('data-live')), empty: empty.length, overflow: document.documentElement.scrollWidth > innerWidth + 1, height: document.documentElement.scrollHeight }
  })
  const stale = cur.filter((x, i) => x === prev[i]).length
  const staleNames = await page.evaluate(idx => { const hs = [...document.querySelectorAll('.kit-ico,.kit-live')].filter(h => h.getClientRects().length); return idx.map(i => hs[i] && (hs[i].getAttribute('data-ico') || hs[i].getAttribute('data-live'))) }, cur.map((x, i) => x === prev[i] ? i : -1).filter(i => i >= 0).slice(0, 4))
  rows.push({ style: s, ...m, stale, staleNames, settleMs: Date.now() - t0, errors: errs.length })
  prev = cur
  if (montage.includes(s)) {
    await page.evaluate(y => scrollTo(0, y), scrollTo); await sleep(450)
    const f = `${out}-${s}.png`; await page.screenshot({ path: f }); frames.push({ s, f })
  }
}

if (frames.length) {
  const cols = frames.length > 4 ? 3 : 2
  const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#111;display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;padding:6px}figure{margin:0;position:relative}img{width:100%;display:block}figcaption{position:absolute;left:8px;top:8px;background:#000c;color:#fff;font:700 14px system-ui;padding:3px 9px;border-radius:99px}</style>${frames.map(x => `<figure><img src="file:///${x.f.replace(/\\/g, '/')}"><figcaption>${x.s}</figcaption></figure>`).join('')}`
  const hf = `${out}-montage.html`; fs.writeFileSync(hf, html)
  const p2 = await browser.newPage(); await p2.setViewport({ width: 1900, height: 900 })
  await p2.goto(pathToFileURL(hf).href, { waitUntil: 'load' }); await sleep(500)
  await p2.screenshot({ path: `${out}-montage.png`, fullPage: true })
}
await browser.close()

const bad = rows.filter(r => r.notRendered || r.errors || r.overflow || r.empty || r.stale > Math.max(2, r.total * 0.15))
console.log(rows.map(r => `${r.style.padEnd(10)} icons=${String(r.total).padStart(3)} notRendered=${r.notRendered}${r.sample.length ? ' [' + r.sample.join(',') + ']' : ''} empty=${r.empty} stale=${r.stale}${r.stale > 1 ? ' [' + r.staleNames.join(',') + ']' : ''} errors=${r.errors} overflow=${r.overflow ? 'YES' : 'no'} h=${r.height}`).join('\n'))
const heights = rows.map(r => r.height), spread = Math.max(...heights) - Math.min(...heights)
console.log(`\n${rows.length} styles, ${bad.length} with problems; page height spread across styles: ${spread}px${frames.length ? '\nmontage: ' + path.relative(ROOT, out + '-montage.png') : ''}`)
process.exit(bad.length ? 1 : 0)
