// forge/hand/christmas/api.mjs — a cranberry node box with a cream core, wired left and right to two pine connector
// nodes as the line style draws it; no snow cap, so the graph reads instead of a jar.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

// a snow cap resting on a flat top edge x0..x1 at y (corner radius r): thin over the shoulders, full on the flat,
// a wavy lower edge with soft round drips
function snowD(x0, x1, y, r, up, dn, drips) {
  const xa = x0 + 0.3 * r - 0.1, xb = x1 - 0.3 * r + 0.1, ey = y + 0.3 * r, t = y - up, b = y + dn, mid = (xa + xb) / 2
  let d = `M${n(xa)} ${n(ey)}C${n(xa + 0.35)} ${n(t + 0.3)} ${n(xa + 0.9)} ${n(t)} ${n(xa + 1.7)} ${n(t)}`
  d += `Q${n(mid)} ${n(t - 0.3)} ${n(xb - 1.7)} ${n(t)}C${n(xb - 0.9)} ${n(t)} ${n(xb - 0.35)} ${n(t + 0.3)} ${n(xb)} ${n(ey)}`
  d += `Q${n(xb - 0.6)} ${n(b)} ${n(xb - 1.5)} ${n(b)}`
  let x = xb - 1.5
  for (const p of [...drips].sort((a, c) => c.x - a.x)) {
    const R = p.x + p.w, L = p.x - p.w
    d += `Q${n((x + R) / 2)} ${n(b + 0.28)} ${n(R)} ${n(b)}C${n(R)} ${n(b + p.l * 1.33)} ${n(L)} ${n(b + p.l * 1.33)} ${n(L)} ${n(b)}`
    x = L
  }
  d += `Q${n((x + xa + 1.5) / 2)} ${n(b + 0.28)} ${n(xa + 1.5)} ${n(b)}Q${n(xa + 0.6)} ${n(b)} ${n(xa)} ${n(ey)}Z`
  return d
}
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
const disc = (cx, cy, r) => `M${n(cx - r)} ${cy}a${r} ${r} 0 1 0 ${n(2 * r)} 0a${r} ${r} 0 1 0 ${n(-2 * r)} 0z`

export default function render(icon) {
  const name = icon.name || 'api'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const BOX = rr(8, 7, 16, 17, 2.2), WIRES = rr(5.5, 11.3, 8.2, 12.7, 0.3) + rr(15.8, 11.3, 18.5, 12.7, 0.3)
  const NODES = disc(4, 12, 2.3) + disc(20, 12, 2.3)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 7, x2: 10, y2: 19, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: WIRES, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: NODES, fill: C.c2, ...INK, class: 'wm-s' }],
    ['path', { d: BOX, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: BOX + NODES, fill: url(0), class: 'wm-shine' }],
    ['path', { d: rr(10.4, 9.4, 13.6, 14.6, 1), fill: C.c4, ...INK, 'stroke-width': 0.42, class: 'wm-a' }],
    ['path', { d: disc(3.3, 11.2, 0.55) + disc(19.3, 11.2, 0.55), fill: C.shine, 'fill-opacity': 0.8, class: 'wm-shine' }],
  ]
}
