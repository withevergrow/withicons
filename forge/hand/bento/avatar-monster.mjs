// forge/hand/bento/avatar-monster.mjs — a one-eyed monster on the bento tile: a fur-toned blob with stubby accent arms,
// one big lit eye (white, palette iris, ink pupil) and an open ink grin with two white fangs, so it reads as a monster
// and not a ghost or an alien (the generated glyph was a pale blob with a ring eye and a thin smile). Skeleton layout.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'avatar-monster'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const ell = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`

// glyph, on the 24 grid
const BODY = 'M12 3.5C16.25 3.5 19 6.75 19 11V18.5C19 19.75 18.25 20.5 17 20.5H7C5.75 20.5 5 19.75 5 18.5V11C5 6.75 7.75 3.5 12 3.5Z'
const ARMS = 'M5.5 13L3 15.75M18.5 13L21 15.75'
const EYE = ell(12, 10.25, 3, 3)
const IRIS = ell(12, 10.25, 1.8, 1.8)
const PUPIL = ell(12, 10.25, 0.95, 0.95)
const LIGHT = ell(12.7, 9.55, 0.45, 0.45)
const MOUTH = 'M7.75 15.25C10.5 16.25 13.5 16.25 16.25 15.25C15.5 18 13.75 18.75 12 18.75C10.25 18.75 8.5 18 7.75 15.25Z'
const FANGS = 'M9 15.63L10.65 15.92L9.9 18Z' + 'M15 15.63L13.35 15.92L14.1 18Z'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 6.9, 0, 16.9, [stop(0, 'c1', 0.5), stop(1, 'c1', 0.82)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(BODY, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: M(ARMS, dy), stroke: col('shadow'), 'stroke-width': T.SW + 0.3 + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  // stubby arms (the S plate): accent over an ink underline, angled down and out from under the body sides
  out.push(['path', { d: M(ARMS), stroke: col('ink'), 'stroke-width': T.SW + 0.3, class: 'wm-s' }])
  out.push(['path', { d: M(ARMS), stroke: col('accent'), 'stroke-opacity': 0.85, 'stroke-width': T.SW + 0.3, class: 'wm-s' }])
  // the body: fur tone over the shine, deep outline
  out.push(['path', { d: M(BODY), fill: col('shine') }])
  out.push(['path', { d: M(BODY), fill: `url(#${id(2)})` }])
  out.push(['path', { d: M(BODY), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the one big eye (the blinking A part): white, palette iris, ink pupil, catch-light
  out.push(['path', { d: M(EYE), fill: col('shine'), stroke: col('shadow'), 'stroke-width': 0.8, class: 'wm-a' }])
  out.push(['path', { d: M(IRIS), fill: col('c1'), class: 'wm-a' }])
  out.push(['path', { d: M(PUPIL), fill: col('ink'), class: 'wm-a' }])
  out.push(['path', { d: M(LIGHT), fill: col('shine'), class: 'wm-a' }])
  // the open grin with two fangs
  out.push(['path', { d: M(MOUTH), fill: col('ink'), stroke: col('ink'), 'stroke-width': 0.4 }])
  out.push(['path', { d: M(FANGS), fill: col('shine'), stroke: col('shine'), 'stroke-width': 0.25 }])
  return out
}
