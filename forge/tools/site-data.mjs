#!/usr/bin/env node
// Emits site/data/*.js for the zero-build website. Loaded with plain <script> tags
// (not fetch) so the site also works when opened straight from disk.
//   site/data/meta.js           window.WITH = { version, total, categories, styles, icons }
//   site/data/style-<name>.js   window.WITH_SVG[<name>] = { <icon>: '<inner svg markup>' }
//   site/data/by-icon/<icon>.js window.WITH_ICON[<icon>] = { <style>: '<inner svg markup>' }  (one icon, every style:
//                               the library's viewer + hover card and the studio load this instead of 20 style files)
//   site/icons.html             the #lib-style-samples block (the heart in every style, for the style pickers)
//
// forge/build.mjs calls build(ctx) with the renders it already has. Run directly
// (`node forge/tools/site-data.mjs`) it renders everything itself.
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { ROOT, listIcons, loadIcon, loadStyles, renderIcon, nodesToMarkup, readManifest } from '../lib/load.mjs'
import { sortStyles, styleVars, isPalette } from '../lib/emit-core.mjs'
import { STYLE_GROUPS } from './style-groups.mjs'

const outDir = path.join(ROOT, 'site', 'data')

// standalone: render every icon in every style (what forge/build.mjs already did when it calls build(ctx))
async function renderAll() {
  const styles = sortStyles(Object.values(await loadStyles()))
  const icons = listIcons().map(name => {
    const icon = loadIcon(name)
    const render = {}
    for (const s of styles) { try { render[s.name] = { inner: nodesToMarkup(renderIcon(s, icon)) } } catch { /* reported as FAILED below */ } }
    return { name, render }
  })
  return {
    icons,
    styles: styles.map(s => {
      const vars = styleVars(icons, s.name)
      return { name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root, palette: isPalette(s, vars), vars }
    }),
  }
}

export function build(ctx) {
  fs.mkdirSync(outDir, { recursive: true })
  const manifest = readManifest()
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
  // search fields come from the skeletons themselves (ctx.icons has no synonyms)
  const icons = ctx.icons.map(({ name }) => {
    const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'forge', 'icons', `${name}.json`), 'utf8'))
    return { name, category: raw.category, description: raw.description || '', aliases: raw.aliases || [], tags: raw.tags || [] }
  })
  // manifest order first, then any category only new skeletons use
  const categories = [...(manifest.categories || [])]
  for (const i of icons) if (i.category && !categories.includes(i.category)) categories.push(i.category)
  const meta = {
    version: pkg.withiconsVersion || pkg.version || '0.1.0',
    total: icons.length,
    categories,
    styles: ctx.styles.map(s => ({ name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root, palette: !!s.palette, vars: s.vars || {}, ...(richOf(ctx, s.name) ? { rich: true } : {}) })),
    icons,
  }
  const maps = {}, report = []
  for (const s of ctx.styles) {
    const map = {}
    let fails = 0
    for (const i of ctx.icons) { const r = i.render[s.name]; if (r) map[i.name] = r.inner; else fails++ }
    maps[s.name] = map
    const js = `(window.WITH_SVG=window.WITH_SVG||{})[${JSON.stringify(s.name)}]=${JSON.stringify(map)};\n`
    const f = path.join(outDir, `style-${s.name}.js`)
    if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== js) fs.writeFileSync(f, js)
    report.push(`${s.name}: ${Object.keys(map).length} icons, ${(js.length / 1024).toFixed(0)} KB${fails ? `, ${fails} FAILED` : ''}`)
  }
  report.push(styleChunks(meta, maps))
  fs.writeFileSync(path.join(outDir, 'meta.js'), `window.WITH=${JSON.stringify(meta)};\n`)
  // style files of styles that no longer exist (a removed renderer) go too
  for (const f of fs.readdirSync(outDir)) {
    const m = /^style-(.+)\.js$/.exec(f)
    if (m && !ctx.styles.some(s => s.name === m[1])) fs.rmSync(path.join(outDir, f))
  }
  report.push(byIcon(ctx), libSamples(ctx))
  report.push(homePacks(ctx), homeBento(ctx))
  report.push(pageCounts(ctx))
  return `site data: ${icons.length} icons x ${ctx.styles.length} styles\n  ` + report.join('\n  ')
}

