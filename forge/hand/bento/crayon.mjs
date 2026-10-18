// forge/hand/bento/crayon.mjs — a crayon: a short blunt wax cone with a flat end and a small round highlight, shoulders
// stepping in from the paper, deep wax-coloured bands at both ends of the wrapper and a flat squared back end, so it
// reads as wax-and-paper rather than a pencil (the generated glyph was one pale mass). House tile, shadow, duotone.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'crayon'
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const Y = y => +(T.CY + (y - 12) * T.S).toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const n2 = v => +v.toFixed(2)

// the crayon is drawn along its own axis (u from the tip end, v across) and laid on the 45-degree diagonal, tip at the
// bottom left, centred on (12, 12): length 16.5, wrapper 6.5 wide, cone 3.25 long from 2 wide (flat end) to 4.8 wide
const L = 16.5, HW = 3.25, CONE = 3.25, TIP = 1, SHO = 2.4, BAND = 3.5
const R = Math.SQRT1_2, O = [12 - (L / 2) * R, 12 + (L / 2) * R]
const P = (u, v) => `${n2(O[0] + u * R + v * R)} ${n2(O[1] - u * R + v * R)}`
const quad = (u0, u1, h0, h1 = h0) => `M${P(u0, -h0)}L${P(u1, -h1)}L${P(u1, h1)}L${P(u0, h0)}Z`

const BODY = `M${P(0, -TIP)}L${P(CONE, -SHO)}L${P(CONE, -HW)}L${P(L, -HW)}L${P(L, HW)}L${P(CONE, HW)}L${P(CONE, SHO)}L${P(0, TIP)}Z`
const WAX = quad(0, CONE, TIP, SHO)
const BANDS = quad(CONE, CONE + BAND, HW) + quad(L - BAND, L, HW)
const SEAMS = `M${P(CONE + BAND, -HW)}L${P(CONE + BAND, HW)}M${P(L - BAND, -HW)}L${P(L - BAND, HW)}`
const DOT = (() => { const [x, y] = P(CONE * 0.5, 0).split(' ').map(Number); return { cx: n2(12 + (x - 12) * T.S), cy: Y(y) } })()

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, Y(4), 0, Y(18), [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(BODY, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // paper wrapper: the house duotone mass
  out.push(['path', { d: M(BODY), fill: col('shine') }])
  out.push(['path', { d: M(BODY), fill: url(2) }])
  // the wax: cone and both wrapper end bands in the same solid colour over the deep shade
  out.push(['path', { d: M(WAX + BANDS), fill: col('shadow') }])
  out.push(['path', { d: M(WAX + BANDS), fill: col('c1'), 'fill-opacity': 0.8, class: 'wm-a' }])
  // a small round highlight in the middle of the cone
  out.push(['circle', { ...DOT, r: 0.3, fill: col('shine'), 'fill-opacity': 0.85, class: 'wm-shine' }])
  // outline, the cone shoulder and the band edges in the deep ink
  out.push(['path', { d: M(BODY), stroke: col('shadow'), 'stroke-width': T.SW }])
  out.push(['path', { d: M(`M${P(CONE, -HW)}L${P(CONE, HW)}` + SEAMS), stroke: col('shadow'), 'stroke-width': T.SW }])
  return out
}
