#!/usr/bin/env node
// SEO + GEO layer for withicons.com. Deterministic, self-sufficient, fast on re-runs.
//   site/icons/<name>.html        one crawlable page per icon: see it -> pick a style -> grab it -> customize (js/editor.js)
//                                 -> see it in use -> apps, styles, related, names -> developers -> FAQ
//   site/categories/<cat>.html    category hubs          site/styles/<style>.html   style hubs
//   site/sprites/<style>.svg      symbol sprites (ids with-<name>)
//   site/og/*.png                 Open Graph cards (resvg): default, one per icon, style and category
//   site/icons.html               JSON-LD + crawlable A–Z index injected between markers
//   site/sitemap.xml  site/robots.txt  site/llms.txt  site/llms-full.txt  site/icons.json
// Icons render through forge/lib/load.mjs. Renders and OG images are cached by content hash in
// node_modules/.cache/withicons-seo, and cold renders are spread over worker threads.
//   node forge/tools/site-seo.mjs [--no-og] [--force]
import fs from 'fs'
import os from 'os'
import path from 'path'
import crypto from 'crypto'
import zlib from 'zlib'
import { fileURLToPath } from 'url'
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
import { ROOT, ICON_DIR, STYLE_DIR, listIcons, loadIcon, loadStyles, renderIcon, nodesToMarkup, readManifest, attrs, resolveVars } from '../lib/load.mjs'

const SELF = fileURLToPath(import.meta.url)

/* ───────────────────────── worker: render a slice of icons ───────────────────────── */
if (!isMainThread && workerData && workerData.withSeoWorker) {
  const styles = await loadStyles()
  const out = {}
  for (const [n, want] of workerData.jobs) {
    const icon = loadIcon(n), svg = {}
    for (const sn of want) { svg[sn] = null; const st = styles[sn]; if (!st) continue; try { svg[sn] = nodesToMarkup(renderIcon(st, icon)) } catch { /* style failed for this icon */ } }
    out[n] = svg
  }
  parentPort.postMessage(out)
} else if (!isMainThread && workerData && workerData.withSeoOg) {
  const { Resvg } = await import('@resvg/resvg-js')
  for (const j of workerData.jobs) {
    const img = new Resvg(j.svg, { font: workerData.font, fitTo: { mode: 'original' }, background: '#FBF8F3' }).render()
    fs.writeFileSync(j.file, png8(img.pixels, img.width, img.height))
  }
  parentPort.postMessage(workerData.jobs.length)
} else {
  await main()
}

// RGBA -> 8-bit indexed PNG. OG cards are a handful of flat colours plus anti-aliasing ramps, so a
// frequency palette of 256 colours is visually lossless and 3-5x smaller than resvg's RGBA output.
function png8(rgba, w, h) {
  const px = w * h, key = new Uint32Array(px), count = new Map()
  for (let i = 0; i < px; i++) {
    const k = ((rgba[i * 4] >> 2) << 12) | ((rgba[i * 4 + 1] >> 2) << 6) | (rgba[i * 4 + 2] >> 2)
    key[i] = k; count.set(k, (count.get(k) || 0) + 1)
  }
  const pal = [...count.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]).slice(0, 256).map(e => e[0])
  const rgb = k => [((k >> 12) & 63) * 4 + 2, ((k >> 6) & 63) * 4 + 2, (k & 63) * 4 + 2]
  const palRgb = pal.map(rgb), index = new Map(pal.map((k, i) => [k, i]))
  const nearest = k => {
    const [r, g, b] = rgb(k); let best = 0, bd = Infinity
    for (let i = 0; i < palRgb.length; i++) { const p = palRgb[i], d = (p[0] - r) ** 2 * 3 + (p[1] - g) ** 2 * 4 + (p[2] - b) ** 2 * 2; if (d < bd) { bd = d; best = i } }
    index.set(k, best); return best
  }
  const raw = Buffer.alloc((w + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (w + 1)] = 0
    for (let x = 0; x < w; x++) { const k = key[y * w + x]; const i = index.get(k); raw[y * (w + 1) + 1 + x] = i === undefined ? nearest(k) : i }
  }
  const plte = Buffer.alloc(pal.length * 3)
  palRgb.forEach((c, i) => { plte[i * 3] = c[0]; plte[i * 3 + 1] = c[1]; plte[i * 3 + 2] = c[2] })
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 3
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]), crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td) >>> 0)
    return Buffer.concat([len, td, crc])
  }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('PLTE', plte), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))])
}

