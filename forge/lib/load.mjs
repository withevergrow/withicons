// Loads icon skeletons and style renderers. Everything downstream goes through here.
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { parsePath } from '../kernel/geom.mjs'
import { setOf, unionSets } from '../kernel/bool.mjs'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
export const ICON_DIR = path.join(ROOT, 'forge', 'icons')
export const STYLE_DIR = path.join(ROOT, 'forge', 'styles')
export const MANIFEST = path.join(ROOT, 'forge', 'manifest.json')
export const HAND_DIR = path.join(ROOT, 'forge', 'hand')

export const readManifest = () => JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))

// Parse a skeleton JSON into the shape every renderer receives.
export function prepare(raw) {
  const paths = (raw.paths || []).map((p, i) => ({
    id: p.id || `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d),
  }))
  const fills = (raw.fills || []).map(d => {
    const subs = parsePath(d)
    // every subpath of a fill is a closed ring; nesting makes holes (even-odd)
    return { d, subs, set: setOf(subs.map(s => s.pts)) }
  })
  const cutouts = (raw.cutouts || []).map(d => ({ d, subs: parsePath(d) }))
  return {
    ...raw, paths, fills, cutouts,
    // convenience: every centreline as {pts, closed, plate, pathId}
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: fills.length ? unionSets(fills.map(f => f.set)) : [],
  }
}

export function loadIcon(name) {
  const f = path.join(ICON_DIR, `${name}.json`)
  return prepare(JSON.parse(fs.readFileSync(f, 'utf8')))
}
export function listIcons() {
  return fs.readdirSync(ICON_DIR).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).sort()
}
export async function loadStyles(only) {
  const out = {}
  const files = fs.existsSync(STYLE_DIR) ? fs.readdirSync(STYLE_DIR).filter(f => f.endsWith('.mjs') && !f.startsWith('_')) : []
  for (const f of files) {
    const name = f.slice(0, -4)
    if (only && !only.includes(name)) continue
    // a style under construction must never break everyone else's tooling
    try {
      const mod = await import(pathToFileURL(path.join(STYLE_DIR, f)).href)
      if (mod.default && typeof mod.default.render === 'function') out[name] = withHand(mod.default, await loadHand(name))
      else console.warn(`[load] styles/${f}: no default export with render() — skipped`)
    } catch (e) { console.warn(`[load] styles/${f} failed to import — skipped: ${String(e.message).split(/\r?\n/)[0]}`) }
  }
  return out
}

// Hand-drawn overrides (forge/HAND.md): forge/hand/<style>/<icon>.mjs default-exports render(icon) -> IconNode[] and
// replaces the style's renderer for that one static icon (live icons carry params and always use the style).
// A file that fails to import is skipped; an override that throws or returns nothing falls back to the style.
export async function loadHand(style) {
  const dir = path.join(HAND_DIR, style)
  if (!fs.existsSync(dir)) return null
  const hand = Object.create(null)
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.mjs') && !f.startsWith('_')).sort()) {
    try {
      const mod = await import(pathToFileURL(path.join(dir, f)).href)
      const fn = typeof mod.default === 'function' ? mod.default : mod.default && mod.default.render
      if (typeof fn === 'function') hand[f.slice(0, -4)] = fn
      else console.warn(`[load] hand/${style}/${f}: no default render function — skipped`)
    } catch (e) { console.warn(`[load] hand/${style}/${f} failed to import — skipped: ${String(e.message).split(/\r?\n/)[0]}`) }
  }
  return Object.keys(hand).length ? hand : null
}
function withHand(style, hand) {
  if (!hand) return style
  return {
    ...style, hand: Object.keys(hand),
    render(icon) {
      const fn = icon && !icon.params ? hand[icon.name] : null
      if (fn) {
        try { const nodes = fn(icon); if (Array.isArray(nodes) && nodes.length) return nodes }
        catch (e) { if (typeof process !== 'undefined' && process.env && process.env.HAND_DEBUG) console.error(`[hand] ${style.name}/${icon.name} threw:`, e) }
      }
      return style.render(icon)
    },
  }
}

// IconNode -> SVG markup. nodes: [[tag, attrs], ...]
const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
export const attrs = o => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false)
  .map(([k, v]) => ` ${k}="${esc(v)}"`).join('')
// A node may carry children as a third element (rich styles only: ['defs', {}, [['linearGradient', {id}, [['stop', {}]]]]],
// see forge/CONTRACT.md "Rich styles"); flat [tag, attrs] nodes are unchanged.
export const nodesToMarkup = nodes => nodes.map(([tag, a, kids]) => Array.isArray(kids) && kids.length ? `<${tag}${attrs(a)}>${nodesToMarkup(kids)}</${tag}>` : `<${tag}${attrs(a)}/>`).join('')
export function toSvg(style, nodes, extra = {}) {
  const root = { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', ...style.root, ...extra }
  return `<svg${attrs(root)}>${nodesToMarkup(nodes)}</svg>`
}
export function renderIcon(style, icon) {
  const nodes = style.render(icon)
  if (!Array.isArray(nodes)) throw new Error(`style ${style.name} returned non-array for ${icon.name}`)
  return nodes.filter(n => n && n[1] && (n[0] !== 'path' || (n[1].d && n[1].d.length > 1)))
}

// Resolve CSS custom-property paints to their fallbacks for rasterizers that don't do CSS (resvg):
// var(--with-x, #fff) -> #fff, nested fallbacks unwrap, var(--x) with no fallback -> currentColor.
export function resolveVars(s) {
  let prev
  do { prev = s; s = s.replace(/var\(\s*--[\w-]+\s*,\s*([^()]*?)\s*\)/g, '$1').replace(/var\(\s*--[\w-]+\s*\)/g, 'currentColor') } while (s !== prev)
  return s
}
