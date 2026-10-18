// forge/hand/christmas/newspaper.mjs — a cream broadsheet with a bold cranberry headline bar, a photo block and
// pine text lines, folded over at the left by a pine wing, a slim snow cap and a holly sprig on the top edge. The
// generated drawing was a green slab with a speck of snow and none of a newspaper's cues.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const rr = (x0, y0, x1, y1, r) => `M${n(x0 + r)} ${n(y0)}H${n(x1 - r)}A${r} ${r} 0 0 1 ${n(x1)} ${n(y0 + r)}V${n(y1 - r)}A${r} ${r} 0 0 1 ${n(x1 - r)} ${n(y1)}H${n(x0 + r)}A${r} ${r} 0 0 1 ${n(x0)} ${n(y1 - r)}V${n(y0 + r)}A${r} ${r} 0 0 1 ${n(x0 + r)} ${n(y0)}Z`
const disc = (x, y, r) => `M${n(x - r)} ${n(y)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0Z`

// a snow cap resting on the sheet's flat top edge
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

export default function render(icon) {
  const name = icon.name || 'newspaper'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const SHEET = rr(7, 3.5, 21, 20.5, 2)
  const WING = rr(3, 8, 8.6, 20.5, 1.6)
  const BAR = rr(9.4, 7.4, 18.6, 11, 0.8)
  const PHOTO = rr(9.4, 13, 13.4, 16.2, 0.7)
  const lines = 'M14.8 13.7H18.6M14.8 15.9H18.6M9.4 18.7H18.6'
  const drips = [{ x: 11.2, w: 0.8, l: 0.5 }, { x: 18.6, w: 0.8, l: 0.45 }]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3.5, x2: 13, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.6, x2: 0, y2: 4.8, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: WING, fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: SHEET, fill: C.c4, ...INK, class: 'wm-k' }],
    ['path', { d: BAR, fill: C.c1, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: PHOTO, fill: C.c2, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: lines, stroke: C.c2, 'stroke-width': 1, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['path', { d: WING + SHEET, fill: url(0), class: 'wm-shine' }],
    ['path', { d: snowD(7.6, 21, 3.5, 2, 1.1, 0.6, drips), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snowD(7, 21, 3.1, 2, 1.1, 0.6, drips), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(17.2, 2.9, 0.9),
  ]
}
