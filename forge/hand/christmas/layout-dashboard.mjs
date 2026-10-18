// forge/hand/christmas/layout-dashboard.mjs — the dashboard layout: four panels in two columns with staggered heights
// (tall top left and bottom right, short top right and bottom left), cranberry on one diagonal and pine on the other,
// even 2u gaps and a single snow cap on the tall top left panel. Staggered heights are what make it read as a dashboard
// rather than a plain 2x2 grid; the one cap keeps the panels from merging into a blob.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

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

// [x0, y0, x1, y1, fill, part]
const PANELS = [
  [3, 3, 11, 13.5, C.c1, 'wm-k'],
  [13, 3, 21, 9.5, C.c2, 'wm-a'],
  [3, 15.5, 11, 21, C.c2, 'wm-a'],
  [13, 11.5, 21, 21, C.c1, 'wm-k'],
]

export default function render(icon) {
  const name = icon.name || 'layout-dashboard'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const out = [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 0.55, y2: 1 },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.8, x2: 0, y2: 4.8, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
  ]
  for (const [x0, y0, x1, y1, fill, cls] of PANELS) {
    const d = rr(x0, y0, x1, y1, 1.8)
    out.push(['path', { d, fill, ...INK, class: cls }])
    out.push(['path', { d, fill: url(0), class: 'wm-shine' }])
  }
  const drips = [{ x: 5.4, w: 0.85, l: 0.8 }, { x: 8.7, w: 0.7, l: 0.5 }]
  out.push(['path', { d: snowD(3.5, 10.5, 3.42, 1.8, 1.05, 0.6, drips), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }])
  out.push(['path', { d: snowD(3, 11, 3, 1.8, 1.15, 0.6, drips), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  return out
}
