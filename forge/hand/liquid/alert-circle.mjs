// forge/hand/liquid/alert-circle.mjs: a clear glass disc with an upright exclamation bar and a separate round dot
// in accent glass (wm-a), like the line design. The generated mark was a pair of grooves ringed by pale inlays that
// merged into a figure-8; solid accent shapes with a small specular glint read at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
// the core maps skeleton coordinates onto the glass with this transform; overlays use it too
const tx = x => r2((x - 12) * 0.88 + 11.8)
const ty = y => r2((y - 12) * 0.88 + 11.5)
const S = 0.88
const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const rings = d => parsePath(d).map(s => s.pts)
function tune(nodes, name, { k, a, ink }) {
  const defs = nodes[0] && nodes[0][0] === 'defs' ? nodes[0][2] : []
  const set = (n, ops) => {
    const g = defs.find(x => x[1].id === `wg-liquid-${name}-${n}`)
    if (g) g[2].forEach((s, i) => { if (ops[i] !== undefined) s[1]['stop-opacity'] = ops[i] })
  }
  set(0, k); set(1, a)
  for (const n of nodes) if (n[1] && n[1]['stroke-opacity'] === 0.3) n[1]['stroke-opacity'] = ink
  return nodes
}
const ink = { fill: 'var(--with-liquid-c3, #1C3F9E)', class: 'wm-a' }
const dot = (cx, cy, rx, ry = rx) => ['ellipse', { cx: tx(cx), cy: ty(cy), rx: r2(rx * S), ry: r2(ry * S), ...ink }]
const glint = (cx, cy, rx, ry = rx) => ['ellipse', { cx: tx(cx), cy: ty(cy), rx: r2(rx * S), ry: r2(ry * S), fill: 'var(--with-liquid-shine, #FFFFFF)', 'fill-opacity': 0.85, class: 'wm-shine' }]

const DISC = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'alert-circle'
  const nodes = build({ name, paths: [], lines: lines(DISC, 'K'), fills: [{ set: rings(DISC) }], cutouts: [] })
  if (!nodes) return null
  const acc = { stroke: 'var(--with-liquid-accent, #FF5F8F)', 'stroke-linecap': 'round', class: 'wm-a' }
  return [...tune(nodes, name, { k: [0.24, 0.48, 0.76], ink: 0.45 }),
    ['path', { d: `M${tx(12)} ${ty(7.9)}V${ty(12.1)}`, fill: 'none', 'stroke-width': r2(2.3 * S), ...acc }],
    ['circle', { cx: tx(12), cy: ty(16.25), r: r2(1.25 * S), fill: 'var(--with-liquid-accent, #FF5F8F)', class: 'wm-a' }],
    ['path', { d: `M${tx(11.45)} ${ty(8.2)}V${ty(10.4)}`, fill: 'none', stroke: 'var(--with-liquid-shine, #FFFFFF)', 'stroke-opacity': 0.8, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
