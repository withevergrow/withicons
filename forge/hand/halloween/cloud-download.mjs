// forge/hand/halloween/cloud-download.mjs — a plump three-lobed bone cloud, warm candle shade along its belly, with a bold
// slime-green arrow dropping through it, all in the midnight outline. Replaces the generated drawing, where a bat in the
// corner and a thin open-bottomed cloud made the arrow hard to pick out at 16px.
// Roles: cloud shine -> tint, belly shade accent, arrow c4, outline ink, halo accent, drop shadow shadow.
// Motion: cloud wm-k (floats), arrow wm-s (drops).
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'cloud-download'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

// three lobes sitting on a flat base at y = BASE
const L = [7.1, 11.4, 4.6], M = [12.1, 8.6, 6.4], R = [17.2, 11.6, 4.4], BASE = 16
// the upper crossing of two circles
function meet([ax, ay, ar], [bx, by, br]) {
  const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy)
  const a = (ar * ar - br * br + d * d) / (2 * d), h = Math.sqrt(ar * ar - a * a)
  const mx = ax + a * dx / d, my = ay + a * dy / d
  const p = [mx + h * dy / d, my - h * dx / d], q = [mx - h * dy / d, my + h * dx / d]
  return p[1] < q[1] ? p : q
}
const ang = ([cx, cy], [x, y]) => Math.atan2(y - cy, x - cx)
function arc([cx, cy, r], from, to) {
  let s = ang([cx, cy], to) - ang([cx, cy], from)
  while (s <= 0) s += 2 * Math.PI
  return `A${num(r)} ${num(r)} 0 ${s > Math.PI ? 1 : 0} 1 ${num(to[0])} ${num(to[1])}`
}
function cloud(dx = 0, dy = 0) {
  const m = ([x, y, r]) => [x + dx, y + dy, r]
  const l = m(L), c = m(M), r = m(R)
  const a = [l[0], BASE + dy], b = meet(l, c), e = meet(c, r), f = [r[0], BASE + dy]
  return `M${num(a[0])} ${num(a[1])}${arc(l, a, b)}${arc(c, b, e)}${arc(r, e, f)}Z`
}
// the warm belly: the base of the cloud below a soft curve
function belly() {
  const y = 13.9
  const xl = L[0] - Math.sqrt(L[2] ** 2 - (y - L[1]) ** 2), xr = R[0] + Math.sqrt(R[2] ** 2 - (y - R[1]) ** 2)
  return `M${num(xl)} ${num(y)}A${L[2]} ${L[2]} 0 0 0 ${L[0]} ${BASE}H${R[0]}A${R[2]} ${R[2]} 0 0 0 ${num(xr)} ${num(y)}C17 15 7.4 15 ${num(xl)} ${num(y)}Z`
}
const ARROW = 'M12 10.8V20.6M8.7 17.3L12 20.6L15.3 17.3'
const ARROW_SH = 'M12.15 11.65V21.45M8.85 18.15L12.15 21.45L15.45 18.15'

export default function render() {
  const C0 = cloud()
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 10.2, r: 13, fx: 9, fy: 6.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine), st(0.5, C.shine), st(1, C.tint)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: cloud(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: ARROW_SH, ...ROUND, stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 2, class: 'wm-shadow' }],
    // the cloud: body, warm belly, shine, then its outline on top
    ['path', { d: C0, fill: url(0), class: 'wm-k' }],
    ['path', { d: belly(), fill: C.accent, 'fill-opacity': 0.38, class: 'wm-k' }],
    ['path', { d: C0, fill: 'none', stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // the arrow: ink first, slime on top
    ['path', { d: ARROW, ...ROUND, stroke: C.ink, 'stroke-width': 2.72, class: 'wm-s' }],
    ['path', { d: ARROW, ...ROUND, stroke: C.c4, 'stroke-width': 1.28, class: 'wm-s' }],
  ]
}
