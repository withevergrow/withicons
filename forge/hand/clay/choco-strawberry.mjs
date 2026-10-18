// forge/hand/clay/choco-strawberry.mjs: a plump red clay strawberry in the heart silhouette (shoulders, notch, pointed
// tip) under a green leafy crown with a short stem, dipped in chocolate: a brown coat across the upper body that ends
// in a wavy drip edge, with the red tip and a few cream seeds showing below. The generated berry took the cocoa
// family's brown for the whole body, so it read as an acorn with a yellow squiggle. Roles follow the item's palettes:
// c1 berry, c2 chocolate, c3 leaves, tint seeds. Same soft light as the generated clay (_clay-core.mjs).
import { K } from '../../styles/_clay-model.mjs'
import { ellD } from '../../styles/_clay-core.mjs'

const V = (r, h) => `var(--with-clay-${r}, ${h})`
const C1 = V('c1', '#E0243B'), C2 = V('c2', '#6B3A26'), C3 = V('c3', '#3E8E4F'), SH = V('shadow', '#61111B')
const SN = V('shine', '#FFFFFF'), TINT = V('tint', '#FFE8B8'), INK = V('ink', '#3B0A14')
const r2 = n => Math.round(n * 100) / 100
const ES = 1.2   // drawn larger than the generic clay scale so the berry fills the keyline box like its siblings
const s = K.SCALE * ES
const tf = (x, y) => [r2((x - 12) * s + 12 + K.TX), r2((y - 12) * s + 12 + K.TY - 0.4)]
const mapPts = (pts, dx = 0, dy = 0) => pts.map(([x, y]) => tf(x, y)).map(([x, y]) => `${r2(x + dx)} ${r2(y + dy)}`)

// cubic segments [p0, c1, c2, p1] in skeleton coordinates, clockwise from the tip: the heart-shaped berry
const SEGS = [
  [[12, 21.8], [7, 19.6], [4.4, 15.6], [4.8, 11.2]],
  [[4.8, 11.2], [5.1, 8], [7.6, 6.7], [10, 7.4]],
  [[10, 7.4], [11, 7.7], [11.6, 8], [12, 8.3]],
  [[12, 8.3], [12.4, 8], [13, 7.7], [14, 7.4]],
  [[14, 7.4], [16.4, 6.7], [18.9, 8], [19.2, 11.2]],
  [[19.2, 11.2], [19.6, 15.6], [17, 19.6], [12, 21.8]],
]
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
function split(seg, t) {
  const [p0, p1, p2, p3] = seg
  const a = lerp(p0, p1, t), b = lerp(p1, p2, t), c = lerp(p2, p3, t), d = lerp(a, b, t), e = lerp(b, c, t), f = lerp(d, e, t)
  return [[p0, a, d, f], [f, e, c, p3]]
}
function atY(seg, y) {   // t where the (monotone in y) segment crosses y
  let lo = 0, hi = 1
  const inc = seg[3][1] > seg[0][1]
  for (let i = 0; i < 30; i++) {
    const m = (lo + hi) / 2, yy = split(seg, m)[0][3][1]
    if ((yy < y) === inc) lo = m; else hi = m
  }
  return (lo + hi) / 2
}
const cub = (seg, dx, dy) => { const [a, b, c] = mapPts(seg.slice(1), dx, dy); return `C${a} ${b} ${c}` }
const start = (pt, dx, dy) => `M${mapPts([pt], dx, dy)[0]}`

const BODY = (dx = 0, dy = 0) => start(SEGS[0][0], dx, dy) + SEGS.map(g => cub(g, dx, dy)).join('') + 'Z'

// chocolate: the berry above a wave line at y = 12.6
const YW = 12.6
const left = split(SEGS[0], atY(SEGS[0], YW))[1], right = split(SEGS[5], atY(SEGS[5], YW))[0]
// the drip edge: U-shaped lobes hanging from the wave line (right to left), each a cubic that dips by `depth`
const U_ = (xr, xl, depth) => [[xr, YW], [xr, YW + depth * 1.3], [xl, YW + depth * 1.3], [xl, YW]]
const WAVE = [U_(right[3][0], 14.7, 2.9), U_(14.7, 10.5, 3.6), U_(10.5, 7.4, 2.6), U_(7.4, left[0][0], 1.7)]
const CHOC = (dx = 0, dy = 0) => start(left[0], dx, dy) + cub(left, dx, dy) + cub(SEGS[1], dx, dy) + cub(SEGS[2], dx, dy) + cub(SEGS[3], dx, dy) + cub(SEGS[4], dx, dy) + cub(right, dx, dy)
  + WAVE.map(g => cub(g, dx, dy)).join('') + 'Z'

