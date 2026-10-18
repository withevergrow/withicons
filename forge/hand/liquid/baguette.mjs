// forge/hand/liquid/baguette.mjs: the same plump diagonal loaf as line, in one clear glass piece, with its three
// short score slashes laid in deep glass (wm-a) with a pale lip. The generated one was a thin pill with ringed loops.
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

const LOAF = 'M3.51 20.49C2.15 19.12 2.63 16.42 4.58 14.47L14.47 4.58C16.42 2.63 19.12 2.15 20.49 3.51C21.85 4.88 21.37 7.58 19.42 9.53L9.53 19.42C7.58 21.37 4.88 21.85 3.51 20.49Z'
const SLASH = [[[8.47, 17.23], [7.75, 14.55]], [[12.36, 13.34], [11.64, 10.66]], [[16.25, 9.45], [15.53, 6.77]]]
export default function render(icon) {
  const name = (icon && icon.name) || 'baguette'
  const nodes = build({ name, paths: [], lines: lines(LOAF, 'K'), fills: [{ set: rings(LOAF) }], cutouts: [] })
  if (!nodes) return null
  const out = tune(nodes, name, { k: [0.28, 0.52, 0.78], ink: 0.45 })
  for (const [a, b] of SLASH) {
    out.push(['path', { d: `M${tx(a[0] + 0.45)} ${ty(a[1] + 0.3)}L${tx(b[0] + 0.45)} ${ty(b[1] + 0.3)}`, fill: 'none', stroke: 'var(--with-liquid-edge, #B9E6FF)', 'stroke-opacity': 0.9, 'stroke-width': r2(1.5 * S), 'stroke-linecap': 'round', class: 'wm-a' }])
    out.push(['path', { d: `M${tx(a[0])} ${ty(a[1])}L${tx(b[0])} ${ty(b[1])}`, fill: 'none', stroke: 'var(--with-liquid-c3, #1C3F9E)', 'stroke-width': r2(1.3 * S), 'stroke-linecap': 'round', class: 'wm-a' }])
  }
  return out
}
