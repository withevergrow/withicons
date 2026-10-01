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
      if (mod.default && typeof mod.default.render === 'function') out[name] = mod.default
      else console.warn(`[load] styles/${f}: no default export with render() — skipped`)
    } catch (e) { console.warn(`[load] styles/${f} failed to import — skipped: ${String(e.message).split(/\r?\n/)[0]}`) }
  }
  return out
}

// IconNode -> SVG markup. nodes: [[tag, attrs], ...]
const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
export const attrs = o => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false)
  .map(([k, v]) => ` ${k}="${esc(v)}"`).join('')
export const nodesToMarkup = nodes => nodes.map(([tag, a]) => `<${tag}${attrs(a)}/>`).join('')
export function toSvg(style, nodes, extra = {}) {
  const root = { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', ...style.root, ...extra }
  return `<svg${attrs(root)}>${nodesToMarkup(nodes)}</svg>`
}
export function renderIcon(style, icon) {
  const nodes = style.render(icon)
  if (!Array.isArray(nodes)) throw new Error(`style ${style.name} returned non-array for ${icon.name}`)
  return nodes.filter(n => n && n[1] && (n[0] !== 'path' || (n[1].d && n[1].d.length > 1)))
}