async function main() {
  const t0 = Date.now()
  const argv = process.argv.slice(2)
  const FORCE = argv.includes('--force'), NO_OG = argv.includes('--no-og')
  const SITE = path.join(ROOT, 'site')
  const CACHE_DIR = path.join(ROOT, 'node_modules', '.cache', 'withicons-seo')
  fs.mkdirSync(CACHE_DIR, { recursive: true })
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'forge', 'site.config.json'), 'utf8'))
  const BASE = cfg.url.replace(/\/$/, '')
  const BRAND = cfg.name || 'with icons'
  const REPO = 'https://github.com/withevergrow/withicons'
  const SCOPE = cfg.npmScope || '@withicons'
  const PUB = cfg.publisher || { name: 'Evergrow', url: 'https://withevergrow.com' }
  const VERSION = readJSON(path.join(ROOT, 'packages', 'core', 'package.json'))?.version || readJSON(path.join(ROOT, 'package.json'))?.version || '0.1.0'
  const YEAR = 2026
  const manifest = readManifest()
  const sha = s => crypto.createHash('sha1').update(s).digest('hex')

  /* ───────────── styles ───────────── */
  // canonical order (forge/CONTRACT.md); styles found in forge/styles but not listed here go last
  const ORDER = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch', 'glass', 'kawaii', 'sticker', 'pixel', 'retro']
  const GROUPS = [
    { id: 'everyday', title: 'Everyday', styles: ['line', 'solid', 'duo'] },
    { id: 'crafted', title: 'Crafted', styles: ['gloss', 'engrave', 'blueprint', 'sketch'] },
    { id: 'playful', title: 'Playful', styles: ['glass', 'kawaii', 'sticker', 'pixel', 'retro'] },
  ]
  const PALETTE = new Set(['glass', 'kawaii', 'sticker', 'pixel', 'retro'])
  // signature colours come from the design tokens (site/css/tokens.css, light theme) so pages, OG cards and data agree
  const TOKENS = (() => { try { const t = fs.readFileSync(path.join(ROOT, 'site', 'css', 'tokens.css'), 'utf8'); const i = t.indexOf(':root[data-theme'); return i > 0 ? t.slice(0, i) : t } catch { return '' } })()
  const HEX_FALLBACK = { line: '#2F5BFF', solid: '#FF5A36', duo: '#7252FF', gloss: '#FF4FA3', engrave: '#C9962B', blueprint: '#00A3C4', sketch: '#22A861', glass: '#5B9DFF', kawaii: '#FF7A9A', sticker: '#B57CFF', pixel: '#4FAE0C', retro: '#F57C12' }
  const tokenHex = n => (TOKENS.match(new RegExp(`--c-${n}:\\s*(#[0-9A-Fa-f]{6})\\b`)) || [])[1]
  const HEX = new Proxy({}, { get: (_, n) => tokenHex(n) || HEX_FALLBACK[n] || '#111318' })
  const PLAIN = {
    line: { say: 'Clean outlines. The everyday choice for apps, websites and slides.', good: 'menus, toolbars, buttons, dashboards, any size from 16px up' },
    solid: { say: 'Filled shapes with bold weight. Reads instantly, even tiny.', good: 'selected states, tab bars, small sizes, high contrast' },
    duo: { say: 'An outline over a soft tinted fill. Friendly, with a little depth.', good: 'feature lists, onboarding, landing pages, empty states' },
    gloss: { say: 'Puffy and glossy, like soft vinyl toys. Playful and eye-catching.', good: 'app launchers, hero sections, kids and consumer brands' },
    engrave: { say: 'Banknote-style engraving with fine hatching. Classic and premium.', good: 'editorial, finance, certificates, print, premium brands' },
    blueprint: { say: 'A technical drawing with construction lines. Precise and nerdy.', good: 'docs, engineering, architecture, developer tools' },
    sketch: { say: 'Loose marker strokes, like a whiteboard doodle. Warm and human.', good: 'education, workshops, onboarding, friendly products' },
    glass: { say: 'Layers of frosted glass with soft light. Modern and airy.', good: 'app screens, dashboards, tech launches, dark mode' },
    kawaii: { say: 'Chubby, soft and cute, with a tiny smiling face and rosy cheeks.', good: 'journals, kids, cafés, stickers, social posts' },
    sticker: { say: 'Shiny die-cut stickers with a puffy white border and sparkles.', good: 'social posts, merch, scrapbooks, Gen Z brands' },
    pixel: { say: 'Crisp pixel art, like an old video game.', good: 'games, hackathons, retro tech, fun interfaces' },
    retro: { say: 'Chunky 70s shapes with warm sunset stripes.', good: 'posters, events, cafés, music, vintage brands' },
  }
  const NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen']
  const numw = k => NUMW[k] || String(k)
  // text colour that reads on a filled swatch (AA): ink or white, whichever contrasts more
  const lumOf = h => hexRgb(h).map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }).reduce((a, c, k) => a + c * [0.2126, 0.7152, 0.0722][k], 0)
  function hexRgb(h) { h = h.replace('#', ''); const v = parseInt(h, 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255] }
  const onOf = h => { const L = lumOf(h); return (1.05 / (L + 0.05)) >= ((L + 0.05) / (lumOf('#111318') + 0.05)) ? '#FFFFFF' : '#111318' }
  const styleMods = await loadStyles()
  const STYLES = Object.values(styleMods).sort((a, b) => rank(a.name) - rank(b.name)).map(s => ({
    name: s.name, title: s.title || cap(s.name), kind: s.kind || 'creative', description: s.description || '', root: s.root || {}, strokeWidth: s.strokeWidth || false,
    hex: HEX[s.name], on: onOf(HEX[s.name]), group: (GROUPS.find(g => g.styles.includes(s.name)) || { id: 'more' }).id, palette: PALETTE.has(s.name),
    ...(PLAIN[s.name] || { say: s.description, good: '' }),
  }))
  function rank(n) { const i = ORDER.indexOf(n); return i < 0 ? 99 : i }
  const STYLE = Object.fromEntries(STYLES.map(s => [s.name, s]))
  // theme-aware style colour for inline use: the token (brighter in dark mode) with the light hex as fallback
  const scv = n => `--sc:var(--c-${n}, ${STYLE[n] ? STYLE[n].hex : HEX[n]});--sc-on:var(--c-${n}-on, ${STYLE[n] ? STYLE[n].on : '#FFFFFF'})`
  const NS = STYLES.length

  /* ───────────── icons ───────────── */
  const names = listIcons()
  const rawText = {}, ICONS = []
  for (const n of names) {
    rawText[n] = fs.readFileSync(path.join(ICON_DIR, `${n}.json`), 'utf8')
    const r = JSON.parse(rawText[n])
    const aliases = uniq((r.aliases || []).map(clean)).filter(a => a && a !== n)
    const synonyms = uniq((r.synonyms || []).map(clean)).filter(a => a && a !== n && !aliases.includes(a))
    ICONS.push({ name: n, title: titleOf(n), category: r.category || 'objects', description: (r.description || '').trim(), aliases, synonyms, tags: uniq(r.tags || []), mtime: fs.statSync(path.join(ICON_DIR, `${n}.json`)).mtime })
  }
  function clean(s) { return String(s || '').trim().toLowerCase() }
  const BY = Object.fromEntries(ICONS.map(i => [i.name, i]))
  const CATS = uniq([...(manifest.categories || []), ...ICONS.map(i => i.category)]).filter(c => ICONS.some(i => i.category === c))
  const inCat = c => ICONS.filter(i => i.category === c)
  const aliasIndex = {}
  for (const i of ICONS) for (const a of i.aliases) if (!BY[a]) (aliasIndex[a] ||= []).push(i.name)
  // "Also known as": aliases first, then human synonyms; drop obvious typos that only exist for search
  const akaCache = {}
  const akaOf = i => akaCache[i.name] ||= dropTypos([i.name.replace(/-/g, ' '), ...i.aliases.map(a => a.replace(/-/g, ' ')), ...i.synonyms]).slice(1)
  // search data deliberately carries misspellings ("garbige", "delet"); keep them out of visible copy
  function dropTypos(arr) {
    const out = []
    for (const x of uniq(arr)) {
      if (x.length < 2) continue
      const bad = !x.includes(' ') && x.length >= 4 && out.some(y => {
        if (y === x) return true
        const d = lev(x, y.replace(/ /g, ''))
        if (d === 0) return true
        if (d > 2 || (d === 2 && x.length < 6)) return false
        if (x.startsWith(y) && /^(s|es|ed|d|ing|er|ers)$/.test(x.slice(y.length))) return false
        if (y.startsWith(x) && /^(s|es|d)$/.test(y.slice(x.length))) return false
        return true
      })
      if (!bad) out.push(x)
    }
    return out
  }
  function lev(a, b) { const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i]); for (let j = 1; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n] }

  /* ───────────── render (cached per icon x style by content hash) ───────────── */
  // a style's hash covers its own file and every helper it imports (recursively), plus the kernel and loader,
  // so editing one renderer re-renders one column, not all ${NS} of them
  const SHARED_SRC = sha([...listDir(path.join(ROOT, 'forge', 'kernel'), '.mjs').map(fl => fs.readFileSync(path.join(ROOT, 'forge', 'kernel', fl), 'utf8')), fs.readFileSync(path.join(ROOT, 'forge', 'lib', 'load.mjs'), 'utf8')].join('\u0000'))
  function styleSources(file, seen = new Set()) {
    if (seen.has(file) || !fs.existsSync(file)) return seen
    seen.add(file)
    for (const m of fs.readFileSync(file, 'utf8').matchAll(/from\s+['"](\.\/[^'"]+)['"]/g)) styleSources(path.join(path.dirname(file), m[1]), seen)
    return seen
  }
  const STYLE_HASH = Object.fromEntries(STYLES.map(st => [st.name, sha(SHARED_SRC + [...styleSources(path.join(STYLE_DIR, `${st.name}.mjs`))].sort().map(fl => fs.readFileSync(fl, 'utf8')).join('\u0000'))]))
  const RC_FILE = path.join(CACHE_DIR, 'render-cache-v2.json')
  let rc = (!FORCE && readJSON(RC_FILE)) || { icons: {} }
  const jobs = []
  for (const n of names) {
    const h = sha(rawText[n]), e = rc.icons[n] && rc.icons[n].h === h ? rc.icons[n] : (rc.icons[n] = { h, svg: {}, sh: {} })
    const want = STYLES.map(st => st.name).filter(sn => e.sh[sn] !== STYLE_HASH[sn])
    if (want.length) jobs.push([n, want])
  }
  if (jobs.length) {
    const tr = Date.now()
    const rendered = await renderMany(jobs)
    for (const [n, want] of jobs) for (const sn of want) { rc.icons[n].svg[sn] = rendered[n] ? rendered[n][sn] : null; rc.icons[n].sh[sn] = STYLE_HASH[sn] }
    console.log(`  site-seo: rendered ${jobs.reduce((a, j) => a + j[1].length, 0)} icon-styles (${jobs.length} icons) in ${Date.now() - tr} ms`)
  }
  for (const k of Object.keys(rc.icons)) if (!BY[k]) delete rc.icons[k]
  for (const e of Object.values(rc.icons)) for (const sn of Object.keys(e.svg)) if (!STYLE_HASH[sn]) { delete e.svg[sn]; delete e.sh[sn] }
  if (jobs.length) fs.writeFileSync(RC_FILE, JSON.stringify(rc))
  const INNER = n => rc.icons[n].svg
  for (const i of ICONS) i.styles = STYLES.map(st => st.name).filter(sn => INNER(i.name)[sn])

  async function renderMany(list) {
    const cost = list.reduce((a, j) => a + j[1].length, 0)
    const threads = Math.max(1, Math.min(8, (os.cpus()?.length || 2) - 1, Math.ceil(cost / 40)))
    if (threads === 1) {
      const out = {}
      for (const [n, want] of list) { const icon = loadIcon(n), svg = {}; for (const sn of want) { svg[sn] = null; try { svg[sn] = nodesToMarkup(renderIcon(styleMods[sn], icon)) } catch { } } out[n] = svg }
      return out
    }
    const slices = Array.from({ length: threads }, (_, k) => list.filter((_, i) => i % threads === k))
    const parts = await Promise.all(slices.map(sl => new Promise((ok, fail) => {
      const w = new Worker(SELF, { workerData: { withSeoWorker: true, jobs: sl } })
      w.once('message', m => { ok(m); w.terminate() }); w.once('error', fail)
    })))
    return Object.assign({}, ...parts)
  }

  /* ───────────── motion specs (forge/motion/<name>.json, see forge/MOTION.md) ───────────── */
  const MOTION_DIR = path.join(ROOT, 'forge', 'motion')
  const MOTION = {}
  for (const n of names) { const j = readJSON(path.join(MOTION_DIR, `${n}.json`)); if (j && j.loop && j.loop.preset) MOTION[n] = j }
  const MOTION_PRESETS = ['spin', 'spin-once', 'tick', 'pulse', 'beat', 'breathe', 'float', 'bounce', 'sway', 'ring', 'wiggle', 'shake', 'nod', 'nudge', 'pass', 'rise', 'drop', 'blink', 'flicker', 'twinkle', 'pop', 'tada', 'jelly', 'flip', 'rock', 'tilt', 'zoom', 'orbit', 'glow', 'draw', 'type', 'fill']
  const MOTION_EFFECTS = ['fade', 'scale', 'rotate', 'flip', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'blur', 'spin', 'morph', 'draw']

  /* ───────────── helpers ───────────── */
  function readJSON(f) { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return null } }
  function listDir(d, ext) { return fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith(ext)).sort() : [] }
  function uniq(a) { return [...new Set(a)] }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1) }
  function titleOf(n) {
    const W = { qr: 'QR', id: 'ID', cpu: 'CPU', pdf: 'PDF', rss: 'RSS', tv: 'TV', ccw: 'CCW', cw: 'CW', wifi: 'Wi-Fi', at: 'At', x: 'X' }
    return n.split('-').map(w => W[w] || cap(w)).join(' ')
  }
  const catTitle = c => cap(c)
  const pascal = n => n.split('-').map(cap).join('')
  // names that would shadow a JS/DOM global or a common framework export: show the <Name>Icon export instead
  const CLASH = new Set(['Map', 'Image', 'History', 'File', 'Link', 'Navigation', 'Clipboard', 'Keyboard', 'Bluetooth', 'Screen', 'Option', 'Text', 'Location', 'Range', 'Selection', 'Notification', 'Set', 'Date', 'Error', 'Symbol', 'Proxy', 'Worker', 'Lock', 'Headers', 'Request', 'Response'])
  const comp = n => { const p = pascal(n); return CLASH.has(p) ? p + 'Icon' : p }
  const esc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const md = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>')
  const plain = s => s.replace(/`([^`]+)`/g, '$1')
  const list = (a, conj = 'and') => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + (a.length > 2 ? ',' : '') + ` ${conj} ` + a[a.length - 1]
  const dateOf = d => new Date(d).toISOString().slice(0, 10)
  const fileDate = f => fs.existsSync(f) ? dateOf(fs.statSync(f).mtime) : null
  const maxDate = ds => ds.filter(Boolean).sort().pop()
  const CDN = 'https://cdn.jsdelivr.net/npm'
  const cdnSvg = (style, n) => `${CDN}/${SCOPE}/core/dist/svg/${style}/${n}.svg`
  const WEB_JS = `${CDN}/${SCOPE}/web/dist/index.js`
  const CLASSES_CSS = `${CDN}/${SCOPE}/web/dist/classes/with-all.css`
  // one stylesheet per style is the recommended setup (with-line.css ~25 KB gzipped; with-all.css ~2 MB, render-blocking)
  const classCss = st => `${CDN}/${SCOPE}/web/dist/classes/with-${st}.css`
  const pageUrl = n => `${BASE}/icons/${n}.html`
  const catUrl = c => `${BASE}/categories/${c}.html`
  const styleUrl = s => `${BASE}/styles/${s}.html`
  const LICENSE_URL = 'https://opensource.org/license/mit'
  const LICENSE_PAGE = fs.existsSync(path.join(SITE, 'license.html')) ? `${BASE}/license.html` : `${REPO}/blob/main/LICENSE`
  const EVERGROW = { '@type': 'Organization', '@id': `${PUB.url}/#org`, name: PUB.name, url: PUB.url }
  const ORG = { '@type': 'Organization', '@id': `${BASE}/#org`, name: BRAND, alternateName: ['withicons', 'With Icons'], url: `${BASE}/`, logo: `${BASE}/brand/icon-512.png`, brand: { '@type': 'Brand', name: PUB.name }, parentOrganization: { '@id': EVERGROW['@id'] }, sameAs: [REPO] }
  const SITE_NODE = { '@type': 'WebSite', '@id': `${BASE}/#website`, name: BRAND, alternateName: 'withicons.com', url: `${BASE}/`, publisher: { '@id': ORG['@id'] }, inLanguage: 'en',
    potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/icons.html?q={search_term_string}` }, 'query-input': 'required name=search_term_string' } }
  const CODE_NODE = { '@type': 'SoftwareSourceCode', '@id': `${BASE}/#code`, name: `${BRAND} icon library`, codeRepository: REPO, license: LICENSE_URL, programmingLanguage: ['SVG', 'JavaScript', 'TypeScript'], author: { '@id': ORG['@id'] }, publisher: { '@id': EVERGROW['@id'] } }
  const BASE_GRAPH = [ORG, EVERGROW, SITE_NODE]
  const exists = rel => fs.existsSync(path.join(SITE, rel))
  const guide = slug => exists(`guides/${slug}.html`) ? `guides/${slug}.html` : 'guides/index.html'

  // inline svg for a page; decorative by default
  function svgEl(n, style, o = {}) {
    const inner = INNER(n)[style]; if (inner == null) return ''
    const a = { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: o.size, height: o.size, ...STYLE[style].root, class: o.cls, 'aria-hidden': o.label ? undefined : 'true', role: o.label ? 'img' : undefined, 'aria-label': o.label, focusable: 'false' }
    return `<svg${attrs(a)}>${inner}</svg>`
  }
  // the standalone file (what "Copy SVG code" copies; same shape as @withicons/core/dist/svg)
  function svgFile(n, style) {
    const a = { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', ...STYLE[style].root }
    return `<svg${attrs(a)}>${INNER(n)[style]}</svg>`
  }
  function useEl(style, o = {}) {
    const a = { viewBox: '0 0 24 24', width: o.size, height: o.size, ...STYLE[style].root, class: o.cls, 'aria-hidden': o.label ? undefined : 'true', role: o.label ? 'img' : undefined, 'aria-label': o.label, focusable: 'false', 'data-root': o.dataRoot ? '' : undefined }
    return `<svg${attrs(a)}><use href="#s-${style}"/></svg>`
  }

  // tiny syntax colouring for code blocks (text stays copyable via textContent)
  function hl(code) {
    const re = /(\/\/[^\n]*|<!--[\s\S]*?-->)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|\b(import|from|export|const|function|return|class|default|as)\b|(<\/?[A-Za-z][\w.-]*)/g
    let out = '', last = 0, m
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index))
      const cls = m[1] ? 'tk-c' : m[2] ? 'tk-s' : m[3] ? 'tk-k' : 'tk-t'
      out += `<span class="${cls}">${esc(m[0])}</span>`
      last = re.lastIndex
    }
    return out + esc(code.slice(last))
  }
  const I = {
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5 V6 A2.5 2.5 0 0 0 13 3.5 H6 A2.5 2.5 0 0 0 3.5 6 V13 A2.5 2.5 0 0 0 6 15.5 H8.5"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3.5 V15 M7 10.5 L12 15.5 L17 10.5 M4.5 19.5 H19.5"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8.5 7 L3.5 12 L8.5 17 M15.5 7 L20.5 12 L15.5 17"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3 L13.8 9.2 L20 11 L13.8 12.8 L12 19 L10.2 12.8 L4 11 L10.2 9.2 Z"/><path d="M19 3 V6 M17.5 4.5 H20.5"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>',
    arr: '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12 H19 M13 6 L19 12 L13 18"/></svg>',
  }
  // every UI glyph carries a default size, so a missing CSS rule can never render it page-wide
  for (const k in I) I[k] = I[k].replace('<svg ', '<svg width="20" height="20" ')
  function codeBlock(id, code, { lang = '', highlight = true } = {}) {
    return `<div class="ip-code"><div class="ip-code-bar"><span>${esc(lang || 'code')}</span><button class="ip-copy" type="button" data-ip-copy="#${id}">${I.copy}<span>Copy</span></button></div><pre><code id="${id}">${highlight ? hl(code) : esc(code)}</code></pre></div>`
  }

  /* ───────────── chrome (exact markup from site/DESIGN.md) ───────────── */
  const HEADER = `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <a class="logo" href="index.html" aria-label="with icons — home">
    <span class="logo-morph" aria-hidden="true" data-logo-morph></span>
    <span class="logo-type">
      <span class="logo-words"><span class="logo-with">with</span><span class="logo-icons">icons</span></span>
      <span class="logo-by">powered by <b>evergrow</b></span>
    </span>
  </a>
  <nav class="site-nav" aria-label="Primary">
    <a href="icons.html">Icons</a><a href="guides/index.html">How to use</a>
    <a href="developers.html">Developers</a><a href="ai.html">For AI</a><a href="about.html">About</a>
  </nav>
  <div class="site-actions">
    <button class="search-trigger" type="button" data-search-open aria-label="Search icons"><kbd>/</kbd></button>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle dark mode"></button>
    <a class="cta" href="icons.html">Browse icons</a>
  </div>
</header>`
  const FOOTER = readFooter()
    .replace(/\b\d+ free icons in \d+ styles/, `${ICONS.length} free icons in ${NS} styles`)
    .replace(/Browse all \d+</, `Browse all ${ICONS.length}<`)
    .replace(/The \d+ styles</, `The ${NS} styles<`)
  function readFooter() {
    // the footer is owned by the brand layer; take it verbatim from DESIGN.md so every page matches
    try {
      const d = fs.readFileSync(path.join(SITE, 'DESIGN.md'), 'utf8'), i = d.indexOf('**Footer — paste exactly')
      if (i >= 0) { const a = d.indexOf('```html', i) + 7, b = d.indexOf('```', a); const f = d.slice(a, b).trim(); if (f.startsWith('<footer')) return f }
    } catch { }
    return `<footer class="site-footer"><div class="foot-inner"><div class="foot-base"><span>© ${YEAR} with icons · MIT License</span><a class="evergrow-link" href="https://withevergrow.com"><span data-evergrow-mark></span>Powered by Evergrow</a></div></div></footer>`
  }
  const prefixed = (html, pre) => html.replace(/(href|src|srcset)="(?!https?:|#|\/|mailto:|data:)([^"]*)"/g, (m, k, v) => `${k}="${k === 'srcset' ? v.split(/,\s*/).map(x => pre + x).join(', ') : pre + v}"`)

  function page({ title, description, canonical, og, ogAlt, jsonld, main, bodyClass = 'ip-page', styleCls = 's-line', keywords, editor = false, palettes = '' }) {
    const P = '../'
    // no data/motion.js (the motion table of all 500 icons) here: the page's own JSON carries this icon's motion, and the
    // editor fetches the table with the download formats (js/editor.js loadExports)
    const MCSS = exists('vendor/motion/motion.css'), MJS = exists('vendor/motion/motion.js')
    // every colour + per-icon palettes in the studio (forge/lib/emit-palettes.mjs): the role mapper, then this icon's palettes
    const PAL = editor && palettes && exists('js/palette-map.js')
      ? `<script src="${P}js/palette-map.js" defer></script>\n` + (exists(`data/palettes/${palettes}.js`) ? `<script src="${P}data/palettes/${palettes}.js" defer></script>\n` : '')
      : ''
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">\n` : ''}<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#FBF8F3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0D0F14" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(BRAND)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${og}">
<script>document.documentElement.className+=' js';try{var t=localStorage.getItem('with-theme-v2');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){}</script>
<link rel="preload" href="${P}fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${P}fonts/caveat-logo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${P}css/tokens.css">
<link rel="stylesheet" href="${P}css/chrome.css">
<link rel="stylesheet" href="${P}css/icon-page.css">
${editor ? `<link rel="stylesheet" href="${P}css/editor.css">\n${MCSS ? `<link rel="stylesheet" href="${P}vendor/motion/motion.css">\n` : ''}` : ''}
<link rel="icon" href="${P}favicon.svg" type="image/svg+xml">
${exists('brand/apple-touch-icon.png') ? `<link rel="apple-touch-icon" href="${P}brand/apple-touch-icon.png">\n` : ''}${exists('site.webmanifest') ? `<link rel="manifest" href="${P}site.webmanifest">\n` : ''}<link rel="alternate" type="text/plain" title="llms.txt" href="${P}llms.txt">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
</head>
<body class="${bodyClass} ${styleCls}">
${prefixed(HEADER, P)}
<main id="main">
${main}
</main>
${prefixed(FOOTER, P)}
${editor && MJS ? `<script src="${P}vendor/motion/motion.js" defer></script>\n` : ''}<script src="${P}js/site.js" defer></script>
${PAL}${editor ? `<script src="${P}js/editor.js" defer></script>\n` : ''}<script src="${P}js/icon-page.js" defer></script>
</body>
</html>
`
  }
  const crumbs = items => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((c, i) => i === items.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${c.href}">${esc(c.name)}</a></li>`).join('')}</ol></nav>`
  const crumbLd = (id, items) => ({ '@type': 'BreadcrumbList', '@id': id, itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })) })

  /* ───────────── copy ───────────── */
  const CAT_INTRO = {
    navigation: 'Wayfinding icons for moving around: home, menus, chevrons, sidebars and "more" buttons.',
    arrows: 'Arrows for direction, movement, sorting and flow: straight, diagonal, curved and cornered.',
    actions: 'The verbs of an app: add, edit, copy, delete, save, search, filter, undo and the rest of the toolbar.',
    status: 'Feedback and state: success, warning, error, info, loading and help.',
    media: 'Play, pause, skip, volume, microphone, camera, film and music.',
    files: 'Documents and folders: file types, archives, spreadsheets, PDFs and images.',
    communication: 'Mail, chat bubbles, phone calls, notifications and announcements.',
    users: 'People and accounts: a user, a team, add or remove someone, profiles and contact cards.',
    commerce: 'Money and shopping: carts, bags, wallets, cards, coins, receipts, tags and shops.',
    time: 'Clocks and calendars: dates, schedules, timers, alarms, history and hourglasses.',
    devices: 'Hardware: phones, laptops, monitors, keyboards, printers, batteries and connectivity.',
    layout: 'Page structure and views: grids, lists, columns, sidebars, dashboards, tables and layers.',
    text: 'Typography and editing: bold, italic, underline, alignment, headings, lists and quotes.',
    maps: 'Places and travel: pins, maps, compasses, routes, globes, vehicles and landmarks.',
    development: 'Developer tooling: code, terminal, git branches, bugs, databases and webhooks.',
    security: 'Safety and access: locks, keys, shields, fingerprints and identity.',
    charts: 'Data and reports: bar, line, area and pie charts, trends, gauges and activity.',
    weather: 'Sky and climate: sun, moon, clouds, rain, snow, lightning, wind and temperature.',
    objects: 'Everyday things: books, gifts, light bulbs, tools, trophies, rockets and more.',
  }
  const catIntro = c => CAT_INTRO[c] || `${catTitle(c)} icons.`
  function depicts(desc) {
    const d = desc.replace(/\.$/, '')
    const w = d.split(' ')[0]
    const art = /^(A|An|The|Two|Three|Four|Five|Six)$/.test(w) ? '' : /^(Diagonal|Downward|Small|Upward|Dashboard|Teardrop|Forward-curving|Magnifying)$/.test(w) || (w === 'Circular' && !/s$/.test(d.split(' ')[1] || '')) ? 'a ' : w === 'Arrow' ? 'an ' : ''
    return art + (!/^[A-Z0-9-]{2,}$/.test(w) && w !== 'Wi-Fi' ? d.charAt(0).toLowerCase() + d.slice(1) : d)
  }

  /* ───────────── related icons ───────────── */
  function related(i, k = 12) {
    const toks = new Set(i.name.split('-'))
    const al = new Set(i.aliases), tg = new Set([...i.tags, ...i.aliases])
    const scored = ICONS.filter(j => j !== i).map(j => {
      let s = 0
      for (const a of j.aliases) if (al.has(a)) s += 3
      for (const t of j.tags) if (tg.has(t)) s += 2
      for (const t of j.name.split('-')) if (toks.has(t)) s += 2.5
      if (tg.has(j.name) || j.tags.includes(i.name) || j.aliases.includes(i.name)) s += 3
      if (j.category === i.category) s += 1.5
      return { j, s }
    }).filter(x => x.s > 0).sort((a, b) => b.s - a.s || (a.j.name < b.j.name ? -1 : 1))
    return scored.slice(0, k).map(x => x.j)
  }

  /* ───────────── "use it in…" quick tips ───────────── */
  const APPS = [
    { id: 'google-slides', name: 'Google Slides', color: '#F4B400', steps: ['Press <b>Copy image</b> above.', 'Click your slide and paste with <span class="nw"><kbd>Ctrl</kbd>+<kbd>V</kbd></span> <span class="nw">(<kbd>⌘</kbd>+<kbd>V</kbd> on a Mac).</span>', 'Or drag the big preview straight onto the slide.'] },
    { id: 'powerpoint', name: 'PowerPoint', color: '#D24726', steps: ['Press <b>Download SVG</b>.', 'Drag the file onto your slide (or Insert → Pictures).', 'Recolour it any time: Graphics Format → Graphics Fill.'] },
    { id: 'canva', name: 'Canva', color: '#00C4CC', steps: ['Press <b>Download SVG</b>.', 'In Canva open Uploads → Upload files.', 'Click the icon in your design to change its colour.'] },
    { id: 'figma', name: 'Figma', color: '#A259FF', steps: ['Press <b>Copy SVG code</b>.', 'Paste into your Figma canvas.', 'It arrives as an editable vector, ready to resize and recolour.'] },
    { id: 'notion', name: 'Notion', color: '#787774', steps: ['Press <b>Copy image</b> and paste into any page.', 'For a page icon: Add icon → Upload, and pick the 256 px PNG.'] },
  ]

  /* ───────────── developer snippets ───────────── */
  function usage(i) {
    const n = i.name, C = comp(n), T = i.title
    const clashNote = C !== pascal(n) ? `  // ${C}: avoids shadowing the global ${pascal(n)}` : '          // line (default style)'
    const imp = pkg => `import { ${C} } from '${SCOPE}/${pkg}'${clashNote}\nimport { ${C} as ${pascal(n)}Solid } from '${SCOPE}/${pkg}/solid'`
    return [
      { id: 'react', lang: 'jsx', name: 'React', install: `npm i ${SCOPE}/react`, lead: `Named import, tree-shaken. The package root is the line style; ${list(STYLES.slice(1).map(x => `<code>/${x.name}</code>`))} export the same names.`,
        code: `${imp('react')}\n\nexport function Example() {\n  return (\n    <>\n      <${C} size={24} />\n      <${pascal(n)}Solid size={24} color="${HEX.solid}" title="${T}" />\n    </>\n  )\n}`,
        note: `Props: <code>size</code>, <code>color</code>, <code>strokeWidth</code>, <code>absoluteStrokeWidth</code>, <code>title</code>, <code>className</code>. Deep import: <code>${SCOPE}/react/icons/${n}</code>.` },
      { id: 'html', lang: 'html', name: 'HTML class', install: '', lead: 'One stylesheet per style you use, then an <code>&lt;i&gt;</code> tag. The icon takes the current text colour and font size.',
        code: `<link rel="stylesheet" href="${classCss('line')}">\n<link rel="stylesheet" href="${classCss('solid')}">\n\n<i class="with with-${n}"></i>              <!-- line -->\n<i class="with with-${n} with-solid"></i>   <!-- also ${STYLES.slice(2).map(x => `with-${x.name}`).join(', ')}, each with its own file -->`,
        note: 'Load only the styles you use: <code>with-line.css</code> is about 25 KB gzipped. <code>with-all.css</code> holds every style at once (about 2 MB gzipped), so keep it for prototypes. Add <code>role="img"</code> and <code>aria-label</code> when the icon carries meaning on its own.' },
      { id: 'web', lang: 'html', name: 'Web component', install: `npm i ${SCOPE}/web`, lead: 'A dependency-free custom element for any framework or plain HTML. Use <code>variant</code> for the style and <code>label</code> for an accessible name.',
        code: `<script type="module" src="${WEB_JS}"></script>\n\n<with-icon name="${n}"></with-icon>\n<with-icon name="${n}" variant="solid" size="32" label="${T}"></with-icon>`,
        note: `Unique aliases resolve too: <code>&lt;with-icon name="${uniqueAlias(i) || n}"&gt;</code> renders <code>${n}</code>.` },
      { id: 'vue', lang: 'vue', name: 'Vue', install: `npm i ${SCOPE}/vue`, lead: 'Vue 3 components with the same names, props and style subpaths.',
        code: `<script setup>\n${imp('vue')}\n</script>\n\n<template>\n  <${C} :size="24" />\n  <${pascal(n)}Solid :size="24" title="${T}" />\n</template>` },
      { id: 'svelte', lang: 'svelte', name: 'Svelte', install: `npm i ${SCOPE}/svelte`, lead: 'Svelte components for Svelte 4 and 5.',
        code: `<script>\n  ${imp('svelte').replace(/\n/g, '\n  ')}\n</script>\n\n<${C} size={24} />\n<${pascal(n)}Solid size={24} title="${T}" />` },
      { id: 'angular', lang: 'ts', name: 'Angular', install: `npm i ${SCOPE}/angular`, lead: 'One standalone <code>&lt;with-icon&gt;</code> component; pass the tree-shaken icon data.',
        code: `import { Component } from '@angular/core'\nimport { WithIconComponent, ${C} } from '${SCOPE}/angular'\n\n@Component({\n  selector: 'app-example',\n  imports: [WithIconComponent],\n  template: \`<with-icon [icon]="${C}" [size]="24" title="${T}" />\`,\n})\nexport class ExampleComponent { ${C} = ${C} }` },
      { id: 'solid', lang: 'tsx', name: 'Solid', install: `npm i ${SCOPE}/solid`, lead: 'SolidJS components (SSR and hydration ready).',
        code: `${imp('solid')}\n\nexport const Example = () => <${C} size={24} />` },
      { id: 'svg', lang: 'svg', name: 'SVG / CDN', install: '', lead: 'Every style as a standalone 24×24 file. An <code>&lt;img&gt;</code> can’t inherit <code>currentColor</code>, so paste the markup inline when you need to recolour.',
        code: `<img src="${cdnSvg('line', n)}" width="24" height="24" alt="${T}">\n\n${svgFile(n, 'line')}`, highlight: false },
      motionUsage(i),
      { id: 'ai', lang: 'shell', name: 'AI & CLI', install: '', lead: 'Let your coding agent find and insert icons: the MCP server and CLI share the same search as this site.',
        code: `npx -y ${SCOPE}/mcp                 # MCP server for Claude, Cursor, Copilot…\nnpx withicons search "${(akaOf(i)[0] || n)}"   # finds: ${n}\ncurl "${BASE}/api/search?q=${encodeURIComponent(akaOf(i)[0] || n)}"`, highlight: false },
    ]
  }
  function motionUsage(i) {
    const n = i.name, T = i.title, mo = MOTION[n], sw = mo && (mo.swap || []).find(x => BY[String(x.to).split('@')[0]])
    const swapCode = sw ? (() => { const [to, s2] = String(sw.to).split('@'); return `\n\n<!-- click to turn ${n} into ${to}${s2 ? ` (${s2})` : ''}: the button's aria-pressed decides the icon.\n     Timing: --wm-swap-dur, --wm-swap-ease, --wm-swap-delay. On its own: wm-swap-auto (+ --wm-swap-hold) -->\n<button class="wm-trigger" type="button" aria-pressed="false" aria-label="${T}"\n        onclick="this.setAttribute('aria-pressed', this.getAttribute('aria-pressed') !== 'true')">\n  <span class="wm-swap wm-fx-${sw.effect || 'fade'}">\n    <i class="with with-${n} wm-a"></i>\n    <i class="with with-${to}${s2 && s2 !== 'line' ? ` with-${s2}` : ''} wm-b"></i>\n  </span>\n</button>` })() : ''
    return { id: 'motion', lang: 'html', name: 'Motion', install: `npm i ${SCOPE}/motion`,
      lead: `Optional animations, imported separately. They move the element around the icon, so they work with every style and every package.${mo ? ` This icon’s own animation ${esc(mo.intent)}.` : ''}`,
      code: `<link rel="stylesheet" href="${CDN}/${SCOPE}/motion/dist/motion.css">\n<link rel="stylesheet" href="${CDN}/${SCOPE}/motion/dist/icons.css">  <!-- each icon's own moves -->\n\n<!-- always moving${mo ? `: ${mo.loop.preset}` : ''} -->\n<span class="wm wm-loop" data-wm="${n}"><i class="with with-${n}"></i></span>\n\n<!-- moves when the button is hovered or focused${mo ? `: ${mo.hover.preset}` : ''} -->\n<button class="wm-trigger"><span class="wm wm-hover" data-wm="${n}"><i class="with with-${n}"></i></span> ${T}</button>${swapCode}`,
      note: `Pick another move with <code>wm-p-&lt;preset&gt;</code> (${MOTION_PRESETS.length} presets) and tune it with <code>--wm-dur</code> and <code>--wm-k</code>. JavaScript: <code>import { motion, swap } from '${SCOPE}/motion'</code>. Everything stops for visitors who ask for reduced motion.` }
  }
  function uniqueAlias(i) { return i.aliases.find(a => aliasIndex[a] && aliasIndex[a].length === 1 && !a.includes(' ')) }

  /* ───────────── FAQ ───────────── */
  function faq(i) {
    const n = i.name, T = i.title, C = comp(n), aka = akaOf(i)
    return [
      { q: `Is the ${T} icon free to use?`, a: `Yes. The ${T} icon is free for personal and commercial work: presentations, documents, websites, apps, print and merchandise. It is released under the MIT license and you don’t need to credit anyone in your design.` },
      { q: `How do I put the ${T} icon in Google Slides or PowerPoint?`, a: `On this page press Copy image, then paste it onto your slide. For PowerPoint, Keynote and Canva, Download SVG gives you a file that stays sharp at any size and can be recoloured inside the app.` },
      { q: `Can I change the colour or size of the ${T} icon?`, a: `Yes. Pick a colour above before you download, choose a PNG size (64, 256 or 1024 pixels), or download the SVG, which scales to any size without getting blurry.` },
      { q: `What is the ${T} icon also called?`, a: aka.length ? `People also search for it as ${list(aka.slice(0, 10).map(a => `“${a}”`), 'or')}. Its name in code is \`${n}\`.` : `Its name in code is \`${n}\`.` },
      { q: `Can I animate the ${T} icon?`, a: MOTION[n] ? `Yes. Its built-in animation ${MOTION[n].intent}. Open Customize on this page, choose Always, On hover or Once, try any of the ${MOTION_PRESETS.length} moves, then download an animated SVG or copy the code. Animations come from the optional \`${SCOPE}/motion\` package (launching soon) and switch off for people who ask for reduced motion.` : `Yes. Open Customize on this page, choose Always, On hover or Once and pick one of ${MOTION_PRESETS.length} moves, then download an animated SVG or copy the code. Animations come from the optional \`${SCOPE}/motion\` package (launching soon).` },
      { q: `How do I use the ${T} icon in React?`, a: `Install \`${SCOPE}/react\` (launching soon), then \`import { ${C} } from '${SCOPE}/react'\` and render \`<${C} size={24} />\`. Import from \`${SCOPE}/react/solid\` (or ${list(STYLES.slice(2).map(x => `\`/${x.name}\``), 'or')}) for another style. Until the packages are published, copy the SVG code from this page.` },
    ]
  }

  /* ───────────── icon page ───────────── */
  function iconTitle(i) {
    const T = i.title
    const opts = [`${T} icon — free SVG & PNG in ${NS} styles | ${BRAND}`, `${T} icon — free SVG & PNG | ${BRAND}`, `${T} icon — free SVG | ${BRAND}`, `${T} icon | ${BRAND}`]
    return opts.find(o => o.length <= 64) || opts[opts.length - 1]
  }
  function iconDesc(i) {
    const head = `Free ${i.title.toLowerCase()} icon in ${NS} styles${MOTION[i.name] ? ', animated' : ''}. Download SVG or PNG, or copy it into Slides, Docs, Canva or Figma.`
    let al = [], aka = akaOf(i)
    for (const a of aka) { const t = `${head} Also: ${[...al, a].join(', ')}.`; if (t.length > 158) break; al.push(a) }
    return al.length ? `${head} Also: ${al.join(', ')}.` : head + ' MIT licensed.'
  }

  const tagFor = (n, s) => `<i class="with with-${n}${s === 'line' ? '' : ` with-${s}`}"></i>`
  const cssFor = s => `<link rel="stylesheet" href="${CDN}/${SCOPE}/web/dist/classes/with-${s}.css">`
  function iconPage(i, idx) {
    const n = i.name, T = i.title, url = pageUrl(n), cat = i.category
    const st = i.styles, first = st[0]
    const rel = related(i), faqs = faq(i), U = usage(i), aka = akaOf(i)
    const mo = MOTION[n] || null
    const prev = ICONS[(idx - 1 + ICONS.length) % ICONS.length], next = ICONS[(idx + 1) % ICONS.length]
    const crumbItems = [
      { name: 'Home', href: '../index.html', url: `${BASE}/` },
      { name: 'Icons', href: '../icons.html', url: `${BASE}/icons.html` },
      { name: catTitle(cat), href: `../categories/${cat}.html`, url: catUrl(cat) },
      { name: T, url },
    ]
    // what the editor needs without loading any data file (each style's markup is read from the <symbol>s above),
    // and line thumbnails for its swap targets and placement neighbours
    const swapTo = mo ? uniq((mo.swap || []).map(x => String(x.to).split('@')[0])).filter(x => x !== n && BY[x]) : []
    const thumbs = Object.fromEntries(uniq([...swapTo, ...rel.slice(0, 3).map(j => j.name)]).filter(x => INNER(x).line).map(x => [x, INNER(x).line]))
    const data = { name: n, title: T, component: comp(n), cdn: `${CDN}/${SCOPE}/web/dist/classes/`, motion: mo,
      styles: Object.fromEntries(st.map(s => [s, { root: STYLE[s].root, hex: STYLE[s].hex, on: STYLE[s].on, title: STYLE[s].title, say: STYLE[s].say, sw: STYLE[s].strokeWidth }])),
      related: rel.slice(0, 3).map(j => ({ name: j.name, title: j.title })), thumbs }
    const lede = `${esc(cap(depicts(i.description)))}. Free to use in slides, documents, websites and apps. No sign-up, no credit needed.`
    const groups = GROUPS.map(g => ({ ...g, styles: g.styles.filter(x => st.includes(x)) })).filter(g => g.styles.length)
    const extra = st.filter(x => !GROUPS.some(g => g.styles.includes(x)))
    if (extra.length) groups.push({ id: 'more', title: 'More', styles: extra })
    const pickBtn = s => `<button type="button" role="radio" class="ip-pick-b s-${s}" data-pick="${s}" aria-checked="${s === first}" style="${scv(s)}" title="${esc(STYLE[s].title)}: ${esc(STYLE[s].say)}">${useEl(s, { size: 24 })}<span>${esc(STYLE[s].title)}</span></button>`
    const toc = [['customize', 'Customize'], ['in-use', 'See it in use'], ['ask-ai', 'Ask AI'], ['apps', 'Use in apps'], ['styles', 'All styles'], ['related', 'Related'], ['names', 'Other names'], ['developers', 'Developers'], ['faq', 'FAQ']]
    const tagSetup = `<details class="ip-setup"><summary>First time? Show setup</summary><p class="ip-tag-hint"><b>First time?</b> Add this line once inside your page’s <code>&lt;head&gt;</code> <span class="ip-soon-tag">launching soon</span></p><p class="ip-setup-line"><code>${esc(cssFor(first))}</code></p></details>`
    const main = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${st.map(s => `<symbol id="s-${s}" viewBox="0 0 24 24">${INNER(n)[s]}</symbol>`).join('')}</defs></svg>
<div class="ip" data-ip="${n}" data-style="${first}" style="${scv(first)}">
<section class="ip-hero" aria-labelledby="ip-h1"><div class="wrap">
${crumbs(crumbItems)}
<div class="ip-hero-grid">
  <div class="ip-intro">
    <p class="ip-eyebrow"><span class="ip-dot" aria-hidden="true"></span>Free icon · <a href="../categories/${cat}.html">${esc(catTitle(cat))}</a> · ${st.length} styles${mo ? ' · animated' : ''}</p>
    <h1 class="ip-h1" id="ip-h1">${esc(T)} <span class="ip-hand">icon</span></h1>
    <p class="ip-lede">${lede}</p>
    ${aka.length ? `<p class="ip-aka-line"><b>Also known as</b> ${aka.slice(0, 8).map(a => esc(a)).join('&nbsp;· ')}</p>` : ''}
    <div class="ip-step">
      <p class="ip-step-l" id="ip-step1"><span class="ip-step-n" aria-hidden="true">1</span>Pick a style</p>
      <div class="ip-pick" role="radiogroup" aria-labelledby="ip-step1">${groups.map(g => `<div class="ip-pick-g is-${g.id}"><span class="ip-pick-gl" aria-hidden="true">${esc(g.title)}${g.id === 'playful' ? ' <em>new</em>' : ''}</span><div class="ip-pick-row">${g.styles.map(pickBtn).join('')}</div></div>`).join('')}</div>
      <p class="ip-pick-now" aria-live="polite"><b data-pick-name>${esc(STYLE[first].title)}</b> <span data-pick-say>${esc(STYLE[first].say)}</span></p>
    </div>
    <div class="ip-step">
      <p class="ip-step-l"><span class="ip-step-n" aria-hidden="true">2</span>Grab it</p>
      <div class="ip-actions" data-actions>
        <button type="button" class="ip-btn is-primary" data-act="copy-img">${I.copy}<span>Copy image</span><small>paste into Slides, Docs, Notion</small></button>
        <div class="ip-btn-row">
          <button type="button" class="ip-btn" data-act="svg">${I.down}<span>Download SVG</span><small>sharp at any size · <span data-color-label>black</span></small></button>
          <button type="button" class="ip-btn" data-act="png">${I.down}<span>Download PNG</span><small><span data-px-label>256 px</span> · <span data-color-label>black</span></small></button>
        </div>
        <div class="ip-textrow"><a class="ip-textbtn is-strong" href="#customize" data-jump>${I.spark}Change colour, size or animation</a><a class="ip-textbtn" href="#download" data-jump data-jump-focus=".wdl [role=tab][aria-selected=&quot;true&quot;]" data-more-formats hidden>${I.down}More formats <small>PowerPoint, GIF, PDF, video…</small></a><button type="button" class="ip-textbtn" data-act="copy-svg">${I.code}Copy SVG code <small>for Figma, Canva and HTML</small></button><a class="ip-textbtn" href="../icons.html?icon=${n}">${I.grid}Open in the library</a></div>
        <a class="ip-ask-jump" href="#ask-ai" data-ask-jump>${I.spark}<span><b>Ask AI</b> to code it, build a matching set, check the fit or put it in your slides</span>${I.arr}</a>
        <noscript><p class="ip-note">Downloads need JavaScript. You can still <a href="${cdnSvg('line', n)}">open the SVG file</a>.</p></noscript>
      </div>
    </div>
  </div>
  <div class="ip-side">
    <div class="ip-stage wm-trigger" data-stage>
      <div class="ip-stage-art" draggable="true" data-drag title="Drag me into your slides or doc"><span class="ip-mo" data-mo>${useEl(first, { label: `${T} icon`, dataRoot: true })}</span></div>
      <p class="ip-stage-hint" aria-hidden="true">drag me into your slide ↘</p>
      ${mo ? `<button type="button" class="ip-intent" data-intent aria-pressed="false"><span class="ip-intent-ic" aria-hidden="true"></span><span class="ip-intent-t"><b data-intent-b>Play animation</b><small>${esc(cap(mo.intent))}</small></span></button>` : ''}
      <div class="ip-sizes" aria-label="${esc(T)} icon at 16, 24, 32 and 48 pixels">${[16, 24, 32, 48].map(px => `<figure>${useEl(first, { size: px, dataRoot: true })}<figcaption>${px}</figcaption></figure>`).join('')}</div>
    </div>
  </div>
</div>
</div></section>

<nav class="ip-toc" aria-label="On this page"><div class="wrap"><ul>${toc.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join('')}</ul></div></nav>

<section class="ip-section ip-studio-sec" id="customize" aria-labelledby="cz-h"><div class="wrap">
  <div class="ip-head"><div><p class="ip-kicker"><span class="ip-dot" aria-hidden="true"></span>Optional · live preview</p><h2 class="ip-h2" id="cz-h">Make it <span class="ip-hand">yours</span></h2></div><p>Try a style, colour, size and a little movement. The preview, the downloads and the code below all follow along.</p></div>
  <div class="ip-studio" data-editor>
    <noscript><div class="ip-studio-static">
      <p>The live editor needs JavaScript. Here is the quickest way to use this icon on a website:</p>
      <div class="ip-tag"><code class="ip-tag-code">${esc(tagFor(n, first))}</code></div>
      ${tagSetup}
      <p><a href="${cdnSvg(first, n)}">Open the SVG file</a> · <a href="#developers">All code options</a></p>
    </div></noscript>
  </div>
</div></section>

<section class="ip-section ip-use-sec" id="in-use" aria-labelledby="use-h"><div class="wrap">
  <div class="ip-head"><div><p class="ip-kicker"><span class="ip-dot" aria-hidden="true"></span>Ten everyday places</p><h2 class="ip-h2" id="use-h">See it <span class="ip-hand">in use</span></h2></div><p>Buttons, slides, lists and cards, drawn live with your choices above. Hover or tap a card to see the animation.</p></div>
  <div class="ip-places" data-placements><noscript><p class="ip-note">Turn on JavaScript to preview ${esc(T)} in buttons, slides, lists and cards.</p></noscript></div>
</div></section>

<section class="ip-section ip-ask" id="ask-ai" aria-labelledby="ask-h"><div class="wrap"><div class="ip-ask-card">
  <div class="ip-ask-copy">
    <p class="ip-eyebrow"><span class="ip-dot" aria-hidden="true"></span>No setup · free</p>
    <h2 class="ip-h2" id="ask-h">Get help <span class="ip-hand">using this icon</span></h2>
    <p>Pick what you need, add a line about what you’re making, and choose your AI assistant. We write the brief about the <b>${esc(T)}</b> icon in the <b data-ask-style-name>${esc(STYLE[first].title)}</b> style, copy it, and open the assistant for you.</p>
  </div>
  <div class="ip-ask-demo" aria-hidden="true">
    <p class="ip-ask-bubble is-user" data-ask-demo-q>What goes with ${esc(n)} on my screen?</p>
    <div class="ip-ask-bubble is-ai"><span class="ip-ask-tile">${useEl(first, { dataRoot: true })}</span><span data-ask-demo-a>Here are 6 icons that match <b>${esc(n)}</b>, all in one style, with why each belongs…</span></div>
  </div>
  <div class="ip-ask-widget" data-ask-ai data-ask-mode="tasks" data-icon="${n}" data-style="${first}"><noscript><p class="ip-note">Turn on JavaScript for one-click buttons, or paste <a href="../llms.txt">withicons.com/llms.txt</a> into your assistant.</p></noscript></div>
</div></div></section>

<section class="ip-section ip-apps" id="apps" aria-labelledby="apps-h"><div class="wrap">
  <div class="ip-head"><h2 class="ip-h2" id="apps-h">Use it in your <span class="ip-hand">favourite app</span></h2><p>Quick steps for the tools most people use. <a href="../guides/index.html">All step-by-step guides ${I.arr}</a></p></div>
  <ol class="ip-app-list">${APPS.map(a => `<li class="ip-app" style="--app:${a.color}"><h3><span class="ip-app-dot" aria-hidden="true"></span>${esc(a.name)}</h3><ol>${a.steps.map(x => `<li>${x}</li>`).join('')}</ol><a href="../${guide(a.id)}">${esc(a.name)} guide ${I.arr}</a></li>`).join('')}</ol>
</div></section>

<section class="ip-section" id="styles" aria-labelledby="styles-h"><div class="wrap">
  <div class="ip-head"><h2 class="ip-h2" id="styles-h">${esc(T)} in <span class="ip-hand">all ${st.length} styles</span></h2><p>Same icon, ${numw(st.length)} personalities. Download whichever fits your design.</p></div>
  <ul class="ip-styles">${st.map(s => `
    <li class="ip-sc s-${s}" style="${scv(s)}" id="style-${s}">
      <div class="ip-sc-art">${useEl(s, { label: `${T} icon, ${STYLE[s].title.toLowerCase()} style` })}</div>
      <h3><a href="../styles/${s}.html">${esc(STYLE[s].title)}</a> <small>${esc(STYLE[s].kind)}</small></h3>
      <p>${esc(STYLE[s].say)}</p>
      <div class="ip-sc-act"><button type="button" data-act="svg" data-style="${s}">SVG</button><button type="button" data-act="png" data-style="${s}">PNG</button><button type="button" data-act="copy-img" data-style="${s}" aria-label="Copy ${esc(STYLE[s].title)} as image">${I.copy}</button></div>
    </li>`).join('')}
  </ul>
</div></section>

<section class="ip-section" id="related" aria-labelledby="related-h"><div class="wrap">
  <div class="ip-head"><h2 class="ip-h2" id="related-h">Goes well <span class="ip-hand">with</span></h2><p><a href="../categories/${cat}.html">All ${inCat(cat).length} ${esc(cat)} icons ${I.arr}</a> · <a href="../icons.html?icon=${n}">Open in the library ${I.arr}</a></p></div>
  <ul class="ip-grid">${rel.map(j => `<li><a href="${j.name}.html">${svgEl(j.name, 'line')}<span>${esc(j.title)}</span></a></li>`).join('')}</ul>
  <a class="ip-lib-link" href="../icons.html?icon=${n}">${I.grid}<span><b>See it in the library</b><small>next to all ${ICONS.length} icons, in any style</small></span>${I.arr}</a>
</div></section>

<section class="ip-section" id="names" aria-labelledby="names-h"><div class="wrap">
  <div class="ip-head"><h2 class="ip-h2" id="names-h">Also known <span class="ip-hand">as</span></h2><p>Other words people use for this icon. Each one finds it in the <a href="../icons.html?q=${encodeURIComponent(aka[0] || n)}">library search</a>.</p></div>
  <div class="ip-names">
    <ul class="ip-chips">${aka.map(a => `<li><a href="../icons.html?q=${encodeURIComponent(a)}">${esc(a)}</a></li>`).join('') || `<li><span>${esc(n)}</span></li>`}</ul>
    <dl class="ip-facts">
      <div><dt>Name in code</dt><dd><code>${n}</code></dd></div>
      <div><dt>Category</dt><dd><a href="../categories/${cat}.html">${esc(catTitle(cat))}</a></dd></div>
      <div><dt>Tags</dt><dd>${i.tags.map(t => esc(t)).join(', ')}</dd></div>
      ${mo ? `<div><dt>Animation</dt><dd>${esc(cap(mo.intent))} <small class="ip-fact-code">(<code>${mo.loop.preset}</code> loop · <code>${mo.hover.preset}</code> on hover)</small></dd></div>` : ''}
      <div><dt>Grid</dt><dd>24 × 24, scales to any size</dd></div>
      <div><dt>License</dt><dd><a href="../${exists('license.html') ? 'license.html' : 'about.html'}">MIT, free for commercial use</a></dd></div>
    </dl>
  </div>
</div></section>

<section class="ip-section ip-devsec" id="developers" aria-labelledby="dev-h"><div class="wrap">
  <details class="ip-dev">
    <summary><span class="ip-dev-t"><span class="ip-h2" id="dev-h">For developers</span><small>${U.map(u => u.name).join(', ')}</small></span><span class="ip-dev-plus" aria-hidden="true"></span></summary>
    <p class="ip-soon"><b>npm packages are launching soon.</b> The SVG, PNG and copy buttons above work today. Name in code: <code>${n}</code> · component <code>${comp(n)}</code>.</p>
    <div class="ip-tabs" role="tablist" aria-label="Framework">${U.map((u, k) => `<button type="button" role="tab" id="tab-${u.id}" data-tab="${u.id}" aria-controls="use-${u.id}" aria-selected="${k === 0}"${k ? ' tabindex="-1"' : ''}>${esc(u.name)}</button>`).join('')}</div>
${U.map((u, k) => `    <div class="ip-panel" id="use-${u.id}" role="tabpanel" aria-labelledby="tab-${u.id}"${k ? ' hidden' : ''}>
      <p>${u.lead}</p>
      ${u.install ? `<p class="ip-install"><code>${esc(u.install)}</code> <span class="ip-soon-tag">launching soon</span></p>` : ''}
      ${codeBlock(`code-${u.id}`, u.code, { lang: u.lang, highlight: u.highlight !== false })}
      ${u.note ? `<p class="ip-note">${u.note}</p>` : ''}
    </div>`).join('\n')}
    <div class="ip-dev-tag">
      <p class="ip-dev-tag-l">The quickest copy for websites: one <code>&lt;i&gt;</code> tag</p>
      <button type="button" class="ip-tag-btn" data-act="copy-tag"><span class="ip-tag-k">${I.code}Copy &lt;i&gt; tag</span><code data-tag-code>${tagFor(n, first).split(' ').map(w => `<span class="nw">${esc(w)}</span>`).join(' ')}</code><span class="ip-tag-go">${I.copy}<span>Copy</span></span></button>
      <details class="ip-setup is-dark"><summary>First time? Show setup</summary><p class="ip-tag-hint"><b>First time?</b> Add this line once inside your page’s <code>&lt;head&gt;</code> <span class="ip-soon-tag">launching soon</span></p><button type="button" class="ip-tag-css" data-act="copy-css" title="Copy the stylesheet line"><code data-tag-css>${esc(cssFor(first))}</code>${I.copy}<span class="visually-hidden">Copy the stylesheet line</span></button></details>
    </div>
  </details>
</div></section>

<section class="ip-section ip-faqsec" id="faq" aria-labelledby="faq-h"><div class="wrap ip-faq-grid">
  <div class="ip-head"><h2 class="ip-h2" id="faq-h">Questions about the <span class="ip-hand">${esc(T)}</span> icon</h2><p>Free to use, easy to recolour, and ready for your slides or your code. <a href="../faq.html">All questions ${I.arr}</a></p></div>
  <div class="ip-faq">${faqs.map(f => `<details class="ip-q"><summary>${esc(f.q)}</summary><p>${md(f.a)}</p></details>`).join('')}</div>
</div></section>

<nav class="ip-section" aria-label="More icons"><div class="wrap ip-pager">
  <a class="prev" href="${prev.name}.html" rel="prev">${svgEl(prev.name, 'line')}<span><small>Previous</small><b>${esc(prev.title)}</b></span></a>
  <a class="next" href="${next.name}.html" rel="next"><span><small>Next</small><b>${esc(next.title)}</b></span>${svgEl(next.name, 'line')}</a>
</div></nav>
</div>
<script type="application/json" id="ip-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

    const og = `${BASE}/og/${n}.png`
    const imgs = st.map(s => ({
      '@type': 'ImageObject', '@id': `${url}#svg-${s}`, name: `${T} icon — ${STYLE[s].title} style`, caption: `${T} icon from ${BRAND}, ${STYLE[s].title.toLowerCase()} style.`,
      contentUrl: cdnSvg(s, n), encodingFormat: 'image/svg+xml', width: 24, height: 24,
      license: LICENSE_URL, acquireLicensePage: LICENSE_PAGE, creditText: BRAND, copyrightNotice: `© ${YEAR} ${BRAND}`,
      creator: { '@id': ORG['@id'] }, copyrightHolder: { '@id': ORG['@id'] }, isPartOf: { '@id': `${url}#icon` },
    }))
    const jsonld = { '@context': 'https://schema.org', '@graph': [
      ...BASE_GRAPH,
      { '@type': 'WebPage', '@id': url, url, name: iconTitle(i), description: iconDesc(i), inLanguage: 'en', isPartOf: { '@id': SITE_NODE['@id'] }, breadcrumb: { '@id': `${url}#breadcrumb` },
        about: { '@id': `${url}#icon` }, mainEntity: { '@id': `${url}#icon` }, dateModified: dateOf(i.mtime),
        primaryImageOfPage: { '@type': 'ImageObject', url: og, contentUrl: og, width: 1200, height: 630, caption: `${T} icon in ${st.length} styles` } },
      crumbLd(`${url}#breadcrumb`, crumbItems),
      { '@type': ['CreativeWork', 'DefinedTerm'], '@id': `${url}#icon`, name: `${T} icon`, termCode: n, alternateName: aka, keywords: uniq([n, ...aka, ...i.tags]).join(', '),
        description: i.description, genre: catTitle(cat), inDefinedTermSet: { '@type': 'DefinedTermSet', '@id': `${BASE}/#icons`, name: `${BRAND} icon set`, url: `${BASE}/icons.html` },
        license: LICENSE_URL, isAccessibleForFree: true, creator: { '@id': ORG['@id'] }, copyrightHolder: { '@id': ORG['@id'] }, copyrightYear: YEAR, creditText: BRAND,
        image: imgs.map(m => ({ '@id': m['@id'] })), url },
      ...imgs,
      { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plain(f.a) } })) },
    ] }
    return page({ title: iconTitle(i), description: iconDesc(i), canonical: url, og, ogAlt: `${T} icon from ${BRAND} in ${st.length} styles: ${list(st)}.`, jsonld, main, styleCls: `s-${first}`, keywords: uniq([`${n} icon`, ...aka.slice(0, 12)]).join(', '), editor: true, palettes: n })
  }

  /* ───────────── hub pages ───────────── */
  const SHOWCASE = ['home', 'search', 'heart', 'bell', 'settings', 'user', 'star', 'camera', 'rocket', 'calendar', 'mail', 'trash'].filter(n => BY[n])
  const catNav = cur => `<ul class="hub-cats">${CATS.map(c => `<li><a href="../categories/${c}.html"${c === cur ? ' aria-current="page"' : ''}>${svgEl(inCat(c)[0].name, 'line')}${esc(catTitle(c))} <small>${inCat(c).length}</small></a></li>`).join('')}</ul>`
  const styleNav = cur => `<ul class="hub-styles">${STYLES.map(x => `<li class="s-${x.name}" style="${scv(x.name)}"><a href="../styles/${x.name}.html"${x.name === cur ? ' aria-current="page"' : ''}>${svgEl('home', x.name)}<b>${esc(x.title)}</b><small>${esc(x.kind)}</small></a></li>`).join('')}</ul>`
  const hubGrid = (items, s, withWhy) => `<ul class="ip-grid is-hub">${items.map(j => `<li><a href="../icons/${j.name}.html" title="${esc(j.description)}">${svgEl(j.name, s)}<span>${esc(j.title)}</span>${withWhy && akaOf(j)[0] ? `<small>${esc(akaOf(j).slice(0, 2).join(', '))}</small>` : ''}</a></li>`).join('')}</ul>`

  function categoryPage(c) {
    const items = inCat(c), url = catUrl(c), C = catTitle(c)
    const crumbItems = [{ name: 'Home', href: '../index.html', url: `${BASE}/` }, { name: 'Icons', href: '../icons.html', url: `${BASE}/icons.html` }, { name: C, url }]
    const title = [`${C} icons — ${items.length} free SVG & PNG icons in ${NS} styles | ${BRAND}`, `${C} icons — ${items.length} free SVG & PNG icons | ${BRAND}`, `${C} icons | ${BRAND}`].find(t => t.length <= 70) || `${C} icons | ${BRAND}`
    const mk = k => `${items.length} free ${c} icons in ${NS} styles: ${items.slice(0, k).map(i => i.title.toLowerCase()).join(', ')} and more. Download SVG or PNG, or copy into your slides.`
    let k = 6; while (k > 1 && mk(k).length > 160) k--
    const desc = mk(k)
    const main = `
<div class="hub" data-hub>
<section class="hub-hero"><div class="wrap">
${crumbs(crumbItems)}
<div class="hub-hero-grid">
  <div>
    <p class="ip-eyebrow"><span class="ip-dot" aria-hidden="true"></span>Category · ${items.length} icons · ${NS} styles</p>
    <h1 class="ip-h1">${esc(C)} <span class="ip-hand">icons</span></h1>
    <p class="ip-lede">${esc(catIntro(c))} Every one is free, comes in ${NS} styles, and downloads as SVG or PNG in any colour.</p>
    <p class="hub-cta"><a class="btn btn-ink btn-lg" href="../icons.html?cat=${c}">Open in the library ${I.arr}</a><a class="btn btn-ghost btn-lg" href="#all">See all ${items.length}</a></p>
  </div>
  <div class="hub-strip" aria-hidden="true">${items.slice(0, 9).map((j, k) => { const s = STYLES[k % NS]; return `<span class="s-${s.name}" style="${scv(s.name)};--i:${k}">${svgEl(j.name, s.name)}</span>` }).join('')}</div>
</div>
</div></section>
<section class="ip-section" id="all" aria-labelledby="all-h"><div class="wrap">
  <div class="ip-head"><h2 class="ip-h2" id="all-h">Every ${esc(c)} <span class="ip-hand">icon</span></h2><p>Click any icon for downloads in all ${numw(NS)} styles, colours, sizes and animations.</p></div>
  ${hubGrid(items, 'line', true)}
</div></section>
<section class="ip-section" aria-labelledby="ref-h"><div class="wrap">
  <div class="ip-head"><h2 class="ip-h2" id="ref-h">What each one <span class="ip-hand">means</span></h2><p>Plain descriptions, and the other words people search for.</p></div>
  <div class="hub-table-wrap"><table class="hub-table"><thead><tr><th scope="col">Icon</th><th scope="col">Shows</th><th scope="col">Also known as</th></tr></thead><tbody>
${items.map(j => `  <tr><th scope="row"><a href="../icons/${j.name}.html">${svgEl(j.name, 'line', { size: 22 })}${esc(j.title)}</a></th><td>${esc(j.description)}</td><td>${esc(akaOf(j).slice(0, 8).join(', '))}</td></tr>`).join('\n')}
  </tbody></table></div>
</div></section>
<section class="ip-section" aria-labelledby="st-h"><div class="wrap">
  <div class="ip-head"><h2 class="ip-h2" id="st-h">Pick a <span class="ip-hand">style</span></h2><p>Every ${esc(c)} icon comes in all ${NS} styles.</p></div>
  ${styleNav()}
</div></section>
<section class="ip-section" aria-labelledby="cats-h"><div class="wrap">
  <div class="ip-head"><h2 class="ip-h2" id="cats-h">More <span class="ip-hand">categories</span></h2></div>
  ${catNav(c)}
</div></section>
</div>`
    const jsonld = { '@context': 'https://schema.org', '@graph': [...BASE_GRAPH,
      { '@type': 'CollectionPage', '@id': url, url, name: title, description: desc, inLanguage: 'en', isPartOf: { '@id': SITE_NODE['@id'] }, breadcrumb: { '@id': `${url}#breadcrumb` }, mainEntity: { '@id': `${url}#list` },
        about: { '@type': 'Thing', name: `${C} icons` }, keywords: uniq(items.flatMap(j => [j.name, ...j.aliases.slice(0, 2)])).slice(0, 60).join(', '), license: LICENSE_URL, dateModified: maxDate(items.map(j => dateOf(j.mtime))), primaryImageOfPage: { '@type': 'ImageObject', url: `${BASE}/og/cat-${c}.png`, width: 1200, height: 630 } },
      crumbLd(`${url}#breadcrumb`, crumbItems),
      { '@type': 'ItemList', '@id': `${url}#list`, name: `${C} icons`, numberOfItems: items.length, itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: items.map((j, k) => ({ '@type': 'ListItem', position: k + 1, url: pageUrl(j.name), name: `${j.title} icon` })) },
    ] }
    return page({ title, description: desc, canonical: url, og: `${BASE}/og/cat-${c}.png`, ogAlt: `${C} icons from ${BRAND}`, jsonld, main, bodyClass: 'ip-page hub-page', styleCls: 's-line' })
  }

  function stylePage(s) {
    const S = STYLE[s], url = styleUrl(s)
    const items = ICONS.filter(i => i.styles.includes(s))
    const crumbItems = [{ name: 'Home', href: '../index.html', url: `${BASE}/` }, { name: 'Icons', href: '../icons.html', url: `${BASE}/icons.html` }, { name: `${S.title} style`, url }]
    const title = [`${S.title} icons — ${items.length} free ${S.title.toLowerCase()} SVG & PNG icons | ${BRAND}`, `${S.title} icons — ${items.length} free SVG & PNG | ${BRAND}`].find(t => t.length <= 70) || `${S.title} icons | ${BRAND}`
    const desc = `${items.length} free ${s} style icons. ${S.say} Download SVG or PNG in any colour, or copy into Slides, Docs and Figma.`.slice(0, 165)
    const subpath = s === 'line' ? '' : `/${s}`
    const main = `
<div class="hub hub-style" data-hub style="${scv(s)}">
<section class="hub-hero is-style"><div class="wrap">
${crumbs(crumbItems)}
<div class="hub-hero-grid">
  <div>
    <p class="ip-eyebrow"><span class="ip-dot" aria-hidden="true"></span>${esc(cap(S.kind))} style · ${items.length} icons</p>
    <h1 class="ip-h1">${esc(S.title)} <span class="ip-hand">icons</span></h1>
    <p class="ip-lede">${esc(S.say)} Great for ${esc(S.good)}.</p>
    <p class="hub-cta"><a class="btn btn-ink btn-lg" href="../icons.html?style=${s}">Open in the library ${I.arr}</a><a class="btn btn-ghost btn-lg" href="#all">See all ${items.length}</a></p>
  </div>
  <div class="hub-strip is-mono" aria-hidden="true">${SHOWCASE.slice(0, 9).map((n, k) => `<span style="--i:${k}">${svgEl(n, s)}</span>`).join('')}</div>
</div>
</div></section>
<section class="ip-section" aria-labelledby="when-h"><div class="wrap">
  <div class="ip-head"><h2 class="ip-h2" id="when-h">When to use <span class="ip-hand">${esc(S.title)}</span></h2></div>
  <div class="hub-when">
    <article><h3>Good for</h3><p>${esc(cap(S.good))}.</p></article>
    <article><h3>Sizes</h3><p>${s === 'pixel' ? 'Drawn on a 16×16 pixel grid, so it is sharpest at 16, 32 and 48px: tiny UI, games and big retro posters.' : S.kind === 'universal' ? 'Reads well from 16px up, so it works in menus, buttons and small UI as well as on slides.' : 'Shines at 32px and larger: hero sections, slides, posters and illustrations.'}</p></article>
    <article><h3>Colour</h3><p>${S.palette ? 'Arrives with its own cheerful palette; the outline follows any colour you pick. Developers can retint every part with CSS variables.' : s === 'duo' ? 'One colour plus a soft tint of it. Pick any colour when you download.' : s === 'blueprint' ? 'One ink colour; developers can add an accent colour for the construction lines.' : 'A single colour you choose when you download. Every shape follows it.'}</p></article>
    <article><h3>For developers</h3><ul class="hub-dev"><li><code>${SCOPE}/react${subpath}</code></li><li><code>&lt;with-icon variant="${s}"&gt;</code></li><li><code>with with-home${s === 'line' ? '' : ` with-${s}`}</code></li></ul><p class="hub-dev-more"><a href="../developers.html">Developer docs</a> · launching soon</p></article>
  </div>
</div></section>
<section class="ip-section" id="all" aria-labelledby="all-h"><div class="wrap">
  <div class="ip-head"><h2 class="ip-h2" id="all-h">All ${items.length} in <span class="ip-hand">${esc(S.title)}</span></h2><p>Grouped by category. Click one for downloads, colours and sizes.</p></div>
${CATS.map(c => { const g = items.filter(i => i.category === c); return g.length ? `  <div class="hub-group"><h3 id="cat-${c}"><a href="../categories/${c}.html">${esc(catTitle(c))}</a> <small>${g.length}</small></h3>
  ${hubGrid(g, s, false)}</div>` : '' }).join('\n')}
</div></section>
<section class="ip-section" aria-labelledby="more-h"><div class="wrap">
  <div class="ip-head"><h2 class="ip-h2" id="more-h">All ${numw(NS)} <span class="ip-hand">styles</span></h2></div>
  ${styleNav(s)}
</div></section>
</div>`
    const jsonld = { '@context': 'https://schema.org', '@graph': [...BASE_GRAPH,
      { '@type': 'CollectionPage', '@id': url, url, name: title, description: desc, inLanguage: 'en', isPartOf: { '@id': SITE_NODE['@id'] }, breadcrumb: { '@id': `${url}#breadcrumb` }, mainEntity: { '@id': `${url}#list` },
        about: { '@type': 'Thing', name: `${S.title} style icons`, description: S.description }, license: LICENSE_URL, dateModified: maxDate(items.map(j => dateOf(j.mtime))), primaryImageOfPage: { '@type': 'ImageObject', url: `${BASE}/og/style-${s}.png`, width: 1200, height: 630 } },
      crumbLd(`${url}#breadcrumb`, crumbItems),
      { '@type': 'ItemList', '@id': `${url}#list`, name: `${S.title} style icons`, numberOfItems: items.length,
        itemListElement: items.map((j, k) => ({ '@type': 'ListItem', position: k + 1, url: pageUrl(j.name), name: `${j.title} icon` })) },
    ] }
    return page({ title, description: desc, canonical: url, og: `${BASE}/og/style-${s}.png`, ogAlt: `${S.title} style icons from ${BRAND}`, jsonld, main, bodyClass: 'ip-page hub-page', styleCls: `s-${s}` })
  }

  /* ───────────── write pages ───────────── */
  const written = {}
  function write(rel, text) {
    const f = path.join(SITE, rel)
    fs.mkdirSync(path.dirname(f), { recursive: true })
    if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== text) fs.writeFileSync(f, text)
    written[rel] = Buffer.byteLength(text)
  }
  function prune(dir, keep) {
    const d = path.join(SITE, dir); if (!fs.existsSync(d)) return
    for (const f of fs.readdirSync(d)) if (!keep.has(f)) fs.rmSync(path.join(d, f))
  }
  ICONS.forEach((i, k) => write(`icons/${i.name}.html`, iconPage(i, k)))
  prune('icons', new Set(ICONS.map(i => `${i.name}.html`)))
  CATS.forEach(c => write(`categories/${c}.html`, categoryPage(c)))
  prune('categories', new Set(CATS.map(c => `${c}.html`)))
  STYLES.forEach(s => write(`styles/${s.name}.html`, stylePage(s.name)))
  prune('styles', new Set(STYLES.map(s => `${s.name}.html`)))
  for (const s of STYLES) {
    write(`sprites/${s.name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg">${ICONS.filter(i => INNER(i.name)[s.name]).map(i => `<symbol id="with-${i.name}" viewBox="0 0 24 24">${INNER(i.name)[s.name]}</symbol>`).join('')}</svg>\n`)
  }
  prune('sprites', new Set(STYLES.map(s => `${s.name}.svg`)))

  /* ───────────── icons.html: JSON-LD + crawlable index ───────────── */
  {
    const f = path.join(SITE, 'icons.html')
    if (fs.existsSync(f)) {
      let html = fs.readFileSync(f, 'utf8')
      const url = `${BASE}/icons.html`
      const ld = { '@context': 'https://schema.org', '@graph': [...BASE_GRAPH, CODE_NODE,
        { '@type': 'CollectionPage', '@id': url, url, name: `Free icon library | ${BRAND}`, description: `Search ${ICONS.length} free icons in ${NS} styles. Copy as an image, drag into slides, or download SVG and PNG.`, inLanguage: 'en', isPartOf: { '@id': SITE_NODE['@id'] }, mainEntity: { '@id': `${url}#list` }, license: LICENSE_URL },
        { '@type': 'ItemList', '@id': `${url}#list`, name: `${BRAND} icons`, numberOfItems: ICONS.length, itemListElement: ICONS.map((j, k) => ({ '@type': 'ListItem', position: k + 1, url: pageUrl(j.name), name: `${j.title} icon` })) },
      ] }
      const ldTag = `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`
      const index = `        <div class="ix-cols">
${CATS.map(c => `          <section class="ix-cat" aria-labelledby="ix-${c}"><h3 id="ix-${c}"><a href="categories/${c}.html">${esc(catTitle(c))}</a><small>${inCat(c).length}</small></h3><ul>${inCat(c).map(j => `<li><a href="icons/${j.name}.html" title="${esc(j.description)}">${esc(j.title)}</a></li>`).join('')}</ul></section>`).join('\n')}
          <section class="ix-cat" aria-labelledby="ix-styles"><h3 id="ix-styles">Styles<small>${NS}</small></h3><ul>${STYLES.map(s => `<li><a href="styles/${s.name}.html">${esc(s.title)}</a></li>`).join('')}</ul></section>
        </div>`
      html = html.replace(/<!-- JSONLD:BEGIN -->[\s\S]*?<!-- JSONLD:END -->/, `<!-- JSONLD:BEGIN -->\n  ${ldTag}\n  <!-- JSONLD:END -->`)
      html = html.replace(/<!-- ICON-INDEX:BEGIN -->[\s\S]*?<!-- ICON-INDEX:END -->/, `<!-- ICON-INDEX:BEGIN -->\n${index}\n<!-- ICON-INDEX:END -->`)
      write('icons.html', html)
    }
  }

  /* ───────────── icons.json ───────────── */
  const iconsJson = {
    name: BRAND, homepage: `${BASE}/`, publisher: PUB.name, publisherUrl: PUB.url, packageScope: SCOPE, packagesStatus: 'launching soon', version: VERSION, license: 'MIT', repository: REPO,
    search: { api: `${BASE}/api/search?q=`, mcp: `npx -y ${SCOPE}/mcp`, cli: 'npx withicons search <query>' },
    classes: { stylesheet: CLASSES_CSS, pattern: 'with with-<name> with-<style>' }, webComponent: '<with-icon name="<name>" variant="<style>">',
    total: ICONS.length, defaultStyle: 'line', styleCount: NS,
    motion: { package: `${SCOPE}/motion`, status: 'launching soon', css: `${CDN}/${SCOPE}/motion/dist/motion.css`, iconsCss: `${CDN}/${SCOPE}/motion/dist/icons.css`, presets: MOTION_PRESETS, effects: MOTION_EFFECTS,
      classes: 'wm wm-loop|wm-hover|wm-once [wm-p-<preset>]; data-wm="<name>"; swap: wm-swap wm-fx-<effect> [wm-swap-auto|wm-swap-focus|wm-loop] > .wm-a + .wm-b', vars: ['--wm-dur', '--wm-k', '--wm-ox', '--wm-oy', '--wm-dx', '--wm-dy', '--wm-steps'],
      swapVars: ['--wm-swap-dur', '--wm-swap-ease', '--wm-swap-delay', '--wm-swap-hold'], swapTriggers: ['click (aria-pressed / is-on)', 'hover (.wm-trigger)', 'focus (wm-swap-focus)', 'auto (wm-swap-auto)'] },
    styles: STYLES.map(s => ({ name: s.name, title: s.title, kind: s.kind, group: s.group, palette: s.palette, color: s.hex, description: s.description, plain: s.say, goodFor: s.good, strokeWidth: s.strokeWidth, page: styleUrl(s.name) })),
    categories: CATS.map(c => ({ name: c, title: catTitle(c), count: inCat(c).length, page: catUrl(c) })),
    aliases: Object.fromEntries(Object.keys(aliasIndex).sort().map(a => [a, aliasIndex[a]])),
    icons: ICONS.map(i => ({
      name: i.name, title: i.title, component: pascal(i.name), category: i.category, description: i.description, aliases: i.aliases, synonyms: i.synonyms, tags: i.tags, styles: i.styles,
      page: pageUrl(i.name), og: `${BASE}/og/${i.name}.png`,
      ...(MOTION[i.name] ? { motion: { intent: MOTION[i.name].intent, loop: MOTION[i.name].loop, hover: MOTION[i.name].hover, alt: MOTION[i.name].alt || [], swap: MOTION[i.name].swap || [] } } : {}),
      svg: Object.fromEntries(i.styles.map(s => [s, cdnSvg(s, i.name)])),
      usage: {
        react: `import { ${comp(i.name)} } from '${SCOPE}/react'`,
        vue: `import { ${comp(i.name)} } from '${SCOPE}/vue'`,
        svelte: `import { ${comp(i.name)} } from '${SCOPE}/svelte'`,
        angular: `import { WithIconComponent, ${comp(i.name)} } from '${SCOPE}/angular'`,
        solid: `import { ${comp(i.name)} } from '${SCOPE}/solid'`,
        web: `<with-icon name="${i.name}"></with-icon>`,
        classes: `<i class="with with-${i.name}"></i>`,
        sprite: `<svg width="24" height="24"><use href="sprite-line.svg#with-${i.name}"/></svg>`,
      },
    })),
  }
  write('icons.json', JSON.stringify(iconsJson) + '\n')

  /* ───────────── llms.txt / llms-full.txt ───────────── */
  // pages generated by other tools (alternatives/compare/free) join the sitemap and llms.txt when present
  const EXTRA_DIRS = ['alternatives', 'compare', 'free']
  const ALTS = (() => {
    const j = readJSON(path.join(SITE, 'data', 'alternatives.json'))
    // accepts a flat list, or { sections: [{ title, pages: [...] }] } (what site-alternatives.mjs writes)
    if (j && Array.isArray(j.sections)) return j.sections
      .map(s => ({ title: s.title, pages: (s.pages || []).filter(a => a && a.url && a.title) })).filter(s => s.pages.length)
    const arr = Array.isArray(j) ? j : j && (j.pages || j.items || j.alternatives)
    return Array.isArray(arr) && arr.length ? [{ title: 'Alternatives & comparisons', pages: arr.filter(a => a && a.url && a.title) }] : []
  })()
  const absUrl = u => /^https?:/.test(u) ? u : `${BASE}/${String(u).replace(/^\.?\//, '')}`
  const ALT_SECTION = ALTS.map(sec => `## ${sec.title}

${sec.pages.map(a => `- [${a.title}](${absUrl(a.url)})${a.summary ? `: ${String(a.summary).replace(/\s+/g, ' ').trim()}` : ''}`).join('\n')}

`).join('')

  // Same wording as WI.askAI.prompt({ intent: 'find' }) in site/js/site.js (the "Ask AI" buttons), with no need typed yet.
  const ASK_PROMPT = `First, open and follow ${BASE}/skill/SKILL.md — the guide to "with icons" (${BASE}): ${ICONS.length} free, MIT-licensed icons, each drawn in ${NS} styles (${STYLES.map(x => x.name).join(', ')}), with optional animations. Look icons up with ${BASE}/api/search?q=WORDS (it understands synonyms and typos; overview: ${BASE}/llms.txt). Only use icon names that exist there — never invent one.

MY TASK: find the best icon for what I’m making. Ask me first, in one short question, what it is and what the icon must say.

Reply with:
1. Best fit: exact name + one line on why my users will read it right.
2. Up to 2 alternatives, one line each.
3. The best style for this context, and why (line or solid for UI controls; ${list(STYLES.filter(x => x.kind !== 'universal').map(x => x.name))} only at 32px+).
4. Ready-to-paste code for my stack, or steps for my app — ask if you don’t know it (React, Vue, Svelte, plain HTML, or Slides, Canva, Figma, Docs). Include an accessible label.
5. A link for each pick: ${BASE}/icons/NAME.html

If you can’t open links, say so instead of guessing. What I know: names are kebab-case (trash, arrow-right, check-circle); every icon page ${BASE}/icons/NAME.html has Copy image, SVG/PNG download and Copy SVG code today. Launching soon: <i class="with with-NAME with-STYLE"></i> with the CDN stylesheet (line needs no style class) and npm packages (@withicons/react, vue, svelte, angular, solid).

Keep it short and practical.`
  const llmsCore = `# ${BRAND}

> ${BRAND} (${BASE}/, powered by ${PUB.name}) is a free, MIT-licensed SVG icon library: ${ICONS.length} icons x ${NS} styles = ${(ICONS.length * NS).toLocaleString('en-US')} icons. Every icon is one hand-drawn skeleton on a 24x24 grid rendered by ${NS} style renderers, so all styles share names, grid and props. People copy icons as images, drag them into Google Slides, PowerPoint, Canva, Figma and Notion, or download SVG/PNG at any size and colour. Developers get packages for React, Vue 3, Svelte 4/5, Angular 17+, SolidJS, a \`<with-icon>\` web component, CSS icon classes, SVG sprites and plain SVG files, plus optional animations (\`${SCOPE}/motion\`): ${Object.keys(MOTION).length} icons ship their own loop, hover move and "turns into" transitions, and every icon can use any of ${MOTION_PRESETS.length} presets.

Website: ${BASE}/ · Library: ${BASE}/icons.html · Source: ${REPO} · Publisher: ${PUB.name} (${PUB.url}) · Version: ${VERSION}

## Status

The npm packages under \`${SCOPE}/*\` are launching soon; install commands below are the final names. Until then use the website's Copy/Download buttons or the SVG files on each icon page.

## Using ${BRAND} from a chat assistant

No setup needed for Claude, ChatGPT, Gemini, Perplexity, Grok or any assistant that can read the web. Next to every search box on ${BASE}/ (home, the ⌘K overlay, the library) and on ${BASE}/ai.html, an "Ask AI" button turns what the visitor typed into a brief and opens their assistant with it pre-filled (Gemini cannot be pre-filled: the brief is copied to paste). Every brief starts by sending the assistant to the skill, ${BASE}/skill/SKILL.md.

Find the right icon (the default brief; the visitor's words and the site's own top matches are added when present):

\`\`\`text
${ASK_PROMPT}
\`\`\`

On every icon page (and in the library's icon viewer) the visitor picks a task for that icon, adds an optional "What are you making?" line, and gets a brief naming the icon, its style and page:

- Code it for my app: exact code for their stack in that style, size and colour, the aria-label and tooltip wording, hover/focus/active/disabled states, one pitfall.
- Build a matching set: the 4-8 library icons that belong beside it on that screen or flow, one style, size and stroke, why each, and any gap with the closest substitute.
- Is this the right icon?: a verdict, what people will read it as, ambiguity or cultural issues, whether it needs a text label, and up to 3 better options.
- Use it in my slides/doc: which file to grab (Copy image, SVG, or PNG at 256 or 1024 px), how to insert, recolour and resize it in their app, layout tips, and the matching guide (${BASE}/guides/<app>.html). App guides send the same brief for their app.

Assistants answering any of them: read the skill first, look icons up with ${BASE}/api/search?q=<words>, recommend real names only, link each icon's page (${BASE}/icons/<name>.html), and give code to developers or step-by-step instructions for slides, docs and design tools.

## Find an icon (search)

- Library search (understands meaning, aliases and synonyms: "throw away" finds trash): ${BASE}/icons.html?q=<query>
- Remote API: ${BASE}/api/search?q=<query>
- MCP server for AI agents: \`npx -y ${SCOPE}/mcp\`
- CLI: \`npx withicons search "<query>"\`

## Install (launching soon)

- React: \`npm i ${SCOPE}/react\`
- Vue 3: \`npm i ${SCOPE}/vue\`
- Svelte 4/5: \`npm i ${SCOPE}/svelte\`
- Angular 17+: \`npm i ${SCOPE}/angular\`
- SolidJS: \`npm i ${SCOPE}/solid\`
- Web component (any framework or none): \`npm i ${SCOPE}/web\` or \`<script type="module" src="${WEB_JS}"></script>\`
- Icon classes (CSS only): one stylesheet per style you use, e.g. \`<link rel="stylesheet" href="${classCss('line')}">\` (\`with-<style>.css\`; \`with-all.css\` has every style at once, ~2 MB gzipped, for prototypes)
- SVG sprites and standalone files: \`npm i ${SCOPE}/static\`
- Data, metadata, alias resolution, search, toSvg(): \`npm i ${SCOPE}/core\` (search engine alone: \`${SCOPE}/search\`)

## Canonical usage

Component name = PascalCase of the kebab-case icon name (\`arrow-up-right\` -> \`ArrowUpRight\`). Every icon is also exported as \`<Name>Icon\`; prefer \`MapIcon\`, \`ImageIcon\`, \`LinkIcon\`, \`FileIcon\`, \`HistoryIcon\` where the short name would shadow a global.
The package root is the \`line\` style. Every other style is a subpath with the SAME export names.

\`\`\`js
import { Home, Search } from '${SCOPE}/react'            // line (default)
import { Home as HomeSolid } from '${SCOPE}/react/solid'
import { Trash } from '${SCOPE}/vue/duo'
import { Bell } from '${SCOPE}/svelte/sketch'
import { Icon } from '${SCOPE}/react'                    // <Icon name="home" variant="solid" /> (bundles all icons)
\`\`\`

- Web component: \`<with-icon name="home" variant="solid" size="24" label="Home"></with-icon>\` (use \`variant\`, not \`style\`; \`label\` for an accessible name).
- Icon classes: \`<i class="with with-home"></i>\` (line), \`<i class="with with-home with-solid"></i>\` (also ${STYLES.slice(2).map(x => `\`with-${x.name}\``).join(', ')}). One style only: \`with-line.css\`, \`with-solid.css\`, … instead of \`with-all.css\`.
- Angular: \`import { WithIconComponent, Home } from '${SCOPE}/angular'\`, then \`<with-icon [icon]="Home" />\`.
- Sprite: \`<svg width="24" height="24"><use href="/sprite-line.svg#with-home"/></svg>\` (symbol ids are \`with-<name>\`).
- Single SVG: \`${CDN}/${SCOPE}/core/dist/svg/<style>/<name>.svg\`
- Framework SVGs carry \`class="withi withi-<name>"\`. CSS hooks: \`--with-duo\` recolours the duo tone, \`--with-accent\` the blueprint construction lines.

## Styles (subpath = style name)

${STYLES.map(s => `- \`${s.name}\` (${s.kind}${s.name === 'line' ? ', default' : ''}, colour ${s.hex}): ${s.say} Good for ${s.good}. Page: ${styleUrl(s.name)}`).join('\n')}

