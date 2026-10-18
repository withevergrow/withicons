// forge/hand/liquid/avatar-fox.mjs: the line fox in clear glass: tall pointed ears with pink inner triangles, a wide
// head cheeking down to a pointed chin, two vertical slot eyes and a small triangle nose in deep glass (wm-a).
// The generated one read as a wolf: angular snout and blob eyes.
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
const HEAD = 'M12 20.5C11 19.5 9.5 18.5 8 17.75L3.5 15.25C4.5 13.75 5 12.25 5 10.75V4.75C5 3.75 5.75 3.5 6.5 4L10 7H14L17.5 4C18.25 3.5 19 3.75 19 4.75V10.75C19 12.25 19.5 13.75 20.5 15.25L16 17.75C14.5 18.5 13 19.5 12 20.5Z'
const slot = (cx, cy) => ['path', { d: `M${tx(cx)} ${ty(cy - 0.5)}V${ty(cy + 0.5)}`, fill: 'none', stroke: 'var(--with-liquid-c3, #1C3F9E)', 'stroke-width': r2(1.9 * S), 'stroke-linecap': 'round', class: 'wm-a' }]
const ear = pts => ['path', { d: 'M' + pts.map(([x, y]) => tx(x) + ' ' + ty(y)).join('L') + 'Z', fill: 'var(--with-liquid-c4, #FF7EC1)', 'fill-opacity': 0.8, stroke: 'var(--with-liquid-c4, #FF7EC1)', 'stroke-width': 0.6, 'stroke-linejoin': 'round', 'stroke-opacity': 0.8, class: 'wm-deco' }]
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-fox'
  const nodes = build({
    name, paths: [],
    lines: [{ pts: rings(HEAD)[0].map(([x, y]) => [12 + (x - 12) * 0.8, 12 + (y - 12) * 0.8]), closed: true, plate: 'K' }],
    fills: [{ set: rings(HEAD) }], cutouts: [],
  })
  if (!nodes) return null
  return [...tune(nodes, name, { k: [0.28, 0.52, 0.78], ink: 0.45 }),
    ear([[6.6, 5.9], [6.6, 9.6], [9, 7.9]]), ear([[17.4, 5.9], [17.4, 9.6], [15, 7.9]]),
    slot(9.5, 12.5), slot(14.5, 12.5),
    ['path', { d: `M${tx(10.4)} ${ty(17.3)}H${tx(13.6)}L${tx(12)} ${ty(19)}Z`, fill: 'var(--with-liquid-c3, #1C3F9E)', stroke: 'var(--with-liquid-c3, #1C3F9E)', 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-a' }]]
}
