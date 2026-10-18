// forge/hand/christmas/palm-tree.mjs — four broad pine fronds with snow riding their upper edges, three cranberry
// coconuts like baubles at the crown, a tapered gold trunk with soft rings and a snow-drift island, replacing the
// generated all-green palm whose thin trunk and slashed fronds blurred into one spiky mass at 16px.
import { C, loopsD, num } from '../../styles/_christmas-core.mjs'

const N = 'palm-tree'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

// cubic bezier point and tangent
const bz = (P, t) => {
  const u = 1 - t
  return [0, 1].map(i => u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i])
}
const bzT = (P, t) => {
  const u = 1 - t
  const v = [0, 1].map(i => 3 * u * u * (P[1][i] - P[0][i]) + 6 * u * t * (P[2][i] - P[1][i]) + 3 * t * t * (P[3][i] - P[2][i]))
  const l = Math.hypot(v[0], v[1]) || 1
  return [v[0] / l, v[1] / l]
}
const mirror = loops => loops.map(r => r.map(([x, y]) => [24 - x, y]))

// snow riding a frond's upper edge (the cubic P, outward normal on the left of travel): thick where the edge is flat,
// thinning on steep stretches and at both ends
function edgeSnow(P, t0, t1, up, dn) {
  const U = [], D = [], S = []
  const n = 26
  for (let k = 0; k <= n; k++) {
    const s = k / n, t = t0 + (t1 - t0) * s
    const [x, y] = bz(P, t), [tx, ty] = bzT(P, t), nx = -ty, ny = tx
    const slope = Math.abs(ty) / Math.max(1e-3, Math.abs(tx))
    const e = Math.min(1, s / 0.28, (1 - s) / 0.28)
    const q = Math.sqrt(Math.max(0, Math.min(1, 1 - (slope - 0.6) / 1.4)) * e * e * (3 - 2 * e))
    const u = up * q * (1 + 0.08 * Math.sin(s * 8)), d = dn * q * (1 + 0.22 * Math.sin(s * 15 + 0.8))
    U.push([x + nx * u, y + ny * u]); D.push([x - nx * d, y - ny * d]); S.push([x - nx * d, y - ny * d + 0.4])
  }
  return { cap: [[...U, ...D.slice().reverse()]], shadow: [[...U.map(([x, y]) => [x, y + 0.05]), ...S.slice().reverse()]] }
}

// the trunk: a tapered band around the skeleton's curve, slim under the crown, wider at the island
const TRUNK_C = [[12, 7.5], [13, 11.75], [13, 16.25], [11.5, 20.75]]
function trunk() {
  const L = [], R = []
  for (let k = 0; k <= 16; k++) {
    const t = k / 16, [x, y] = bz(TRUNK_C, t), [tx, ty] = bzT(TRUNK_C, t), w = 0.85 + 0.45 * t
    L.push([x + ty * w, y - tx * w]); R.push([x - ty * w, y + tx * w])
  }
  return loopsD([[...L, ...R.reverse()]])
}
function rings() {
  let d = ''
  for (const t of [0.36, 0.55, 0.74]) {
    const [x, y] = bz(TRUNK_C, t), [tx, ty] = bzT(TRUNK_C, t), w = 0.85 + 0.45 * t - 0.15
    const a = [x + ty * w, y - tx * w], b = [x - ty * w, y + tx * w], m = [x + tx * 0.35, y + ty * 0.35]
    d += `M${num(a[0])} ${num(a[1])}Q${num(m[0])} ${num(m[1])} ${num(b[0])} ${num(b[1])}`
  }
  return d
}
function sparkleD(x, y, r) {
  const q = r * 0.22, n = num
  return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}` +
    `Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}z`
}

// fronds (from the skeleton's fills): two high and broad, two lower and drooping
const UP_L = 'M12 7C10.25 1.25 3.75 1.5 2.5 9C7.25 6.5 7.75 6.75 12 7Z'
const UP_R = 'M12 7C16.25 6.75 16.75 6.5 21.5 9C20.25 1.5 13.75 1.25 12 7Z'
const LO_L = 'M12 7C8.5 4.25 4 7.25 5.5 13C9 10.75 10.5 9.75 12 7Z'
const LO_R = 'M12 7C13.5 9.75 15 10.75 18.5 13C20 7.25 15.5 4.25 12 7Z'
// the midribs (from the skeleton's cutouts), drawn as soft dark veins
const VEINS = 'M9.25 5.25L7.75 5L6.25 5.25L4.75 6.25M14.75 5.25L16.25 5L17.75 5.25L19.25 6.25' +
  'M9.75 7.5L8.5 8.25L7.5 9.25L6.5 10.5M14.25 7.5L15.5 8.25L16.5 9.25L17.5 10.5'
// the island: a snow drift
const ISLAND = 'M4.25 21.75C6.25 19.2 17.75 19.2 19.75 21.75Z'

export default function render() {
  const sL = edgeSnow([[12, 7], [10.25, 1.25], [3.75, 1.5], [2.5, 9]], 0.1, 0.8, 1.0, 0.7)
  const snow = loopsD([...sL.cap, ...mirror(sL.cap)]), snowSh = loopsD([...sL.shadow, ...mirror(sL.shadow)])
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 1.5, x2: 12, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1, x2: 0, y2: 5.5, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 0, y1: 19.3, x2: 0, y2: 21.75, gradientUnits: 'userSpaceOnUse' }, [st(0.2, C.shine), st(1, C.tint)]],
    ]],
    // trunk behind the crown, its foot buried in the drift
    ['path', { d: trunk(), fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: trunk(), fill: url(0), class: 'wm-shine' }],
    ['path', { d: rings(), stroke: C.shadow, 'stroke-opacity': 0.55, 'stroke-width': 0.42, 'stroke-linecap': 'round', class: 'wm-k' }],
    // the drift
    ['path', { d: ISLAND, fill: url(2), ...INK, class: 'wm-a' }],
    // lower fronds, then the high ones over them
    ['path', { d: LO_L + LO_R, fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: LO_L + LO_R, fill: C.shadow, 'fill-opacity': 0.18, class: 'wm-shine' }],
    ['path', { d: UP_L + UP_R, fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: UP_L + UP_R + LO_L + LO_R, fill: url(0), class: 'wm-shine' }],
    ['path', { d: VEINS, stroke: C.shadow, 'stroke-opacity': 0.5, 'stroke-width': 0.45, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    // snow on the high fronds
    ['path', { d: snowSh, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    // coconuts like baubles at the crown
    ['path', { d: disc(11.05, 8.05, 0.85) + disc(12.95, 8.05, 0.85) + disc(12, 9.15, 0.85), fill: C.c1, stroke: C.ink, 'stroke-width': 0.4, class: 'wm-k' }],
    ['path', { d: disc(10.8, 7.8, 0.22) + disc(12.7, 7.8, 0.22) + disc(11.75, 8.9, 0.22), fill: C.shine, class: 'wm-shine' }],
    ['path', { d: sparkleD(20.5, 16.25, 1.3), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