// leaves of the crown (skeleton coordinates, mapped below)
const LEAF_L = 'M12 8.4C10 9 7.2 8.6 5.6 6.4C8 5.2 10.8 5.8 12 8.4Z'
const LEAF_R = 'M12 8.4C14 9 16.8 8.6 18.4 6.4C16 5.2 13.2 5.8 12 8.4Z'
const LEAF_C = 'M12 8.5C10.3 7.2 10.2 5 12 3.9C13.8 5 13.7 7.2 12 8.5Z'
const LEAF_LL = 'M12 8.5C10.6 9.8 8.6 10.2 7 9.4C8 7.9 10.2 7.8 12 8.5Z'
const LEAF_RR = 'M12 8.5C13.4 9.8 15.4 10.2 17 9.4C16 7.9 13.8 7.8 12 8.5Z'
const mapD = d => d.replace(/([MLCQ])([^MLCQZ]*)/g, (m, c, nums) => {
  const n = nums.trim().split(/[\s,]+/).map(Number), out = []
  for (let i = 0; i < n.length; i += 2) out.push(tf(n[i], n[i + 1]).join(' '))
  return c + out.join(' ')
})

export default function render() {
  const g = (id, cx, cy, r, stops) => ['radialGradient', { id: `wg-clay-choco-strawberry-${id}`, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops.map(([o, c, op]) => ['stop', { offset: String(o), 'stop-color': c, 'stop-opacity': String(op) }])]
  const lit = (id, cx, cy, r) => g(id, cx, cy, r, [[0, SN, 0.5], [0.35, SN, 0.06], [0.7, SH, 0.08], [1, SH, 0.38]])
  const U = id => `url(#wg-clay-choco-strawberry-${id})`
  const [bx, by] = tf(9, 9)
  const nodes = [['defs', {}, [
    lit(0, bx, by, 18), lit(1, bx + 0.5, by, 11), lit(2, 10.5, 4, 5),
    g(3, 12, 21.6, 8.4, [[0, INK, 0.5], [0.6, SH, 0.26], [1, SH, 0]]),
  ]]]
  const P = (a, extra) => nodes.push(['path', { ...a, ...extra }])
  // ground shadow
  P({ d: ellD(12, 21.6, 8, 1.5), fill: U(3), class: 'wm-shadow' })
  P({ d: ellD(12, 21.5, 4.4, 0.8), fill: INK, 'fill-opacity': 0.3, class: 'wm-shadow' })
  // berry: wall under the face (deep red), face, lit volume
  P({ d: BODY(0.1, 0.72), fill: SH, class: 'wm-k' })
  P({ d: BODY(0.05, 0.4), fill: C1, class: 'wm-k' })
  P({ d: BODY(), fill: C1, class: 'wm-k' })
  P({ d: BODY(), fill: U(0), class: 'wm-k' })
  // seeds on the red tip
  for (const [x, y] of [[11.2, 18.1], [13.6, 18.6], [9.3, 17.4], [12, 20.2], [15.2, 17.6], [16.4, 14.9]]) {
    const [sx, sy] = tf(x, y)
    P({ d: ellD(sx + 0.05, sy + 0.14, 0.36, 0.55), fill: SH, 'fill-opacity': 0.3, class: 'wm-deco' })
    P({ d: ellD(sx, sy, 0.34, 0.53), fill: TINT, class: 'wm-deco' })
  }
  // chocolate coat: its own thickness, rolling light, drips
  // light rim so the dark coat separates from a dark background
  P({ d: CHOC(), fill: 'none', stroke: TINT, 'stroke-width': 1.1, 'stroke-opacity': 0.55, 'stroke-linejoin': 'round', class: 'wm-a' })
  P({ d: CHOC(0.08, 0.6), fill: INK, 'fill-opacity': 0.55, class: 'wm-a' })
  P({ d: CHOC(0.04, 0.32), fill: SH, 'fill-opacity': 0.5, class: 'wm-a' })
  P({ d: CHOC(0.04, 0.32), fill: C2, class: 'wm-a' })
  P({ d: CHOC(), fill: C2, class: 'wm-a' })
  P({ d: CHOC(), fill: U(1), class: 'wm-a' })
  P({ d: CHOC(), fill: SN, 'fill-opacity': 0.1, class: 'wm-shine' })
  // gloss on the chocolate
  P({ d: ellD(...tf(7.6, 11.1), 0.7, 1.7, 25), fill: SN, 'fill-opacity': 0.4, class: 'wm-shine' })
  P({ d: ellD(...tf(6.5, 13.6), 0.28, 0.4, 20), fill: SN, 'fill-opacity': 0.4, class: 'wm-shine' })
  // leafy crown
  for (const d of [LEAF_LL, LEAF_RR, LEAF_L, LEAF_R, LEAF_C]) {
    P({ d: mapD(d), fill: C3, class: 'wm-a' })
  }
  return nodes
}
