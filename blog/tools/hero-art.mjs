// Renders the designed Journal heroes: blog/heroes/<slug>.mjs -> blog/images/h-<slug>-{1600,800}.webp + h-<slug>-og.jpg,
// and registers each one in blog/images.json (credited to the Unsplash photographer of its base photo).
//
//   node blog/tools/hero-art.mjs --only=slug,slug --preview   look first: writes .preview/heroes/<slug>.jpg (+ -og.jpg)
//   node blog/tools/hero-art.mjs --only=slug --preview --guides    the same with the crop / reserved zones drawn on
//   node blog/tools/hero-art.mjs [--only=...]                   final files + images.json (one writer at a time)
//
// Needs Google Chrome (puppeteer-core drives it). Spec format and safe zones: blog/tools/hero-kit.mjs.
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import puppeteer from 'puppeteer-core'
import { KIT_CSS, C, PAPER, INK } from './hero-kit.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const BLOG = path.resolve(HERE, '..')
const ROOT = path.resolve(BLOG, '..')
const SPECS = path.join(BLOG, 'heroes')
const TMP = path.join(ROOT, '.tmp', 'heroes')
const PREVIEW = path.join(ROOT, '.preview', 'heroes')
const IMAGES = path.join(BLOG, 'images')
const REGISTRY = path.join(BLOG, 'images.json')
const args = process.argv.slice(2)
const ONLY = (args.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean)
const PREV = args.includes('--preview'), GUIDES = args.includes('--guides')
const CHROME = process.env.CHROME || ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find(p => fs.existsSync(p))
const CATS = { comparisons: 'Comparison', guides: 'Guide', basics: 'Design basics', ai: 'AI & tools' }
const CAT_STYLE = { comparisons: 'line', guides: 'solid', basics: 'duo', ai: 'gloss' }
const reg = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'))
const url = f => pathToFileURL(f).href
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const slugs = fs.readdirSync(SPECS).filter(f => f.endsWith('.mjs') && !f.startsWith('_')).map(f => f.slice(0, -4)).filter(s => !ONLY.length || ONLY.includes(s)).sort()
if (!slugs.length) { console.error('hero-art: no specs matched'); process.exit(1) }
fs.mkdirSync(TMP, { recursive: true }); fs.mkdirSync(PREVIEW, { recursive: true })

// the photo under the art: a registered photo key (base), a new file in blog/heroes/assets/ (photoFile + credit), or none
const photoPath = spec => spec.photoFile ? path.join(SPECS, 'assets', spec.photoFile) : spec.base ? path.join(IMAGES, `${spec.base}-1600.webp`) : null
function page(spec, inner, w, h, extraCss = '') {
  const photo = photoPath(spec)
  if (photo && !fs.existsSync(photo)) throw new Error(`photo not found: ${photo}`)
  const ph = spec.photo || {}
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${url(path.join(ROOT, 'site', 'css', 'tokens.css'))}"><style>
html, body { margin: 0; width: ${w}px; height: ${h}px; overflow: hidden; background: ${PAPER}; }
.stage { position: absolute; left: 0; top: 0; width: 1600px; height: 1000px; overflow: hidden; background: ${spec.bg || PAPER}; font-family: var(--font-display); color: ${INK}; }
.stage__photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${ph.pos || '50% 50%'}; filter: ${ph.filter || 'none'}; ${ph.scale ? `transform: scale(${ph.scale});` : ''} }
.stage__overlay { position: absolute; inset: 0; background: ${spec.overlay || 'none'}; }
.stage__art { position: absolute; inset: 0; }
${KIT_CSS}
${spec.css || ''}
${extraCss}
</style></head><body>${inner}</body></html>`
}
const stage = spec => `<div class="stage">${photoPath(spec) ? `<img class="stage__photo" src="${url(photoPath(spec))}" alt="">` : ''}<div class="stage__overlay"></div><div class="stage__art">${spec.art()}</div>${GUIDES ? guides() : ''}</div>`
function guides() {
  const z = 'position:absolute;pointer-events:none;z-index:99;'
  return `<div style="${z}left:0;right:0;top:0;height:100px;background:rgba(255,0,0,.25)"></div><div style="${z}left:0;right:0;bottom:0;height:100px;background:rgba(255,0,0,.25)"></div>
<div style="${z}top:0;bottom:0;left:0;width:135px;background:rgba(0,0,255,.2)"></div><div style="${z}top:0;bottom:0;right:0;width:135px;background:rgba(0,0,255,.2)"></div>
<div style="${z}left:0;bottom:0;width:700px;height:400px;background:repeating-linear-gradient(45deg,rgba(255,200,0,.35) 0 14px,transparent 14px 28px)"></div>`
}
// social card: the hero scaled to 1200 wide (y 80..920 of the stage shows), plus a title card in the reserved corner
function ogPage(spec, post) {
  const st = CAT_STYLE[post.category] || 'line', col = C[st]
  const title = esc(post.ogTitle || post.cardTitle || post.title)
  return page(spec, `<div style="position:absolute;left:0;top:-60px;width:1600px;height:1000px;transform:scale(.75);transform-origin:0 0">${stage(spec)}</div>
