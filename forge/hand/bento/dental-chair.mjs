// forge/hand/bento/dental-chair.mjs — a reclined chair drawn as one thick outlined cushion band (backrest, seat, leg
// rest) with a large separate headrest pad on top, a pedestal and foot, and a smaller, compact overhead lamp, so the
// chair silhouette reads at 16px; the generated glyph's thin zigzag and big lamp tangled into one shape.
// House glyph scale, tile, shadow and duotone; the lamp is the A part that swings from its stem.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'dental-chair'
const id = n => `wg-bento-${NAME}-${n}`
const url = n => `url(#${id(n)})`
const S = T.S
const M = (d, dy = 0) => mapPath(d, S, [12, 12], 0, T.CY - 12 + dy)
const Y = y => +(T.CY + (y - 12) * S).toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const n2 = v => +v.toFixed(2)

// glyph, on the 24 grid. Cushions are centrelines drawn as outlined bands of width W (grid units).
const CHAIR = 'M5.75 6.25L9.25 12.5H15L18.5 16.5'
const W_CHAIR = 3.25
const HEAD = 'M4.6 4.1L4.9 4.6'
const W_HEAD = 4.75
const BASE = 'M11.75 14.5V20.25M8 20.25H15.5'
const LAMP = 'M13.75 6.75A2.25 2 0 0 1 18.25 6.75Z'
const STEM = 'M16 4.75V2.5'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, Y(2), 0, Y(18.5), [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  const outer = w => n2(w * S + T.SW), inner = w => n2(w * S - T.SW)
  // soft drop shadow, then a tight contact shadow (cushions as wide strokes, the rest as the glyph strokes)
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    const sh = { stroke: col('shadow'), 'stroke-opacity': op, class: 'wm-shadow' }
    out.push(['path', { d: M(CHAIR, dy), ...sh, 'stroke-width': n2(outer(W_CHAIR) + w) }])
    out.push(['path', { d: M(HEAD, dy), ...sh, 'stroke-width': n2(outer(W_HEAD) + w) }])
    out.push(['path', { d: M(BASE + STEM, dy), ...sh, 'stroke-width': n2(T.SW + w) }])
    out.push(['path', { d: M(LAMP, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': n2(T.SW + w), opacity: op, class: 'wm-shadow' }])
  }
  // pedestal and foot
  out.push(['path', { d: M(BASE), stroke: col('shadow'), 'stroke-width': T.SW }])
  // a cushion: deep outline band, then the house duotone inside it
  const cushion = (d, w) => {
    out.push(['path', { d: M(d), stroke: col('shadow'), 'stroke-width': outer(w) }])
    out.push(['path', { d: M(d), stroke: col('shine'), 'stroke-width': inner(w) }])
    out.push(['path', { d: M(d), stroke: url(2), 'stroke-width': inner(w) }])
  }
  cushion(CHAIR, W_CHAIR)
  cushion(HEAD, W_HEAD)
  // the overhead lamp: a compact dome on a short stem (the A plate; it sways from the top of the stem)
  out.push(['path', { d: M(STEM), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(LAMP), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }])
  out.push(['path', { d: M(LAMP), fill: col('c1'), 'fill-opacity': 0.6, stroke: col('c1'), 'stroke-opacity': 0.6, 'stroke-width': T.SW, class: 'wm-a' }])
  return out
}