// Heavy styles also ship in chunks: site/data/chunks/<style>.<k>.js, window.WITH_SVG_PART["<style>.<k>"] = { <icon>: markup }.
// Chunk k holds icons [k*size, (k+1)*size) in the library's browse order (meta.categories order, then name), so the
// library's first screen needs one small file instead of a 1-7 MB style (site.js WI.loadStyleFor / WI.loadStyle put
// them together again). meta.chunks = { size, dir }, and every chunked style says how many it has (meta.styles[i].chunks).
// The whole-style files stay (studio, search overlay fallbacks, older pages). Same input, same bytes; stale chunks go.
export const CHUNK_SIZE = 48
export const CHUNK_MIN = 1000000 // bytes of a style's file before it is worth splitting
export function browseOrder(icons, categories) {
  const rank = c => { const i = categories.indexOf(c); return i < 0 ? 1e6 : i }
  return icons.slice().sort((a, b) => (rank(a.category) - rank(b.category)) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)).map(i => i.name)
}
function styleChunks(meta, maps) {
  const dir = path.join(outDir, 'chunks'), keep = new Set(), done = []
  fs.mkdirSync(dir, { recursive: true })
  const order = browseOrder(meta.icons, meta.categories)
  meta.chunks = { size: CHUNK_SIZE, dir: 'data/chunks/' }
  for (const s of meta.styles) {
    delete s.chunks
    const map = maps[s.name]; if (!map) continue
    const bytes = JSON.stringify(map).length
    if (bytes < CHUNK_MIN) continue
    const n = Math.ceil(order.length / CHUNK_SIZE)
    for (let k = 0; k < n; k++) {
      const part = {}
      for (const name of order.slice(k * CHUNK_SIZE, (k + 1) * CHUNK_SIZE)) if (map[name] != null) part[name] = map[name]
      const js = `(window.WITH_SVG_PART=window.WITH_SVG_PART||{})[${JSON.stringify(`${s.name}.${k}`)}]=${JSON.stringify(part)};\n`
      const f = path.join(dir, `${s.name}.${k}.js`); keep.add(`${s.name}.${k}.js`)
      if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== js) fs.writeFileSync(f, js)
    }
    s.chunks = n
    done.push(s.name)
  }
  for (const f of fs.readdirSync(dir)) if (!keep.has(f)) fs.rmSync(path.join(dir, f))
  // icons.html starts the visitor's style downloading from <head>, before the deferred data/meta.js has run: it reads the
  // style names and the chunked ones from this one line
  const lib = path.join(ROOT, 'site', 'icons.html')
  if (fs.existsSync(lib)) {
    const h = fs.readFileSync(lib, 'utf8'), ch = { dir: meta.chunks.dir, all: meta.styles.map(s => s.name), chunked: done }
    const next = h.replace(/var CH = \{[^\n]*?\} \/\* STYLE-CHUNKS \*\//, () => `var CH = ${JSON.stringify(ch)} /* STYLE-CHUNKS */`)
    if (next !== h) fs.writeFileSync(lib, next)
  }
  return `chunks: ${done.length} styles x ${Math.ceil(order.length / CHUNK_SIZE)} files of ${CHUNK_SIZE} icons (${done.join(', ')})`
}

// a rich style (forge/CONTRACT.md "Rich styles"): its drawings carry gradients. The site loads those on demand.
const RICH_RE = /<(linear|radial)Gradient\b/
const richCache = new Map()
function richOf(ctx, s) {
  if (!richCache.has(s)) richCache.set(s, ctx.icons.some(i => i.render[s] && RICH_RE.test(i.render[s].inner)))
  return richCache.get(s)
}

// One file per icon with its drawing in every style (~20-60 KB raw, a few KB gzipped). Stale files are removed.
function byIcon(ctx) {
  const dir = path.join(outDir, 'by-icon'), keep = new Set()
  fs.mkdirSync(dir, { recursive: true })
  let bytes = 0
  for (const i of ctx.icons) {
    const map = {}
    for (const s of ctx.styles) { const r = i.render[s.name]; if (r) map[s.name] = r.inner }
    const js = `(window.WITH_ICON=window.WITH_ICON||{})[${JSON.stringify(i.name)}]=${JSON.stringify(map)};
`
    const f = path.join(dir, `${i.name}.js`); keep.add(`${i.name}.js`); bytes += js.length
    if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== js) fs.writeFileSync(f, js)
  }
  for (const f of fs.readdirSync(dir)) if (!keep.has(f)) fs.rmSync(path.join(dir, f))
  return `by-icon: ${keep.size} files, avg ${(bytes / Math.max(1, keep.size) / 1024).toFixed(0)} KB`
}
// icons.html's style pickers draw one sample (the heart) per style before any style file arrives
const SAMPLE = 'heart'
function libSamples(ctx) {
  const f = path.join(ROOT, 'site', 'icons.html')
  if (!fs.existsSync(f)) return 'lib samples: no icons.html'
  const ic = ctx.icons.find(i => i.name === SAMPLE); if (!ic) return 'lib samples: no ' + SAMPLE
  const map = Object.fromEntries(ctx.styles.filter(s => ic.render[s.name]).map(s => [s.name, ic.render[s.name].inner]))
  const block = '<!-- STYLE-SAMPLES:BEGIN -->\n<script type="application/json" id="lib-style-samples">' + JSON.stringify(map).replace(/</g, '\\u003c') + '</script>\n<!-- STYLE-SAMPLES:END -->'
  const html = fs.readFileSync(f, 'utf8'), next = html.replace(/<!-- STYLE-SAMPLES:BEGIN -->[\s\S]*?<!-- STYLE-SAMPLES:END -->/, () => block)
  if (next !== html) fs.writeFileSync(f, next)
  return `lib samples: ${Object.keys(map).length} styles`
}

