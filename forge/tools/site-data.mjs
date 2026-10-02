#!/usr/bin/env node
// Emits site/data/*.js for the zero-build website. Loaded with plain <script> tags
// (not fetch) so the site also works when opened straight from disk.
//   site/data/meta.js           window.WITH = { version, total, categories, styles, icons }
//   site/data/style-<name>.js   window.WITH_SVG[<name>] = { <icon>: '<inner svg markup>' }
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
  report.push(homePacks(ctx))
  return `site data: ${icons.length} icons x ${ctx.styles.length} styles\n  ` + report.join('\n  ')
}

// Home page packs (site/js/home-icons.js = window.WITH_HOME, site/js/home-icons-more.js = window.WITH_HOME_MORE) carry
// only what the home page animates, per style. Styles already in a pack are left byte-identical (their entries were
// hand-tuned, e.g. pathLength for draw-on); a style the packs do not have yet is ADDED from this build's renders:
// its showcase lane (LANES, falling back to the hero/stage icons), the stage, the hero icons it is listed under, and in
// the second pack every other icon the picker grid and "Icons that move" use.
const LANES = {
  luxe: ['crown', 'gem', 'trophy', 'gift', 'key', 'wallet', 'credit-card', 'rocket', 'heart', 'star', 'bell', 'shield-check'],
  bauhaus: ['home', 'clock', 'music-note', 'camera', 'sun', 'compass', 'palette', 'globe', 'book-open', 'lightbulb', 'chart-pie', 'star'],
  skeuo: ['camera', 'calendar', 'clock', 'mail', 'phone', 'settings', 'folder', 'music-note', 'lock', 'headphones', 'notebook', 'microphone'],
}
// the hero headline icons a new style joins (index.html data-ht-styles must list it too)
const HERO = { luxe: 'globe', bauhaus: 'chart-bar', skeuo: 'smartphone' }
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
  const added = []
  for (const st of ctx.styles) {
    const s = st.name
    if (A.data.svg[s] && !LANES[s]) continue // the original twelve stay as they are; LANES styles follow their renderer
    const ok = n => innerOf(n, s) != null
    const lane = (LANES[s] || A.data.stage.concat(A.data.grid)).filter(ok).filter((n, i, a) => a.indexOf(n) === i).slice(0, 12)
    if (lane.length < 6) continue // a renderer still being built: leave it out until it draws enough
    const hero = HERO[s] && A.data.hero[HERO[s]] ? [HERO[s]] : []
    const main = [...new Set([...lane, ...A.data.stage, ...hero])].filter(ok).sort()
    A.data.svg[s] = Object.fromEntries(main.map(n => [n, innerOf(n, s)]))
    A.data.roots[s] = st.root || { fill: 'currentColor' }
    A.data.lanes[s] = lane
    if (hero.length && !A.data.hero[hero[0]].includes(s)) A.data.hero[hero[0]].push(s)
    if (!A.data.styles.includes(s)) A.data.styles.push(s)
    if (B) {
      const mv = B.data.moves || {}
      const want = [...(B.data.grid || []), ...Object.keys(B.data.motion || {}), ...(mv.loops || []), ...(mv.hover || []),
        ...(mv.swaps || []).flat().map(n => String(n).split('@')[0])]
      const rest = [...new Set(want)].filter(n => ok(n) && !main.includes(n)).sort()
      B.data.svg[s] = Object.fromEntries(rest.map(n => [n, innerOf(n, s)]))
    }
    added.push(`${s} (${main.length}+${B ? Object.keys(B.data.svg[s]).length : 0} icons)`)
  }
  for (const p of files) if (p) {
    const js = `${p.head}window.${p.g}=${JSON.stringify(p.data)};\n`
    if (fs.readFileSync(p.file, 'utf8') !== js) fs.writeFileSync(p.file, js)
  }
  return `home packs: ${added.length ? 'added ' + added.join(', ') : 'up to date'}`
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  console.log(build(await renderAll()))
}