<div class="og-card"><span class="og-eyebrow" style="color:${col.text}"><i style="background:${col.c}"></i>${CATS[post.category] || 'Journal'}</span><strong>${title}</strong><span class="og-brand"><img src="${url(path.join(ROOT, 'site', 'brand', 'logo.svg'))}" alt="">Journal</span></div>`, 1200, 630, `
.og-card { position: absolute; left: 34px; bottom: 34px; width: 470px; box-sizing: border-box; padding: 26px 28px 22px; border-radius: 26px; background: ${PAPER}; box-shadow: 0 30px 70px -30px rgba(17,19,24,.6); border: 1px solid rgba(17,19,24,.06); font-family: var(--font-display); color: ${INK}; }
.og-eyebrow { display: flex; align-items: center; gap: 10px; font: 700 17px/1 var(--font-display); text-transform: uppercase; letter-spacing: .08em; }
.og-eyebrow i { width: 12px; height: 12px; border-radius: 4px; }
.og-card strong { display: block; margin: 14px 0 18px; font-weight: 800; font-size: ${title.length > 60 ? 30 : title.length > 42 ? 34 : 38}px; line-height: 1.06; letter-spacing: -.03em; text-wrap: balance; }
.og-brand { display: flex; align-items: center; gap: 10px; font: 600 18px/1 var(--font-display); color: #5A606D; }
.og-brand img { height: 26px; }`)
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files', '--hide-scrollbars', '--force-color-profile=srgb'] })
const tab = await browser.newPage()
async function shot(html, name, w, h, opts) {
  const f = path.join(TMP, name + '.html'); fs.writeFileSync(f, html)
  await tab.setViewport({ width: w, height: h, deviceScaleFactor: opts.dpr || 1 })
  await tab.goto(url(f), { waitUntil: 'load' })
  await tab.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))) })
  return tab.screenshot({ type: opts.type, quality: opts.quality, clip: { x: 0, y: 0, width: w, height: h } })
}
// highest quality that fits the page-weight caps (blog/tools/cap-images.py: 300 KB / 120 KB)
async function fit(html, name, w, h, dpr, cap) {
  let buf
  for (const q of [82, 76, 70, 64, 58]) { buf = await shot(html, name, w, h, { type: 'webp', quality: q, dpr }); if (buf.length <= cap) break }
  return buf
}

const posts = new Map()
for (const slug of slugs) {
  const f = path.join(BLOG, 'posts', `${slug}.mjs`)
  if (fs.existsSync(f)) posts.set(slug, (await import(url(f))).default)
}
let n = 0
for (const slug of slugs) {
  const spec = (await import(url(path.join(SPECS, `${slug}.mjs`)) + `?t=${Date.now()}`)).default
  const post = posts.get(slug) || { title: slug, category: 'guides' }
  if (spec.base && !reg[spec.base]) throw new Error(`${slug}: base "${spec.base}" is not a photo in blog/images.json`)
  if (spec.photoFile && !(spec.credit?.by && spec.credit?.source)) throw new Error(`${slug}: a new photo (photoFile) needs credit { by, profile, source, license }`)
  if (!spec.alt || spec.alt.length < 40) throw new Error(`${slug}: alt text should describe the artwork (40+ chars)`)
  const hero = page(spec, stage(spec), 1600, 1000)
  const og = ogPage(spec, post)
  if (PREV) {
    fs.writeFileSync(path.join(PREVIEW, `${slug}.jpg`), await shot(hero, slug, 1600, 1000, { type: 'jpeg', quality: 86 }))
    fs.writeFileSync(path.join(PREVIEW, `${slug}-og.jpg`), await shot(og, slug + '-og', 1200, 630, { type: 'jpeg', quality: 86 }))
    console.log(`  preview ${slug}: .preview/heroes/${slug}.jpg, ${slug}-og.jpg`)
  } else {
    const key = `h-${slug}`
    const big = await fit(hero, slug, 1600, 1000, 1, 300_000)
    const small = await fit(hero, slug + '-800', 1600, 1000, 0.5, 120_000)
    fs.writeFileSync(path.join(IMAGES, `${key}-1600.webp`), big)
    fs.writeFileSync(path.join(IMAGES, `${key}-800.webp`), small)
    fs.writeFileSync(path.join(IMAGES, `${key}-og.jpg`), await shot(og, slug + '-og', 1200, 630, { type: 'jpeg', quality: 84 }))
    const b = spec.base ? reg[spec.base] : spec.credit || {}
    reg[key] = { alt: spec.alt, ...(b.by ? { by: b.by, profile: b.profile, source: b.source, license: b.license } : { license: 'with icons artwork (MIT)' }), ...(spec.base ? { base: spec.base } : spec.photoFile ? { photoFile: spec.photoFile } : {}), designed: true }
    console.log(`  ${key}: ${Math.round(big.length / 1000)} KB / ${Math.round(small.length / 1000)} KB`)
  }
  n++
}
await browser.close()
if (!PREV) fs.writeFileSync(REGISTRY, JSON.stringify(reg, null, 1) + '\n')
console.log(`hero-art: ${n} hero${n === 1 ? '' : 's'} ${PREV ? 'previewed' : 'written'}`)