// Home page packs (site/js/home-icons.js = window.WITH_HOME, site/js/home-icons-more.js = window.WITH_HOME_MORE) carry
// only what the home page draws, per style. The first pack is everything above the fold and the sections that paint
// straight away (hero icons, stage, the washing line, the final orbit, the use-case cards); the second loads right
// after it with every other icon the picker grid, "Icons that move" and the washing line's "dress them all as" use.
// Every style is rebuilt from this build's renders on every run, so the home page draws exactly what the library
// (icons.html) draws: same shapes, same default colours, same motion parts. (The original twelve styles used to keep
// hand-tuned copies; they went stale as the renderers moved on, so kawaii, sticker, pixel, duo… looked off at home.)
// the hero headline icons a new style joins (index.html data-ht-styles must list it too)
const HERO = { luxe: 'globe', bauhaus: 'chart-bar', skeuo: 'smartphone', anime: 'smartphone', gothic: 'globe', pastel: 'chart-bar', coquette: 'smartphone', plush: 'globe' }
// other first-paint sections that only show what the first pack has: the final orbit (home.js ORB) and the use-case
// cards (index.html data-use-ic + data-use-style). Keep in step with them.
const PAGE = {
  line: ['calendar', 'rocket'], solid: ['star'], duo: ['gift', 'calendar-check'], gloss: ['heart'], engrave: ['trophy', 'landmark'],
  blueprint: ['camera', 'cpu'], sketch: ['coffee', 'graduation-cap'], glass: ['cloud'], kawaii: ['smile', 'book-open'],
  sticker: ['zap', 'camera'], pixel: ['star', 'gamepad'], retro: ['rocket', 'music-note'], luxe: ['crown'], bauhaus: ['music-note'],
  skeuo: ['camera'], anime: ['rocket'], gothic: ['key'], pastel: ['cloud'], coquette: ['gift'], plush: ['star'],
}
// The washing line under the hero (index.html [data-washline], home.js): one polaroid per style. `cards` is the subject
// each style's polaroid shows (chosen to tell that style's story, in the first pack), `sky` the kawaii sun and moon,
// `try` the shared objects every polaroid can change into ("dress them all as"): only icons the first pack already carries
// in every style (the hero stage's), so the costumes cost nothing and never wait for the second pack. The first one
// is the first gust's surprise; heart (which the hero opens on) comes last, and home.js skips whatever the hero shows.
const WASHLINE = {
  cards: { line: 'home', solid: 'star', duo: 'package', gloss: 'heart', engrave: 'anchor', blueprint: 'ruler', sketch: 'lightbulb',
    glass: 'cloud', kawaii: 'coffee', sticker: 'smile', pixel: 'gamepad', retro: 'tv', luxe: 'gem', bauhaus: 'palette', skeuo: 'mail',
    anime: 'cat', gothic: 'heart', pastel: 'ice-cream', coquette: 'butterfly', plush: 'rabbit',
    clay: 'balloon', bento: 'layout-grid', suite: 'calendar', dock: 'message-circle',
    liquid: 'droplet', chrome: 'headphones', soft3d: 'cpu', brutal: 'thumbs-up',
    utsav: 'diya', rangoli: 'lotus', halloween: 'jack-o-lantern', christmas: 'christmas-tree', lunar: 'red-lantern', valentine: 'heart-pair' },
  sky: { sun: ['kawaii', 'sun'], moon: ['kawaii', 'moon'] },
  try: ['gift', 'coffee', 'rocket', 'camera', 'heart'],
  tryStyle: 'line',
}
// The hero stage (index.html [data-stage], home.js): slide k is style k drawn with its own representative icon, so the
// card walks through twenty different objects instead of one icon twenty times. The first icon of each list is in the
// first pack (it paints with the hero); the alternates, which take over on later rounds, ride in the second pack.
const SHOWCASE = {
  line: ['bike', 'telescope', 'send'], solid: ['apple', 'umbrella', 'paw-print'], duo: ['piggy-bank', 'palette', 'gift'],
  gloss: ['balloon', 'ice-cream', 'gamepad'], engrave: ['landmark', 'compass', 'hourglass'], blueprint: ['rocket', 'plane', 'car'],
  sketch: ['bird', 'cat', 'notebook'], glass: ['droplet', 'gem', 'snowflake'], kawaii: ['cloud', 'star', 'cat'],
  sticker: ['butterfly', 'pizza', 'cloud-lightning'], pixel: ['trophy', 'heart', 'star'], retro: ['disc', 'camera', 'bus'],
  luxe: ['crown', 'watch', 'key'], bauhaus: ['fish', 'tent', 'flower'], skeuo: ['alarm-clock', 'book-open', 'backpack'],
  anime: ['wand', 'flower', 'mountain'], gothic: ['bell', 'door-open', 'shield'], pastel: ['donut', 'rainbow', 'cake'],
  coquette: ['shopping-bag', 'mail', 'lock'], plush: ['cake', 'gift', 'heart'],
  clay: ['cake', 'balloon', 'cloud'],
  bento: ['calendar', 'chart-pie', 'mail'], suite: ['mail', 'folder', 'calendar'],
  dock: ['camera', 'message-circle', 'music-note'], liquid: ['droplet', 'cloud', 'bell'], chrome: ['headphones', 'star', 'zap'],
  soft3d: ['cpu', 'database', 'package'], brutal: ['thumbs-up', 'rocket', 'star'],
  utsav: ['diya', 'kalash', 'marigold'], rangoli: ['lotus', 'diya', 'puja-thali'], halloween: ['jack-o-lantern', 'ghost', 'witch-hat'],
  christmas: ['christmas-tree', 'snowman', 'gingerbread-man'], lunar: ['red-lantern', 'red-envelope', 'dragon-head'], valentine: ['heart-pair', 'teddy-bear', 'love-letter'],
}
function homePacks(ctx) {
  const files = [['home-icons.js', 'WITH_HOME'], ['home-icons-more.js', 'WITH_HOME_MORE']].map(([f, g]) => {
    const file = path.join(ROOT, 'site', 'js', f)
    if (!fs.existsSync(file)) return null
    const src = fs.readFileSync(file, 'utf8')
    const at = src.indexOf(`window.${g}=`)
    if (at < 0) return null
    return { file, g, head: src.slice(0, at), data: JSON.parse(src.slice(at + g.length + 8).trim().replace(/;$/, '')) }
  })
  const [A, B] = files
  if (!A) return 'home packs: none found'
  const byName = new Map(ctx.icons.map(i => [i.name, i]))
  const innerOf = (n, s) => { const i = byName.get(n); return i && i.render[s] ? i.render[s].inner : null }
  const mv = (B && B.data.moves) || {}
  const later = B ? [...(B.data.grid || []), ...Object.keys(B.data.motion || {}), ...(mv.loops || []), ...(mv.hover || []),
    ...(mv.swaps || []).flat().map(n => String(n).split('@')[0])] : []
  const W = WASHLINE
  // `stage` is now the small shared set every style carries in the first pack (the washing line's costumes, the picker's
  // fallback grid); the stage itself draws `show`.
  const SHARED = W.try
  A.data.stage = SHARED
  const showOf = s => (SHOWCASE[s] || []).filter(n => innerOf(n, s) != null)
  const cardOf = s => W.cards[s] || SHARED[0] // a style added later shows a shared icon until it gets its own
  const sky = s => Object.values(W.sky).filter(([st]) => st === s).map(([, n]) => n)
  const first = s => [...new Set([...SHARED, ...Object.keys(A.data.hero).filter(h => A.data.hero[h].includes(s)), ...(PAGE[s] || []),
    cardOf(s), ...sky(s), ...showOf(s).slice(0, 1)])]
  const alts = s => showOf(s).slice(1)
  const added = [], trimmed = []
  // a style whose renderer is gone leaves both packs (and every hero headline that cycled through it)
  const alive = new Set(ctx.styles.map(s => s.name))
  for (const P of [A, B].filter(Boolean)) {
    for (const k of ['svg', 'roots']) for (const s of Object.keys(P.data[k] || {})) if (!alive.has(s) && fs.existsSync(path.join(ROOT, 'forge', 'styles')) && !fs.existsSync(path.join(ROOT, 'forge', 'styles', `${s}.mjs`))) { delete P.data[k][s]; if (k === 'svg') trimmed.push(`${s} removed`) }
    if (Array.isArray(P.data.styles)) P.data.styles = P.data.styles.filter(s => alive.has(s) || fs.existsSync(path.join(ROOT, 'forge', 'styles', `${s}.mjs`)))
    if (P.data.hero) for (const h of Object.keys(P.data.hero)) P.data.hero[h] = P.data.hero[h].filter(s => alive.has(s) || fs.existsSync(path.join(ROOT, 'forge', 'styles', `${s}.mjs`)))
    if (P.data.lanes) for (const s of Object.keys(P.data.lanes)) if (!fs.existsSync(path.join(ROOT, 'forge', 'styles', `${s}.mjs`))) delete P.data.lanes[s]
  }
  for (const st of ctx.styles) {
    const s = st.name
    const ok = n => innerOf(n, s) != null
    {
      if (SHARED.filter(ok).length < 4) continue // a renderer still being built: leave it out until it draws enough
      // a rich style (gradients, 5-20 KB a drawing) keeps the first pack light: only its polaroid and stage icon are in it,
      // the shared costumes wait in pack 2 (home.js offers a costume once every polaroid has it)
      const richS = richOf(ctx, s)
      const hero = HERO[s] && A.data.hero[HERO[s]] ? [HERO[s]] : []
      if (hero.length && !A.data.hero[hero[0]].includes(s)) A.data.hero[hero[0]].push(s)
      const main = (richS ? [cardOf(s), ...showOf(s).slice(0, 1), ...(PAGE[s] || [])] : first(s)).filter(ok).filter((n, k, a) => a.indexOf(n) === k).sort()
      A.data.svg[s] = Object.fromEntries(main.map(n => [n, innerOf(n, s)]))
      A.data.roots[s] = st.root || { fill: 'currentColor' }
      if (!A.data.styles.includes(s)) A.data.styles.push(s)
      if (B) {
        const rest = [...new Set([...later, ...alts(s), ...(richS ? first(s) : [])])].filter(n => ok(n) && !main.includes(n)).sort()
        B.data.svg[s] = Object.fromEntries(rest.map(n => [n, innerOf(n, s)]))
      }
      added.push(`${s} (${main.length}+${B ? Object.keys(B.data.svg[s]).length : 0})`)
    }
  }
  delete A.data.lanes
  A.data.show = Object.fromEntries(A.data.styles.filter(s => A.data.svg[s]).map(s => [s, showOf(s)]).filter(([, l]) => l.length))
  A.data.washline = {
    cards: Object.fromEntries(A.data.styles.map(s => [s, cardOf(s)]).filter(([s, n]) => A.data.svg[s] && A.data.svg[s][n] != null)),
    sky: Object.fromEntries(Object.entries(W.sky).filter(([, [s, n]]) => A.data.svg[s] && A.data.svg[s][n] != null)),
    try: W.try.filter(n => A.data.styles.every(s => (A.data.svg[s] && A.data.svg[s][n] != null) || (B && B.data.svg[s] && B.data.svg[s][n] != null))),
    tryStyle: W.tryStyle,
  }
  for (const p of files) if (p) {
    const head = p.head.replace('forge/tools/site-home.mjs', 'forge/tools/site-data.mjs').replace('style picker + "Icons that move"', 'style picker, "Icons that move", washing-line costumes')
    const js = `${head}window.${p.g}=${JSON.stringify(p.data)};\n`
    if (fs.readFileSync(p.file, 'utf8') !== js) fs.writeFileSync(p.file, js)
  }
  const kb = p => p ? `${p.file.split(/[\\/]/).pop()} ${(fs.statSync(p.file).size / 1024).toFixed(0)} KB` : ''
  return `home packs: ${[added.length ? 'rebuilt ' + added.join(', ') : '', trimmed.length ? 'trimmed ' + trimmed.join(', ') : '', kb(A), kb(B)].filter(Boolean).join('; ')}`
}