## Motion (optional, imported separately; launching soon)

Animations live in \`${SCOPE}/motion\` and never change the icons. They animate the element that holds the icon, so they work with every style and package. Each icon page has a live editor ("Customize") that previews them, exports an animated SVG and copies the code.

\`\`\`html
<link rel="stylesheet" href="${CDN}/${SCOPE}/motion/dist/motion.css">
<link rel="stylesheet" href="${CDN}/${SCOPE}/motion/dist/icons.css">   <!-- per-icon defaults -->
<span class="wm wm-loop" data-wm="bell"><i class="with with-bell"></i></span>               <!-- the icon's own loop -->
<button class="wm-trigger"><span class="wm wm-hover" data-wm="bell">…</span> Alerts</button>  <!-- plays on hover/focus -->
<span class="wm wm-loop wm-p-spin" style="--wm-dur:2s">…</span>                              <!-- any preset -->
<span class="wm-swap wm-fx-flip"><svg class="wm-a">…play…</svg><svg class="wm-b">…pause…</svg></span>  <!-- icon A turns into B -->
<span class="wm-swap wm-fx-morph wm-swap-auto" style="--wm-swap-dur:.8s;--wm-swap-hold:1.2s">…</span>    <!-- A -> B -> A on its own -->
\`\`\`

- Triggers: \`wm-loop\` (continuous), \`wm-hover\` (hover/focus of the icon or of a \`.wm-trigger\` ancestor), \`wm-once\` (on load), \`wm-inview\` (JS). Reduced motion turns everything off unless \`wm-force\`.
- Presets (\`wm-p-<name>\`): ${MOTION_PRESETS.join(', ')}.
- Swap effects (\`wm-fx-<name>\`): ${MOTION_EFFECTS.join(', ')}. The swap shows B on hover of \`.wm-trigger\`, or when the wrapper has \`.is-on\` / \`aria-pressed="true"\`. \`wm-swap-focus\` shows B while focused, \`wm-swap-auto\` switches on its own.
- Swap timing vars: \`--wm-swap-dur\` (one transition, s), \`--wm-swap-ease\` (easing of the incoming icon), \`--wm-swap-delay\`, \`--wm-swap-hold\` (auto: rest on each icon). Each icon of a swap can have its own style (\`swap-to="pause@kawaii"\`) and colours (style / \`swap-color\` / \`swap-colors\`).
- Tuning vars: \`--wm-dur\` (s), \`--wm-k\` (intensity), \`--wm-ox/--wm-oy\` (pivot), \`--wm-dx/--wm-dy\` (direction), \`--wm-steps\`.
- JS: \`import { motion, swap, motionFor } from '${SCOPE}/motion'\`; web component: \`<with-icon name="bell" motion="hover" swap-to="bell-off" swap-effect="flip">\` after importing \`${SCOPE}/motion/element\`.
- Per-icon specs (intent, loop, hover, alternatives, swap targets) are in icons.json under \`icons[].motion\`.

## Props (identical in React, Vue, Svelte, Angular, Solid)

- \`size\` number | string, default 24
- \`color\` string, default \`currentColor\`
- \`strokeWidth\` number (line, duo, blueprint, sketch)
- \`absoluteStrokeWidth\` boolean, default false
- \`title\` string: adds \`<title>\` and \`role="img"\`; without it the svg is \`aria-hidden="true"\`.

## Naming rules

- kebab-case, plain English, object first, modifier after: \`file-text\`, \`user-plus\`, \`bell-off\`, \`arrow-up-right\`.
- \`-circle\` / \`-square\` = glyph inside a container; \`-off\` = slashed/disabled. Close/dismiss is \`close\`.
- Every icon has aliases and synonyms (e.g. \`trash\`: bin, delete, remove, "throw away"). Unique aliases resolve to the icon; shared ones return candidates.

## Machine-readable data

- [icons.json](${BASE}/icons.json): every icon with name, title, component, category, description, aliases, synonyms, tags, styles, page URL, SVG URLs and usage snippets; plus styles, categories and the alias map.
- [llms-full.txt](${BASE}/llms-full.txt): this file plus one line per icon.
- [sitemap.xml](${BASE}/sitemap.xml)
- Per-icon pages: \`${BASE}/icons/<name>.html\`

## Categories

${CATS.map(c => `- [${catTitle(c)}](${catUrl(c)}) (${inCat(c).length}): ${catIntro(c)}`).join('\n')}

${ALT_SECTION}## Guides for non-developers

- [How to use icons](${BASE}/guides/index.html): Google Slides, PowerPoint, Keynote, Canva, Figma, Word & Google Docs, Notion, WordPress, Webflow, Framer, Wix & Squarespace, email signatures, plain HTML.

## License

MIT. Free for personal and commercial use; no attribution required. Credit line if you want one: "Icons: ${BRAND} (withicons.com)".
`
  write('llms.txt', llmsCore)
  const llmsFull = llmsCore.replace(/^# .*\n/, `# ${BRAND} — full reference\n`) + `
## Every icon

Format: name | category | also known as | page URL. Component = PascalCase(name). SVG = ${CDN}/${SCOPE}/core/dist/svg/<style>/<name>.svg

${ICONS.map(i => `${i.name} | ${i.category} | ${akaOf(i).join(', ')} | ${pageUrl(i.name)}`).join('\n')}

## Motion intents (what each icon's animation says)

${ICONS.filter(i => MOTION[i.name]).map(i => `- \`${i.name}\`: ${MOTION[i.name].intent} (loop ${MOTION[i.name].loop.preset}, hover ${MOTION[i.name].hover.preset}${(MOTION[i.name].swap || []).length ? `; turns into ${MOTION[i.name].swap.map(x => x.to).join(', ')}` : ''})`).join('\n') || '- none yet'}

## Icon descriptions

${ICONS.map(i => `- \`${i.name}\` (${i.category}): ${i.description} Tags: ${i.tags.join(', ')}.`).join('\n')}

## Ambiguous aliases (shared by several icons; resolve() returns candidates)

${Object.keys(aliasIndex).sort().filter(a => aliasIndex[a].length > 1).map(a => `- ${a} -> ${aliasIndex[a].join(', ')}`).join('\n') || '- none'}
`
  write('llms-full.txt', llmsFull)

  /* ───────────── robots.txt + sitemap.xml ───────────── */
  const AI_BOTS = ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-Web', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Applebot', 'CCBot', 'Bytespider', 'Amazonbot', 'meta-externalagent', 'DuckAssistBot', 'cohere-ai', 'MistralAI-User']
  write('robots.txt', `# ${BRAND} — ${BASE}/  (powered by ${PUB.name})
# Everything here is MIT licensed and meant to be found, read and used, by people and by AI.
# Agents: start with ${BASE}/llms.txt (full reference: ${BASE}/llms-full.txt, data: ${BASE}/icons.json).

User-agent: *
Allow: /

# AI crawlers and assistants are explicitly welcome.
${AI_BOTS.map(b => `User-agent: ${b}\nAllow: /`).join('\n\n')}

Sitemap: ${BASE}/sitemap.xml
`)
  const lastIcon = maxDate(ICONS.map(i => dateOf(i.mtime)))
  const buildDate = maxDate([lastIcon, fileDate(path.join(ROOT, 'forge', 'site.config.json'))])
  // top-level and guide pages are discovered from disk, so new pages land in the sitemap automatically
  const PRI = { 'index.html': '1.0', 'icons.html': '0.9', 'guides/index.html': '0.8', 'developers.html': '0.7', 'ai.html': '0.7' }
  const discovered = [
    ...fs.readdirSync(SITE).filter(f => f.endsWith('.html') && !/^(404|demo)/.test(f)),
    ...['guides', ...EXTRA_DIRS].flatMap(d => fs.existsSync(path.join(SITE, d)) ? fs.readdirSync(path.join(SITE, d)).filter(f => f.endsWith('.html') && !/^(404|demo)/.test(f)).map(f => `${d}/${f}`) : []),
  ].sort((a, b) => (PRI[b] || '0.6') - (PRI[a] || '0.6') || (a < b ? -1 : 1))
  const urls = [
    ...discovered.map(f => ({ loc: f === 'index.html' ? `${BASE}/` : `${BASE}/${f}`, lastmod: fileDate(path.join(SITE, f)) || buildDate, pri: PRI[f] || (/^(guides|alternatives|compare|free)\//.test(f) ? '0.7' : '0.6'), freq: f === 'index.html' || f === 'icons.html' ? 'weekly' : 'monthly' })),
    ...STYLES.map(s => ({ loc: styleUrl(s.name), lastmod: lastIcon, pri: '0.8', freq: 'weekly', img: `${BASE}/og/style-${s.name}.png` })),
    ...CATS.map(c => ({ loc: catUrl(c), lastmod: maxDate(inCat(c).map(i => dateOf(i.mtime))), pri: '0.8', freq: 'weekly', img: `${BASE}/og/cat-${c}.png` })),
    ...ICONS.map(i => ({ loc: pageUrl(i.name), lastmod: dateOf(i.mtime), pri: '0.7', freq: 'monthly', img: `${BASE}/og/${i.name}.png` })),
    { loc: `${BASE}/llms.txt`, lastmod: buildDate, pri: '0.5', freq: 'weekly' },
    { loc: `${BASE}/llms-full.txt`, lastmod: buildDate, pri: '0.5', freq: 'weekly' },
  ]
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(u => `  <url><loc>${esc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.pri}</priority>${u.img ? `<image:image><image:loc>${u.img}</image:loc></image:image>` : ''}</url>`).join('\n')}
</urlset>
`)

  /* ───────────── Open Graph images ───────────── */
  let ogMade = 0, ogBytes = 0
  if (!NO_OG) {
    let Resvg = null
    try { ({ Resvg } = await import('@resvg/resvg-js')) } catch (e) { console.warn('  site-seo: @resvg/resvg-js not available, OG images skipped') }
    if (Resvg) {
      const OGC_FILE = path.join(CACHE_DIR, 'og-cache.json')
      const ogc = (!FORCE && readJSON(OGC_FILE)) || {}
      const FONT_DIRS = ['C:/Windows/Fonts', '/usr/share/fonts', '/usr/share/fonts/truetype/dejavu', '/System/Library/Fonts', '/Library/Fonts']
      const want = ['seguibl.ttf', 'segoeuib.ttf', 'segoeui.ttf', 'seguisb.ttf', 'consola.ttf', 'consolab.ttf', 'DejaVuSans.ttf', 'DejaVuSans-Bold.ttf', 'DejaVuSansMono.ttf']
      const fontFiles = FONT_DIRS.flatMap(d => want.map(f => path.join(d, f))).filter(f => fs.existsSync(f))
      const fontOpt = fontFiles.length >= 2 ? { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Segoe UI' } : { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' }
      const SANS = "'Segoe UI', 'DejaVu Sans', Arial, sans-serif", MONO = "Consolas, 'DejaVu Sans Mono', monospace"
      const PAPER = '#FBF8F3', INK = '#111318', MUTED = '#5F6573', SUN = '#FFD23F', GOLD = '#B8965A'
      const colorize = (m, c) => resolveVars(m).replace(/currentColor/g, c)
      const nested = (n, s, x, y, size, c) => {
        const root = { ...STYLE[s].root }
        return `<svg${attrs({ x, y, width: size, height: size, viewBox: '0 0 24 24', overflow: 'visible' })}><g${attrs(Object.fromEntries(Object.entries(root).map(([k, v]) => [k, typeof v === 'string' ? colorize(v, c) : v])))}>${colorize(INNER(n)[s], c)}</g></svg>`
      }
      const xmlEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      // wordmark: the outlined "with" / "icons" / "powered by evergrow" groups from site/brand/logo.svg (hand font baked in)
      const logoSrc = fs.existsSync(path.join(SITE, 'brand', 'logo.svg')) ? fs.readFileSync(path.join(SITE, 'brand', 'logo.svg'), 'utf8') : ''
      const groups = [...logoSrc.matchAll(/<g transform="([^"]+)" fill="(#[0-9A-Fa-f]{3,6})">([\s\S]*?)<\/g>/g)].map(m => ({ tr: m[1], fill: m[2], body: m[3] }))
      const wordmark = (x, y, scale, withC, iconsC = INK, byC = MUTED) => {
        if (groups.length >= 3) {
          const [w, ic, by] = groups
          return `<g transform="translate(${x} ${y}) scale(${scale}) translate(-74 -14)"><g transform="${w.tr}" fill="${withC}">${w.body}</g><g transform="${ic.tr}" fill="${iconsC}">${ic.body}</g><g transform="${by.tr}" fill="${byC}">${by.body}</g></g>`
        }
        return `<text x="${x}" y="${y + 52 * scale}" font-family="${SANS}" font-weight="900" font-size="${50 * scale}" fill="${iconsC}"><tspan fill="${withC}" font-style="italic">with</tspan>icons</text>`
      }
      const bg = (c = PAPER) => `<rect width="1200" height="630" fill="${c}"/>`
      // one row when it fits (7 styles), otherwise two rows filling the same 1072px band
      const tiles = (n, x0, y0) => {
        const own = STYLES.filter(s => INNER(n)[s.name]), cols = own.length <= 8 ? own.length : Math.ceil(own.length / 2), rows = Math.ceil(own.length / cols)
        const gap = rows > 1 ? 14 : 15.3, w = (1072 - (cols - 1) * gap) / cols, h = rows > 1 ? 112 : w + 34, ic = rows > 1 ? 56 : w * .56
        return own.map((s, k) => { const x = x0 + (k % cols) * (w + gap), y = y0 + Math.floor(k / cols) * (h + 12); const ink = lumOf(s.hex) > 0.55 ? '#111318' : '#FFFFFF'; return `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${rows > 1 ? 24 : 30}" fill="${s.hex}"/>${nested(n, s.name, x + (w - ic) / 2, y + (rows > 1 ? 14 : w * .16), ic, ink)}<text x="${(x + w / 2).toFixed(1)}" y="${(y + h - (rows > 1 ? 14 : 20)).toFixed(1)}" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="${rows > 1 ? 13 : 16}" letter-spacing="${rows > 1 ? 1.5 : 2}" fill="${ink}">${s.name.toUpperCase()}</text>` }).join('')
      }
      const foot = (y = 596) => `<text x="64" y="${y}" font-family="${MONO}" font-size="20" letter-spacing="1" fill="${MUTED}">withicons.com · free · MIT · powered by <tspan fill="${GOLD}" font-weight="700">Evergrow</tspan></text>`
      const fitTitle = (t, max = 1072, base = 92) => Math.min(base, Math.floor(max / (t.length * 0.56)))
      const cards = []
      cards.push(['default', () => {
        const pick = ['home', 'heart', 'bell', 'camera', 'star', 'rocket', 'search', 'calendar', 'trash', 'mail', 'settings', 'palette', 'sun', 'gift'].filter(n => BY[n])
        const grid = pick.slice(0, 12).map((n, k) => { const s = STYLES[k % NS], cx = 728 + (k % 4) * 112, cy = 92 + Math.floor(k / 4) * 112; return `<rect x="${cx}" y="${cy}" width="96" height="96" rx="26" fill="${s.hex}"/>${nested(n, s.name, cx + 22, cy + 22, 52, '#FFFFFF')}` }).join('')
        return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${bg()}
${wordmark(64, 56, 1.25, HEX.line)}
<text x="62" y="300" font-family="${SANS}" font-weight="900" font-size="72" letter-spacing="-2" fill="${INK}">Free icons for</text>
<text x="62" y="380" font-family="${SANS}" font-weight="900" font-size="72" letter-spacing="-2" fill="${INK}">slides, docs &amp; sites</text>
<rect x="62" y="402" width="420" height="14" rx="7" fill="${SUN}"/>
<text x="64" y="470" font-family="${SANS}" font-size="30" fill="${MUTED}">${ICONS.length} icons · ${NS} styles · click to copy</text>
${grid}${foot()}</svg>`
      }])
      for (const s of STYLES) cards.push([`style-${s.name}`, () => {
        const pick = SHOWCASE.slice(0, 12)
        const grid = pick.map((n, k) => { const cx = 640 + (k % 4) * 128, cy = 70 + Math.floor(k / 4) * 128; return `<rect x="${cx}" y="${cy}" width="112" height="112" rx="30" fill="#FFFFFF" fill-opacity=".14"/>${nested(n, s.name, cx + 24, cy + 24, 64, '#FFFFFF')}` }).join('')
        return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${bg(s.hex)}
${wordmark(64, 56, 1.25, '#FFFFFF', '#FFFFFF', '#FFFFFF')}
<text x="62" y="320" font-family="${SANS}" font-weight="900" font-size="96" letter-spacing="-3" fill="#FFFFFF">${xmlEsc(s.title)}</text>
<text x="66" y="380" font-family="${SANS}" font-weight="700" font-size="36" fill="#FFFFFF" fill-opacity=".9">${ICONS.length} free icons · ${xmlEsc(s.kind)} style</text>
<text x="64" y="590" font-family="${MONO}" font-size="20" letter-spacing="1" fill="#FFFFFF" fill-opacity=".85">withicons.com · free · MIT · powered by Evergrow</text>
${grid}</svg>`
      }])
      for (const c of CATS) cards.push([`cat-${c}`, () => {
        const items = inCat(c).slice(0, 8), T = `${catTitle(c)} icons`
        const row = items.map((j, k) => { const s = STYLES[k % NS], x = 64 + k * 136; return `<rect x="${x}" y="380" width="120" height="120" rx="30" fill="${s.hex}"/>${nested(j.name, s.name, x + 28, 408, 64, '#FFFFFF')}` }).join('')
        return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${bg()}
${wordmark(64, 56, 1.25, HEX.line)}
<text x="1136" y="96" text-anchor="end" font-family="${MONO}" font-size="20" letter-spacing="3" fill="${MUTED}">${inCat(c).length} ICONS · ${NS} STYLES</text>
<text x="62" y="290" font-family="${SANS}" font-weight="900" font-size="${fitTitle(T, 1072, 100)}" letter-spacing="-3" fill="${INK}">${xmlEsc(T)}</text>
${row}${foot()}</svg>`
      }])
      for (const i of ICONS) cards.push([i.name, () => {
        const T = `${i.title} icon`, aka = akaOf(i).slice(0, 4).join(' · ')
        return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${bg()}
${wordmark(64, 48, 1.1, HEX.line)}
<text x="1136" y="88" text-anchor="end" font-family="${MONO}" font-size="20" letter-spacing="3" fill="${MUTED}">${xmlEsc(i.category.toUpperCase())} · FREE · SVG &amp; PNG</text>
<text x="62" y="236" font-family="${SANS}" font-weight="900" font-size="${fitTitle(T, 1072, 96)}" letter-spacing="-3" fill="${INK}">${xmlEsc(T)}</text>
${aka ? `<text x="66" y="292" font-family="${SANS}" font-size="28" fill="${MUTED}">also: ${xmlEsc(aka)}</text>` : ''}
${tiles(i.name, 64, NS > 8 ? 318 : 340)}${foot(604)}</svg>`
      }])
      fs.mkdirSync(path.join(SITE, 'og'), { recursive: true })
      const keep = new Set(), jobs = []
      for (const [key, make] of cards) {
        const svg = make(), h = sha('png8-v3/' + svg + JSON.stringify(fontOpt.fontFiles || 'sys')), f = path.join(SITE, 'og', `${key}.png`)
        keep.add(`${key}.png`)
        if (ogc[key] !== h || !fs.existsSync(f)) { jobs.push({ svg, file: f }); ogc[key] = h }
      }
      if (jobs.length) {
        const threads = Math.max(1, Math.min(8, (os.cpus()?.length || 2) - 1, Math.ceil(jobs.length / 8)))
        await Promise.all(Array.from({ length: threads }, (_, k) => jobs.filter((_, i) => i % threads === k)).map(sl => new Promise((ok, fail) => {
          const w = new Worker(SELF, { workerData: { withSeoOg: true, jobs: sl, font: fontOpt } })
          w.once('message', m => { ogMade += m; ok(); w.terminate() }); w.once('error', fail)
        })))
      }
      for (const k of keep) ogBytes += fs.statSync(path.join(SITE, 'og', k)).size
      for (const f of fs.readdirSync(path.join(SITE, 'og'))) if (!keep.has(f)) fs.rmSync(path.join(SITE, 'og', f))
      fs.writeFileSync(OGC_FILE, JSON.stringify(ogc))
    }
  }

  const htmlCount = Object.keys(written).filter(f => f.endsWith('.html')).length
  const bytes = Object.values(written).reduce((a, b) => a + b, 0)
  console.log(`site seo: ${ICONS.length} icon pages, ${CATS.length} categories, ${STYLES.length} styles (${htmlCount} html), sitemap ${urls.length} urls, ` +
    `${(bytes / 1048576).toFixed(1)} MB text` + (NO_OG ? '' : `, og ${ogMade} rendered / ${(ogBytes / 1048576).toFixed(1)} MB`) + ` in ${Date.now() - t0} ms`)
}
