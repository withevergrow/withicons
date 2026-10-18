// forge/hand/christmas/filter.mjs — a pine funnel with a crisp rim, a slim snow cap on the rim and a small holly sprig:
// the generated cap swelled past the rim and swallowed the top quarter of the cone, so the funnel lost its wide mouth
// and read as a snowy goblet at 16px. House recipe: 0.6 ink outline, shared warm light, snow cap (shine to tint) with
// a soft cool shadow, holly on the snow.
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
const disc = (x, y, r) => `M${n(x - r)} ${n(y)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0Z`
// a holly sprig: two wavy leaves either side, three berries in the middle
function holly(x, y, s) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a)
    const L = 2.05 * s, W = 0.62 * s, p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L]
    const pt = (t, side) => {
      const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4))
      return [p0[0] + (tip[0] - p0[0]) * t - sa * w * side, p0[1] + (tip[1] - p0[1]) * t + ca * w * side]
    }
    const P = []
    for (let k = 0; k <= 8; k++) P.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) P.push(pt(k / 8, -1))
    return 'M' + P.map(p => `${n(p[0])} ${n(p[1])}`).join('L') + 'Z'
  }
  const b = 0.46 * s
  return [
    ['path', { d: leaf(1) + leaf(-1), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(x - 0.42 * s, y + 0.18 * s, b) + disc(x + 0.42 * s, y + 0.18 * s, b) + disc(x, y - 0.42 * s, b), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: disc(x - 0.12 * s, y - 0.58 * s, 0.13 * s), fill: C.shine, class: 'wm-deco' }],
  ]
}

// the skeleton's funnel
const FUNNEL = 'M4.64 3.5H19.36A1 1 0 0 1 20.13 5.14L14.35 12.08A1.5 1.5 0 0 0 14 13.04V18.69A.5 .5 0 0 1 13.72 19.14L10.72 20.64A.5 .5 0 0 1 10 20.19V13.04A1.5 1.5 0 0 0 9.65 12.08L3.87 5.14A1 1 0 0 1 4.64 3.5Z'
// the funnel's inner wall: a darker band where the cone narrows into the spout
const THROAT = 'M10.6 12.6H13.4'

export default function render(icon) {
  const name = icon.name || 'filter'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const drips = [{ x: 7.6, w: 0.75, l: 0.7 }, { x: 16.1, w: 0.8, l: 0.9 }]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3.7, y1: 3, x2: 13.4, y2: 20.7, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.4, x2: 0, y2: 5.2, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: FUNNEL, fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: FUNNEL, fill: url(0), class: 'wm-shine' }],
    ['path', { d: THROAT, stroke: C.shadow, 'stroke-opacity': 0.45, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: snowD(4.2, 19.8, 3.92, 1, 1.1, 0.65, drips), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snowD(3.7, 20.3, 3.5, 1, 1.15, 0.65, drips), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(14.6, 2.7, 1.05),
  ]
}
