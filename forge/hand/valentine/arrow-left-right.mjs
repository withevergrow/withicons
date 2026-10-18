// forge/hand/valentine/arrow-left-right.mjs — two slimmer pink arrowheads (they pulse, plate A) joined by a long shaft, so it
// reads as a double arrow; the generated heads were as tall as the bar was long and the shape read as a bone or an H.
import { C, heartD } from '../../styles/_valentine-core.mjs'

const G = 'url(#wg-valentine-arrow-left-right-0)'
const f = v => Math.round(v * 100) / 100
// a polygon with each corner rounded by a quadratic through the vertex
function rounded(pts, r) {
  const n = pts.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const p = pts[(i + n - 1) % n], q = pts[i], s = pts[(i + 1) % n]
    const a = Math.hypot(q[0] - p[0], q[1] - p[1]), b = Math.hypot(s[0] - q[0], s[1] - q[1])
    const ra = Math.min(r, a / 2), rb = Math.min(r, b / 2)
    const p1 = [q[0] + (p[0] - q[0]) * ra / a, q[1] + (p[1] - q[1]) * ra / a]
    const p2 = [q[0] + (s[0] - q[0]) * rb / b, q[1] + (s[1] - q[1]) * rb / b]
    d += (i ? 'L' : 'M') + f(p1[0]) + ' ' + f(p1[1]) + 'Q' + f(q[0]) + ' ' + f(q[1]) + ' ' + f(p2[0]) + ' ' + f(p2[1])
  }
  return d + 'Z'
}
const LH = [[2, 12], [7.5, 6.5], [8.5, 7.5], [8.5, 16.5], [7.5, 17.5]]
const RH = [[22, 12], [16.5, 17.5], [15.5, 16.5], [15.5, 7.5], [16.5, 6.5]]
const HEADS = rounded(LH, 0.9) + rounded(RH, 0.9)
// shaft between the heads (fill only, tucked into the heads) and its two ink edges
const SHAFT = 'M8 10.9H16V13.1H8Z'
const EDGES = 'M8.5 10.9H15.5M8.5 13.1H15.5'
const HALO = rounded([[2, 12], [7.5, 6.5], [8.5, 7.5], [8.5, 10.9], [15.5, 10.9], [15.5, 7.5], [16.5, 6.5], [22, 12],
  [16.5, 17.5], [15.5, 16.5], [15.5, 13.1], [8.5, 13.1], [8.5, 16.5], [7.5, 17.5]], 0.9)

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-valentine-arrow-left-right-0', x1: 10, y1: 6.5, x2: 14, y2: 17.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C.c1 }],
        ['stop', { offset: 0.4, 'stop-color': C.c1 }],
        ['stop', { offset: 1, 'stop-color': C.c2 }],
      ]],
    ]],
    ['path', { d: HALO, fill: 'none', stroke: C.c4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: heartD(4, 4.6, 1.3), fill: C.c2, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: HEADS, fill: G, stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: SHAFT, fill: G, class: 'wm-k' }],
    ['path', { d: EDGES, fill: 'none', stroke: C.ink, 'stroke-width': 0.72, class: 'wm-k' }],
    // shade: the shaft's lower edge and the heads' lower-right faces
    ['path', { d: 'M8.85 12.45H15.15V12.75H8.85ZM20.9 12.55L16.4 17.05L16.1 16.75L20.45 12.4ZM8.15 13.1V16.3L7.75 16.7V13.1Z', fill: C.shadow, 'fill-opacity': 0.5, class: 'wm-shadow' }],
    // highlight along the heads' upper-left faces
    ['path', { d: 'M3.6 11.2L6.9 7.9M17.4 8.3L19.1 10M9.4 11.55H11.2', fill: 'none', stroke: C.shine, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
  ]
}