// The style bento (index.html "Every style at a glance", between <!-- STYLE-BENTO:BEGIN/END -->): one card per style,
// grouped like every picker (site.js GROUPS), each linking to its style hub. Light styles are drawn right into the HTML
// (the section reads without JS); rich styles (gradients) and heavy drawings ride in site/js/home-bento.js,
// which home.js loads when the section comes near and drops into the reserved slots. The icons are painted exactly as the
// library paints them (each style's own default colours); one-colour styles wear the style colour like the rest of the
// home page, multi-colour ones keep their palette with an ink outline (data-ink, as home.js inked()).
// Per style: the icons that show it off best, best first. The group's lead card shows 5, every other card 4 (3 on phones).
const BENTO = {
  line: ['search', 'bell', 'calendar', 'settings', 'message-circle'], solid: ['heart', 'star', 'camera', 'bookmark'],
  duo: ['rocket', 'shield-check', 'chart-pie', 'mail'], suite: ['folder', 'calendar', 'chart-bar', 'users'],
  bento: ['layout-grid', 'chart-pie', 'calendar', 'mail', 'credit-card'], dock: ['camera', 'message-circle', 'music-note', 'map'],
  brutal: ['thumbs-up', 'rocket', 'zap', 'megaphone'], bauhaus: ['music-note', 'palette', 'fish', 'compass'],
  clay: ['cake', 'avatar-bear', 'balloon', 'rocket', 'gift'], glass: ['cloud', 'droplet', 'gem', 'heart'],
  liquid: ['droplet', 'heart', 'sun', 'music-note'], chrome: ['headphones', 'star', 'heart', 'crown'],
  soft3d: ['avatar-woman', 'rocket', 'gift', 'shield-check'], luxe: ['crown', 'gem', 'trophy', 'watch'],
  skeuo: ['camera', 'alarm-clock', 'mail', 'book-open'],
  kawaii: ['coffee', 'cat', 'cloud', 'ice-cream', 'star'], plush: ['rabbit', 'teddy-bear', 'cake', 'heart'],
  sticker: ['butterfly', 'pizza', 'smile', 'zap'], gloss: ['heart', 'balloon', 'gamepad', 'ice-cream'],
  pastel: ['donut', 'rainbow', 'cake', 'cloud'], pixel: ['gamepad', 'trophy', 'heart', 'star'], retro: ['tv', 'disc', 'camera', 'sun'],
  sketch: ['lightbulb', 'bird', 'coffee', 'notebook', 'pencil'], engrave: ['landmark', 'anchor', 'compass', 'hourglass'],
  blueprint: ['rocket', 'ruler', 'plane', 'cpu'], anime: ['wand', 'cat', 'flower', 'mountain'],
  gothic: ['key', 'crown', 'hourglass', 'crystal-ball'], coquette: ['butterfly', 'heart', 'ring-box', 'gift'],
  utsav: ['diya', 'kalash', 'marigold', 'lotus', 'sky-lantern'], rangoli: ['lotus', 'rangoli-pattern', 'diya', 'holi-splash'],
  halloween: ['jack-o-lantern', 'ghost', 'witch-hat', 'bat'], christmas: ['christmas-tree', 'snowman', 'gingerbread-man', 'santa-hat'],
  lunar: ['red-lantern', 'red-envelope', 'dragon-head', 'lucky-coin'], valentine: ['heart-pair', 'teddy-bear', 'love-letter', 'rose'],
}
const BENTO_INLINE_MAX = 6 * 1024
const BENTO_ALT = ['heart', 'star', 'rocket', 'gift', 'camera', 'coffee'] // a style the list above does not know yet
// the plain-data object literal after `var <name> = ` in site/js/site.js (INFO: titles and one-line descriptions)
function siteObject(name) {
  let src = ''
  try { src = fs.readFileSync(path.join(ROOT, 'site', 'js', 'site.js'), 'utf8') } catch { return null }
  const at = src.indexOf(`var ${name} = {`)
  if (at < 0) return null
  const open = src.indexOf('{', at)
  let depth = 0, end = -1, quote = null
  for (let k = open; k < src.length; k++) {
    const c = src[k]
    if (quote) { if (c === '\\') k++; else if (c === quote) quote = null; continue }
    if (c === "'" || c === '"' || c === '`') quote = c
    else if (c === '{') depth++
    else if (c === '}' && --depth === 0) { end = k; break }
  }
  if (end < 0) return null
  try { return new Function(`return ${src.slice(open, end + 1)}`)() } catch { return null }
}
// desktop spans on a 6-column grid: the lead card is wide (4 + 2), then rows of three (2 2 2) and pairs (3 3 / 2 4) so
// every row is full and the sizes vary a little without ever leaving a hole
function bentoSpans(n) {
  if (n <= 0) return []
  if (n === 1) return [6]
  const out = [4, 2]
  let r = n - 2, threes = Math.floor(r / 3), twos = 0
  if (r % 3 === 1) { threes -= 1; twos = 2 } else if (r % 3 === 2) twos = 1
  if (threes < 0) { threes = 0; twos = r === 1 ? 0 : twos }
  const rows = []
  for (let k = 0; k < threes; k++) rows.push([2, 2, 2])
  for (let k = 0; k < twos; k++) rows.splice(k * 2 + 1, 0, k % 2 ? [2, 4] : [3, 3])
  if (r === 1) rows.push([6])
  return out.concat(...rows)
}
function homeBento(ctx) {
  const file = path.join(ROOT, 'site', 'index.html')
  if (!fs.existsSync(file)) return 'bento: no index.html'
  const html = fs.readFileSync(file, 'utf8')
  if (!html.includes('<!-- STYLE-BENTO:BEGIN -->')) return 'bento: no markers in index.html'
  const INFO = siteObject('INFO') || {}
  const NEW = (() => { const s = fs.readFileSync(path.join(ROOT, 'site', 'js', 'site.js'), 'utf8'); const m = /var NEW_STYLES = (\[[^\]]*\])/.exec(s); try { return m ? new Function(`return ${m[1]}`)() : [] } catch { return [] } })()
  const byName = new Map(ctx.icons.map(i => [i.name, i]))
  const innerOf = (n, s) => { const i = byName.get(n); return i && i.render[s] ? i.render[s].inner : null }
  const meta = Object.fromEntries(ctx.styles.map(s => [s.name, s]))
  const attrEsc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
  // multi-colour = gradients, or a colour variable whose default is a real colour (not currentColor or white), as home.js multiColour()
  const isMulti = m => /<(?:linear|radial)Gradient/.test(m) || [...m.matchAll(/var\(--(?:with|eg)-(?!duo\b|accent\b)[\w-]+\s*,\s*([^()]+?)\s*\)/g)].some(x => !/^(?:currentColor|#fff(?:fff)?)$/i.test(x[1]))
  let uid = 0
  const svgOf = (n, s) => {
    let inner = innerOf(n, s)
    if (inner == null) return null
    if (inner.includes('wg-')) { const sfx = '_hb' + (++uid).toString(36); inner = inner.replace(/(\bid="|url\(#|href="#)(wg-[\w-]*?)(?=["')])/g, (x, a, id) => a + id + sfx) }
    const root = meta[s].root || { fill: 'currentColor' }
    const ink = isMulti(inner) ? ' data-ink=""' : ''
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"' + Object.entries(root).filter(([, v]) => v != null && v !== false).map(([k, v]) => ` ${k}="${attrEsc(v)}"`).join('') + ink + ' aria-hidden="true" focusable="false">' + inner + '</svg>'
  }
  const lazy = {}, lazyG = {}
  let cards = 0, inlineBytes = 0
  const groups = STYLE_GROUPS.map(g => ({ ...g, styles: g.styles.filter(s => meta[s]) })).filter(g => g.styles.length)
  const ARR = '<svg class="sb-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12 H19 M13 6 L19 12 L13 18"/></svg>'
  const body = groups.map(g => {
    const spans = bentoSpans(g.styles.length)
    const oddTail = (g.styles.length - 1) % 2 === 1 // phones: the lead is full width, the rest pair up; an odd one out goes full width too
    const items = g.styles.map((s, k) => {
      const want = k === 0 ? 5 : 4
      const list = [...new Set([...(BENTO[s] || []), ...BENTO_ALT])].filter(n => innerOf(n, s) != null).slice(0, want)
      // light drawings go inline; a rich style, or one whose card would add more than ~6 KB to the page, loads lazily
      const svgs = list.map(n => svgOf(n, s))
      const heavy = richOf(ctx, s) || svgs.reduce((t, x) => t + x.length, 0) > BENTO_INLINE_MAX
      const ics = list.map((n, j) => {
        if (heavy) { lazy[`${s}:${n}`] = svgs[j]; (lazyG[g.id] ||= {})[`${s}:${n}`] = svgs[j]; return `<span class="sb-ic is-lazy" data-sb-ic="${s}:${n}"></span>` }
        inlineBytes += svgs[j].length
        return `<span class="sb-ic">${svgs[j]}</span>`
      }).join('')
      const info = INFO[s] || {}
      const title = info.title || meta[s].title || s
      const desc = info.description || meta[s].description || ''
      const cls = ['sb-cell', `sb-w${spans[k]}`, k === 0 ? 'sb-lead' : '', k > 0 && oddTail && k === g.styles.length - 1 ? 'sb-mfull' : ''].filter(Boolean).join(' ')
      cards++
      return `<li class="${cls}"><a class="sb-card s-${s}" href="styles/${s}.html"><span class="sb-art" aria-hidden="true">${ics}</span>` +
        `<span class="sb-txt"><span class="sb-name">${attrEsc(title)}${NEW.includes(s) ? '<span class="sb-new" title="New style"><span class="visually-hidden">, new</span></span>' : ''}</span>` +
        `<span class="sb-desc">${attrEsc(desc)}</span></span>${ARR}</a></li>`
    }).join('\n            ')
    return `        <section class="sb-group" aria-labelledby="sb-g-${g.id}"${lazyG[g.id] ? ` data-sb-src="js/home-bento-${g.id}.js"` : ''}>
          <div class="sb-ghead"><h3 class="sb-gtitle" id="sb-g-${g.id}">${attrEsc(g.title)}</h3><p class="sb-gblurb">${attrEsc(g.blurb || '')}</p></div>
          <ul class="sb-grid" role="list">
            ${items}
          </ul>
        </section>`
  }).join('\n')
  const block = '<!-- STYLE-BENTO:BEGIN -->\n' + body + '\n        <!-- STYLE-BENTO:END -->'
  const next = html.replace(/<!-- STYLE-BENTO:BEGIN -->[\s\S]*?<!-- STYLE-BENTO:END -->/, () => block)
  if (next !== html) fs.writeFileSync(file, next)
  const packFile = path.join(ROOT, 'site', 'js', 'home-bento.js')
  const js = `/* GENERATED by forge/tools/site-data.mjs (homeBento): the rich styles' drawings for the home page's style bento. Do not edit. */\nwindow.WITH_HOME_BENTO=${JSON.stringify(lazy)};\n`
  if (!fs.existsSync(packFile) || fs.readFileSync(packFile, 'utf8') !== js) fs.writeFileSync(packFile, js)
  // one small file per group too (js/home-bento-<group>.js, merged into WITH_HOME_BENTO): home.js fetches a group's
  // drawings as that group comes near, so the 3D group's ~45 KB never rides with the first one. (home-bento.js, every group
  // in one, stays for pages cached before the split.)
  const keepG = new Set()
  for (const [id, m] of Object.entries(lazyG)) {
    const gf = path.join(ROOT, 'site', 'js', `home-bento-${id}.js`); keepG.add(path.basename(gf))
    const gjs = `/* GENERATED by forge/tools/site-data.mjs (homeBento): the ${id} group's drawings for the home page's style bento. Do not edit. */\n(window.WITH_HOME_BENTO=window.WITH_HOME_BENTO||{});Object.assign(window.WITH_HOME_BENTO,${JSON.stringify(m)});\n`
    if (!fs.existsSync(gf) || fs.readFileSync(gf, 'utf8') !== gjs) fs.writeFileSync(gf, gjs)
  }
  for (const x of fs.readdirSync(path.join(ROOT, 'site', 'js'))) if (/^home-bento-[a-z0-9-]+\.js$/.test(x) && !keepG.has(x)) fs.rmSync(path.join(ROOT, 'site', 'js', x))
  return `bento: ${cards} cards in ${groups.length} groups, ${(inlineBytes / 1024).toFixed(0)} KB inline, ${Object.keys(lazy).length} lazy drawings in home-bento.js (${(js.length / 1024).toFixed(0)} KB)`
}

// `--lib` rebuilds only data/by-icon/* and icons.html's style samples from the style files in site/data.
// `node forge/tools/site-data.mjs --packs` rebuilds only the home packs, from the style files the last build wrote to
// site/data (no rendering, site/data untouched): for when a home section changes what it carries (and the style bento;
// `--bento` rebuilds only that).
function builtCtx() {
  const json = (file, marker) => { const t = fs.readFileSync(path.join(outDir, file), 'utf8'); return JSON.parse(t.slice(t.indexOf(marker) + marker.length).trim().replace(/;$/, '')) }
  const meta = json('meta.js', 'window.WITH=')
  const svg = Object.fromEntries(meta.styles.filter(s => fs.existsSync(path.join(outDir, `style-${s.name}.js`))).map(s => [s.name, json(`style-${s.name}.js`, ']=')]))
  return {
    styles: meta.styles.filter(s => svg[s.name]),
    icons: meta.icons.map(({ name }) => ({ name, render: Object.fromEntries(Object.keys(svg).filter(s => svg[s][name] != null).map(s => [s, { inner: svg[s][name] }])) })),
  }
}

// The hand-written pages (index.html, icons.html, 404.html) carry their counts as static text, so they read right
// without JS: every <span data-count="…"> (site.js paints the same values live), the numbers in titles, meta tags
// and JSON-LD, the style list in the JSON-LD descriptions, the washing line's style links and the "What's the
// difference between the styles?" answer (from site.js GROUPS). Idempotent: the old values are read from the page.
const NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
const numWord = n => n <= 20 ? NUMW[n] : n < 100 ? ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'][Math.floor(n / 10) - 2] + (n % 10 ? '-' + NUMW[n % 10] : '') : String(n)
const SHORT = { line: 'clean outlines', solid: 'bold filled', duo: 'outline with a soft tint and an accent colour', suite: 'enterprise colour icons',
  bento: 'icons in tinted tiles', dock: 'app-icon tiles', brutal: 'bold neo-brutalism', bauhaus: 'primary colours and pure geometry',
  clay: 'soft 3D clay', glass: 'soft frosted glass', liquid: 'clear refractive glass', chrome: 'liquid metal', soft3d: 'soft studio-lit 3D', luxe: 'premium layered 3D', skeuo: 'real materials and depth',
  kawaii: 'cute, with a tiny face', plush: 'soft felt toys', sticker: 'die-cut Y2K sticker', gloss: 'puffy and shiny', pastel: 'soft candy pastels', pixel: 'pixel art', retro: '70s sunset stripes',
  sketch: 'hand-drawn marker', engrave: 'banknote-style lines', blueprint: 'technical drawing', anime: 'cel-shaded anime art', gothic: 'cathedral stone and stained glass', coquette: 'bows, pearls and blush pink',
  utsav: 'Indian festive craft', rangoli: 'Diwali, Durga Puja and Holi', halloween: 'spooky-cute', christmas: 'cosy, with snow', lunar: 'lucky red and gold', valentine: 'cute hearts and blush' }
const GROUP_FOR = { essentials: 'for apps, websites and documents', product: 'for SaaS sites, launches and bold brand graphics', depth: 'for hero sections and decks',
  playful: 'for kids, social posts and games', artistic: 'for print and themed designs', holidays: 'for festivals and seasonal campaigns' }
function pageCounts(ctx) {
  const N = ctx.icons.length, S = ctx.styles.length, SV = (N * S).toLocaleString('en-US')
  // the headline total, "over 25,000": every icon in every style plus the live icons (forge/dynamic/<name>.mjs, each
  // rendered by every style), rounded DOWN to a whole 5,000 so it stays true. site.js counts().over paints the same number.
  const LIVE = (() => { try { return fs.readdirSync(path.join(ROOT, 'forge', 'dynamic')).filter(f => f.endsWith('.mjs') && !f.startsWith('_')).length } catch { return 0 } })()
  const OVER = (Math.floor((N + LIVE) * S / 5000) * 5000).toLocaleString('en-US')
  const T = Object.fromEntries(ctx.styles.map(s => [s.name, s.title || s.name]))
  const groups = STYLE_GROUPS.map(g => ({ ...g, styles: g.styles.filter(s => T[s]) })).filter(g => g.styles.length)
  const and = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]
  const attrEsc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
  const say = (html) => `Every icon is drawn once and comes in ${html ? `<span data-count="styles">${S}</span>` : S} looks, in ${numWord(groups.length)} groups. ` +
    groups.map(g => `${html ? `<b>${attrEsc(g.title)}</b>` : g.title}, ${GROUP_FOR[g.id] || 'for ' + (g.blurb || '').toLowerCase()}: ${and(g.styles.map(s => `${T[s]} (${SHORT[s] || ''})`.replace(' ()', '')))}.`).join(' ')
  const done = []
  for (const f of ['index.html', 'icons.html', '404.html']) {
    const file = path.join(ROOT, 'site', f)
    if (!fs.existsSync(file)) continue
    let h = fs.readFileSync(file, 'utf8')
    const before = h
    const oldN = (/data-count="icons">([\d,]+)</.exec(h) || [])[1], oldS = (/data-count="styles">(\d+)</.exec(h) || [])[1]
    const oldSV = (/data-count="svgs">([\d,]+)</.exec(h) || [])[1]
    const oldW = oldS ? numWord(+oldS) : null
    h = h.replace(/(data-count="icons">)[^<]*(<)/g, `$1${N}$2`).replace(/(data-count="styles">)[^<]*(<)/g, `$1${S}$2`)
      .replace(/(data-count="svgs">)[^<]*(<)/g, `$1${SV}$2`).replace(/(data-count="over">)[^<]*(<)/g, `$1${OVER}$2`)
      .replace(/\b([Oo]ver )[\d,]{5,}(?=( free)? (SVG|icons|in all)\b)/g, `$1${OVER}`).replace(/(data-count="styles-word">)[^<]*(<)/g, `$1${numWord(S)}$2`)
      .replace(/(data-count="Styles-word">)[^<]*(<)/g, (_, a, b) => a + numWord(S).charAt(0).toUpperCase() + numWord(S).slice(1) + b)
      .replace(/(data-icon-total>)[^<]*(<)/g, `$1${N}$2`).replace(/(data-style-total>)[^<]*(<)/g, `$1${S}$2`)
    if (oldSV && oldSV !== SV) h = h.split(oldSV).join(SV)
    if (oldN && +oldN !== N) h = h.replace(new RegExp(`(?<![\\d,])\\b${oldN}(?=( free)? (icons|icon|SVG))`, 'g'), String(N)).replace(new RegExp(`(Search |all )${oldN}\\b`, 'g'), `$1${N}`)
    if (oldS && +oldS !== S) h = h.replace(new RegExp(`\\b${oldS}(?= (styles|looks|ways))`, 'g'), String(S))
    if (oldW && +oldS !== S) h = h.replace(new RegExp(`\\b${oldW}(?= styles)`, 'g'), numWord(S))
    // and whatever an earlier edit left behind: "600 free icons in 31 styles", "all 31 styles", "thirty-one styles"
    // ((?<![\d,]): never the tail of a bigger number; "24,956 free icons" once became "24,734")
    h = h.replace(/(?<![\d,])\b\d{3,4}(?=( free)? (icons|icon pages|SVG and PNG icons)\b)/g, String(N)).replace(/(Search |all )\d{3,4}\b(?! ?px)/g, `$1${N}`)
      .replace(/\b\d{2}(?= (styles|looks)\b)/g, String(S)).replace(/\b(?:twenty|thirty|forty)(?:-[a-z]+)?(?= styles\b)/g, numWord(S))
    // the style list in JSON-LD and meta descriptions: "(line, solid, …)"
    h = h.replace(/\(line, solid, [a-z, ]+\)/g, `(${ctx.styles.map(s => s.name).join(', ')})`)
    // the washing line's crawlable style links
    h = h.replace(/(<ul class="wl-list" role="list" aria-labelledby="wl-title">)[\s\S]*?(\n\s*<\/ul>)/, (_, a, b) =>
      a + groups.map(g => '\n            ' + g.styles.map(s => `<li><a href="styles/${s}.html">${attrEsc(T[s])}</a></li>`).join('')).join('') + b)
    // "What's the difference between the styles?" (JSON-LD answer and the visible one)
    h = h.replace(/("text": ")Every icon is drawn once and comes in \d+ looks, in [a-z-]+ groups\. .*?(Not sure\?)/, (_, a, b) => a + say(false).replace(/"/g, '\\"') + ' ' + b)
    h = h.replace(/(<summary>What's the difference between the styles\?<\/summary><p>)Every icon is drawn once[\s\S]*?(Not sure\?)/, (_, a, b) => a + say(true).replace(/&(?!amp;)/g, '&amp;') + ' ' + b)
    h = h.replace(/(styles in )[a-z-]+( groups)/g, `$1${numWord(groups.length)}$2`)
    if (h !== before) { fs.writeFileSync(file, h); done.push(f) }
  }
  return `page counts: ${N} icons x ${S} styles = ${SV}, + ${LIVE} live icons: over ${OVER}${done.length ? ` (updated ${done.join(', ')})` : ''}`
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  if (process.argv.includes('--packs')) { const c = builtCtx(); console.log(homePacks(c) + '\n' + homeBento(c)) }
  else if (process.argv.includes('--bento')) console.log(homeBento(builtCtx()))
  else if (process.argv.includes('--counts')) console.log(pageCounts(builtCtx()))
  else if (process.argv.includes('--lib')) { const c = builtCtx(); console.log(byIcon(c) + '\n' + libSamples(c)) }
  else if (process.argv.includes('--chunks')) {
    // the style chunks (and meta.js's note of them) from the style files the last build wrote; nothing renders
    const t = fs.readFileSync(path.join(outDir, 'meta.js'), 'utf8'), meta = JSON.parse(t.slice(t.indexOf('window.WITH=') + 12).trim().replace(/;$/, ''))
    const c = builtCtx(), maps = {}
    for (const s of c.styles) { maps[s.name] = {}; for (const i of c.icons) if (i.render[s.name]) maps[s.name][i.name] = i.render[s.name].inner }
    console.log(styleChunks(meta, maps))
    const js = `window.WITH=${JSON.stringify(meta)};\n`
    if (t !== js) fs.writeFileSync(path.join(outDir, 'meta.js'), js)
  }
  else console.log(build(await renderAll()))
}
