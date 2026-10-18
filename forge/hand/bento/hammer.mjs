// forge/hand/bento/hammer.mjs — a claw hammer: a squared striking block and a narrow hooked claw of about equal reach
// on a long handle, so at 16px it reads as a T on a stick (the generated head was a huge wedge on a stub).
// Drawn square in a local frame, rotated 45 degrees onto the 24 grid in code, then placed with the house recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'hammer'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// local frame: x runs along the head (face -x, claw +x), y runs down the handle toward the grip; handle centred on x 0.
// world = C + F * (x * U + y * V) with U = (1, 1)/sqrt2 (head toward the lower right), V = (-1, 1)/sqrt2 (handle to the
// lower left). F scales the glyph up to the house optical size; C centres its bounding box on the tile (grip near 5.4,19.3).
const C = [15, 10], F = 1.1, K = Math.SQRT1_2
const r2 = v => Math.round(v * 100) / 100
const P = (x, y) => `${r2(C[0] + F * (x - y) * K)} ${r2(C[1] + F * (x + y) * K)}`
// head: a 5u-tall squared block from the face (4u past the handle) over the eye, then a 1.9u claw root that tapers and
// hooks back toward the handle; total reach about 11u, both sides about 4u past the handle edges.
const HEAD = `M${P(-5.6, -2.5)}L${P(1.6, -2.5)}C${P(3.4, -2.5)} ${P(5, -1.2)} ${P(5.5, 1.6)}` +
  `C${P(4.6, 0.2)} ${P(3.4, -0.6)} ${P(1.6, -0.6)}L${P(1.6, 2.5)}L${P(-5.6, 2.5)}Z`
const HW = 1.6, HY = 11, HR = r2(HW * F)
const HANDLE_F = `M${P(-HW, 0)}L${P(-HW, HY)}A${HR} ${HR} 0 0 0 ${P(HW, HY)}L${P(HW, 0)}Z`
const HANDLE_S = `M${P(-HW, 2.5)}L${P(-HW, HY)}A${HR} ${HR} 0 0 0 ${P(HW, HY)}L${P(HW, 2.5)}`

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 7.77, 0, 17.21, [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  // soft drop shadow, then a tight contact shadow
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(HANDLE_F + HEAD, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // the handle: the A plate, a deeper duotone mass under the A line (colour over a deep underline)
  out.push(['path', { d: M(HANDLE_F), fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: M(HANDLE_F), fill: col('c1'), 'fill-opacity': 0.42, class: 'wm-a' }])
  out.push(['path', { d: M(HANDLE_S), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(HANDLE_S), stroke: col('c1'), 'stroke-opacity': 0.72, 'stroke-width': T.SW, class: 'wm-a' }])
  // the head: the house duotone mass under a deep outline, laid over the handle's top
  out.push(['path', { d: M(HEAD), fill: col('shine') }])
  out.push(['path', { d: M(HEAD), fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(HEAD), stroke: col('shadow'), 'stroke-width': T.SW }])
  return out
}
