// forge/hand/christmas/sidebar.mjs — a cranberry window frame holding a gold side rail with three menu bars on the left
// and a cream content pane on the right, a slim snow cap on the frame: the generated drawing turned the rail into a fat
// gold wall around an empty hole and crowned it with a heavy snow lid and holly, so it read as a jar or a book. House
// recipe: 0.6 ink outline, shared warm light (cool tint on cream), snow cap (shine to tint) with a soft cool shadow.
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

const FRAME = rr(3, 3, 21, 21, 2.5)
const RAIL = rr(4.9, 4.9, 8.6, 19.1, 0.9)
const PANE = rr(10.1, 4.9, 19.1, 19.1, 0.9)
// three menu bars on the rail
const MENU = rr(5.95, 8.1, 7.55, 9.1, 0.5) + rr(5.95, 10.6, 7.55, 11.6, 0.5) + rr(5.95, 13.1, 7.55, 14.1, 0.5)

export default function render(icon) {
  const name = icon.name || 'sidebar'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const drips = [{ x: 6.8, w: 0.8, l: 0.55 }, { x: 15.2, w: 0.85, l: 0.7 }]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 12.9, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.8, x2: 0, y2: 4.6, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 10.1, y1: 4.9, x2: 15, y2: 19.1, gradientUnits: 'userSpaceOnUse' },
        [st(0.3, C.tint, 0), st(1, C.tint, 0.75)]],
    ]],
    ['path', { d: FRAME, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: RAIL, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: MENU, fill: C.c1, 'fill-opacity': 0.85, class: 'wm-k' }],
    ['path', { d: FRAME, fill: url(0), class: 'wm-shine' }],
    ['path', { d: PANE, fill: C.c4, ...INK, class: 'wm-k' }],
    ['path', { d: PANE, fill: url(2), class: 'wm-shine' }],
    ['path', { d: snowD(3.5, 20.5, 3.42, 2.5, 1.1, 0.6, drips), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snowD(3, 21, 3, 2.5, 1.15, 0.6, drips), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
