// forge/hand/liquid/avatar-ghost.mjs: the ghost as one clear liquid-glass sheet with a scalloped hem and a clear
// face: two oval eyes and a small open mouth in deep glass (wm-a), the same as the line design's two dots and "o".
// The generated face was tiny holes ringed by pale inlays that merged into blue blobs.
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

const BODY = 'M5 20.5V11A7 7 0 0 1 19 11V20.5C19 21.2 18.5 21.3 17.8 20.8L16.8 20C16 19.4 15.5 19.4 14.8 20L13.3 21C12.5 21.5 11.5 21.5 10.7 21L9.2 20C8.5 19.4 8 19.4 7.2 20L6.2 20.8C5.5 21.3 5 21.2 5 20.5Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-ghost'
  const nodes = build({ name, paths: [], lines: lines(BODY, 'K'), fills: [{ set: rings(BODY) }], cutouts: [] })
  if (!nodes) return null
  return [...tune(nodes, name, { k: [0.24, 0.48, 0.76], ink: 0.45 }),
    dot(9.4, 11.2, 1.1, 1.5), dot(14.6, 11.2, 1.1, 1.5), dot(12, 15.6, 0.95, 1.25),
    glint(9.1, 10.5, 0.3), glint(14.3, 10.5, 0.3)]
}
