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
    styles: ctx.styles.map(s => ({ name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root, palette: !!s.palette, vars: s.vars || {} })),
    icons,
  }
  fs.writeFileSync(path.join(outDir, 'meta.js'), `window.WITH=${JSON.stringify(meta)};\n`)
  const report = []
  for (const s of ctx.styles) {
    const map = {}
    let fails = 0
    for (const i of ctx.icons) { const r = i.render[s.name]; if (r) map[i.name] = r.inner; else fails++ }
    const js = `(window.WITH_SVG=window.WITH_SVG||{})[${JSON.stringify(s.name)}]=${JSON.stringify(map)};\n`
    const f = path.join(outDir, `style-${s.name}.js`)
    if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== js) fs.writeFileSync(f, js)
    report.push(`${s.name}: ${Object.keys(map).length} icons, ${(js.length / 1024).toFixed(0)} KB${fails ? `, ${fails} FAILED` : ''}`)
  }
  report.push(byIcon(ctx), libSamples(ctx))
  report.push(homePacks(ctx))
  return `site data: ${icons.length} icons x ${ctx.styles.length} styles\n  ` + report.join('\n  ')
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
// Entries of the original twelve styles were hand-tuned (e.g. pathLength for draw-on) and stay byte-identical; the
// FOLLOW styles, and any style the packs do not have yet, are rebuilt from this build's renders on every run.
const FOLLOW = ['luxe', 'bauhaus', 'skeuo', 'anime', 'gothic', 'pastel', 'coquette', 'plush']
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
    anime: 'cat', gothic: 'heart', pastel: 'ice-cream', coquette: 'butterfly', plush: 'rabbit' },
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
  // fallback grid); the stage itself draws `show`. Whatever the old shared set had beyond it is dropped below.
  const oldShared = A.data.stage || []
  const SHARED = W.try
  A.data.stage = SHARED
  const showOf = s => (SHOWCASE[s] || []).filter(n => innerOf(n, s) != null)
  const cardOf = s => W.cards[s] || SHARED[0] // a style added later shows a shared icon until it gets its own
  const sky = s => Object.values(W.sky).filter(([st]) => st === s).map(([, n]) => n)
  const first = s => [...new Set([...SHARED, ...Object.keys(A.data.hero).filter(h => A.data.hero[h].includes(s)), ...(PAGE[s] || []),
    cardOf(s), ...sky(s), ...showOf(s).slice(0, 1)])]
  const alts = s => showOf(s).slice(1)
  const added = [], trimmed = []
  for (const st of ctx.styles) {
    const s = st.name
    const ok = n => innerOf(n, s) != null
    if (!A.data.svg[s] || FOLLOW.includes(s)) {
      if (SHARED.filter(ok).length < 4) continue // a renderer still being built: leave it out until it draws enough
      const hero = HERO[s] && A.data.hero[HERO[s]] ? [HERO[s]] : []
      if (hero.length && !A.data.hero[hero[0]].includes(s)) A.data.hero[hero[0]].push(s)
      const main = first(s).filter(ok).sort()
      A.data.svg[s] = Object.fromEntries(main.map(n => [n, innerOf(n, s)]))
      A.data.roots[s] = st.root || { fill: 'currentColor' }
      if (!A.data.styles.includes(s)) A.data.styles.push(s)
      if (B) {
        const rest = [...new Set([...later, ...alts(s)])].filter(n => ok(n) && !main.includes(n)).sort()
        B.data.svg[s] = Object.fromEntries(rest.map(n => [n, innerOf(n, s)]))
      }
      added.push(`${s} (${main.length}+${B ? Object.keys(B.data.svg[s]).length : 0})`)
      continue
    }
    // hand-tuned styles: drop what only the old style lanes drew, keeping whatever pack 2 relies on pack 1 for
    const a = A.data.svg[s], b = (B && B.data.svg[s]) || {}
    const keep = new Set([...first(s), ...later.filter(n => !(n in b))])
    const before = Object.keys(a).length
    for (const n of [...((A.data.lanes && A.data.lanes[s]) || []), ...oldShared]) if (!keep.has(n)) delete a[n]
    for (const n of first(s)) if (!(n in a) && ok(n)) a[n] = innerOf(n, s)
    if (B) { B.data.svg[s] = B.data.svg[s] || {}; for (const n of alts(s)) if (!(n in a) && !(n in B.data.svg[s])) B.data.svg[s][n] = innerOf(n, s) }
    // pack 2: drop what nothing reads any more (the old costumes); keep everything the picker and "Icons that move" use
    if (B && B.data.svg[s]) { const need = new Set([...later, ...alts(s)]); for (const n of Object.keys(B.data.svg[s])) if (!need.has(n)) { delete B.data.svg[s][n]; trimmed.push(`${s} -${n} (pack 2)`) } }
    if (Object.keys(a).length !== before) trimmed.push(`${s} ${before}→${Object.keys(a).length}`)
  }
  delete A.data.lanes
  A.data.show = Object.fromEntries(A.data.styles.filter(s => A.data.svg[s]).map(s => [s, showOf(s)]).filter(([, l]) => l.length))
  A.data.washline = {
    cards: Object.fromEntries(A.data.styles.map(s => [s, cardOf(s)]).filter(([s, n]) => A.data.svg[s] && A.data.svg[s][n] != null)),
    sky: Object.fromEntries(Object.entries(W.sky).filter(([, [s, n]]) => A.data.svg[s] && A.data.svg[s][n] != null)),
    try: W.try.filter(n => A.data.styles.every(s => A.data.svg[s] && A.data.svg[s][n] != null)),
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

// `--lib` rebuilds only data/by-icon/* and icons.html's style samples from the style files in site/data.
// `node forge/tools/site-data.mjs --packs` rebuilds only the home packs, from the style files the last build wrote to
// site/data (no rendering, site/data untouched): for when a home section changes what it carries.
function builtCtx() {
  const json = (file, marker) => { const t = fs.readFileSync(path.join(outDir, file), 'utf8'); return JSON.parse(t.slice(t.indexOf(marker) + marker.length).trim().replace(/;$/, '')) }
  const meta = json('meta.js', 'window.WITH=')
  const svg = Object.fromEntries(meta.styles.filter(s => fs.existsSync(path.join(outDir, `style-${s.name}.js`))).map(s => [s.name, json(`style-${s.name}.js`, ']=')]))
  return {
    styles: meta.styles.filter(s => svg[s.name]),
    icons: meta.icons.map(({ name }) => ({ name, render: Object.fromEntries(Object.keys(svg).filter(s => svg[s][name] != null).map(s => [s, { inner: svg[s][name] }])) })),
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  if (process.argv.includes('--packs')) console.log(homePacks(builtCtx()))
  else if (process.argv.includes('--lib')) { const c = builtCtx(); console.log(byIcon(c) + '\n' + libSamples(c)) }
  else console.log(build(await renderAll()))
}
