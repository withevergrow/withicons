// forge/hand/christmas/bamboo.mjs — two lighter pine stalks with clear ink node rings and three angled dark-pine
// leaves, a small snow cap on each stalk top.
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

// a pointed leaf from (x,y) along angle a (radians), length L, half-width w
function leaf(x, y, a, L, w) {
  const ca = Math.cos(a), sa = Math.sin(a), tx = x + ca * L, ty = y + sa * L, mx = x + ca * L * 0.45, my = y + sa * L * 0.45
  return `M${n(x)} ${n(y)}Q${n(mx - sa * w * 2)} ${n(my + ca * w * 2)} ${n(tx)} ${n(ty)}Q${n(mx + sa * w * 2)} ${n(my - ca * w * 2)} ${n(x)} ${n(y)}Z`
}

export default function render(icon) {
  const name = icon.name || 'bamboo'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const S1 = rr(6.6, 3.6, 10, 21.5, 1.2), S2 = rr(13.6, 7.2, 16.8, 21.5, 1.2)
  const RINGS = 'M6.6 9.3H10M6.6 15.2H10M13.6 12.4H16.8M13.6 17.4H16.8'
  const LEAVES = leaf(10, 9.3, -0.6, 7, 1.25) + leaf(6.6, 15.2, Math.PI + 0.55, 5.4, 1.15) + leaf(16.8, 12.4, -0.4, 5.2, 1.1)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 14, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.4, x2: 0, y2: 5, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: S1 + S2, fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: S1 + S2, fill: C.shine, 'fill-opacity': 0.28, class: 'wm-k' }],
    ['path', { d: S1 + S2, fill: url(0), class: 'wm-shine' }],
    ['path', { d: RINGS, stroke: C.ink, 'stroke-width': 0.75, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M7.7 5.6V8.3M7.7 10.4V14.2M14.7 9V11.4M14.7 13.4V16.4', stroke: C.shine, 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, class: 'wm-shine' }],
    ['path', { d: LEAVES, fill: C.c2, ...INK, 'stroke-width': 0.45, class: 'wm-a' }],
    ['path', { d: snowD(6.6, 10, 3.6, 1.2, 0.9, 0.5, []), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: snowD(13.6, 16.8, 7.2, 1.2, 0.9, 0.5, []), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
