// forge/hand/bento/crystal-ball.mjs — a bento crystal ball: the orb with a glass glint, a slim concave four-point twinkle
// (fill only, so it can never thicken into a cross) and a small accent dot, seated in a solid cup on a solid plinth
// whose top edge carries one shine line, so the base reads at 16px and the orb no longer floats.
// Recipe = the generated bento: tinted squircle tile, soft drop shadow, pale c1 duotone masses under deep strokes,
// A parts as c1 over the deep shade, S parts as accent over the ink. Drawn on the 24 grid, scaled like the generator.
import { mapPath } from '../../styles/_bento-path.mjs'
import { squircle, col, T } from '../../styles/_bento-core.mjs'

const NAME = 'crystal-ball'
const id = n => `wg-bento-${NAME}-${n}`, url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, s) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, s]
const CLS = { K: undefined, A: 'wm-a', S: 'wm-s', deco: 'wm-deco' }

// layers: ['m', d, tone, plate] mass (K pale gradient, D / X solid A / S colour), ['l', d, tone, plate] line
function bento(layers) {
  const out = [['defs', {}, [
    lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
    lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
    lin(2, 0, +(T.CY - 7 * T.S).toFixed(2), 0, +(T.CY + 9 * T.S).toFixed(2), [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
  ]]]
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  out.push(['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }])
  out.push(['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }])
  out.push(['path', { d: 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62', stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }])
  const fd = layers.filter(l => l[0] === 'm').map(l => l[1]), sd = layers.filter(l => l[0] === 'l').map(l => l[1])
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: fd.map(d => M(d, dy)).join(''), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: sd.map(d => M(d, dy)).join(''), stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  for (const [k, d0, tone, pl = 'K'] of layers) {
    const d = M(d0), c = CLS[pl], a = o => (c ? { ...o, class: c } : o)
    if (k === 'm') {
      if (tone === 'D') { out.push(['path', a({ d, fill: col('shadow') })], ['path', a({ d, fill: col('c1'), 'fill-opacity': 0.72 })]); continue }
      if (tone === 'X') { out.push(['path', a({ d, fill: col('ink') })], ['path', a({ d, fill: col('accent'), 'fill-opacity': 0.85 })]); continue }
      out.push(['path', a({ d, fill: col('shine') })])
      out.push(['path', a({ d, fill: url(2) })])
    } else out.push(['path', a({ d, stroke: col('shadow'), 'stroke-width': T.SW })])
  }
  return out
}

const BALL = 'M18.75 9.25A6.75 6.75 0 1 1 5.25 9.25A6.75 6.75 0 1 1 18.75 9.25Z'
// the cup: a solid A-tone cradle whose top is the orb's own lower arc (the orb outline covers the join), seated on the plinth
const CUP = 'M8.75 15.17A6.75 6.75 0 0 0 15.25 15.17L15 18.5H9Z'
// the plinth: one solid rounded slab, fill only (no matching stroke, so no seams across it)
const PLINTH = 'M6.25 18.25H17.75A1.5 1.5 0 0 1 19.25 19.75V20.25A1.5 1.5 0 0 1 17.75 21.75H6.25A1.5 1.5 0 0 1 4.75 20.25V19.75A1.5 1.5 0 0 1 6.25 18.25Z'
const LEDGE = 'M6.5 19.15H17.5'
const GLINT = 'M7.77 7.71A4.5 4.5 0 0 1 9.75 5.35'
// the twinkle: slim four-point star, deeply concave sides, ~1u wide at the waist, 6u tall, a touch up-left of centre
const STAR = 'M11.75 5.75C11.9 7.85 12.2 8.5 14.25 8.75C12.2 9 11.9 9.65 11.75 11.75C11.6 9.65 11.3 9 9.25 8.75C11.3 8.5 11.6 7.85 11.75 5.75Z'
const DOT = 'M14.4 12.4A0.7 0.7 0 1 0 15.8 12.4A0.7 0.7 0 1 0 14.4 12.4Z'

export default function render() {
  const out = bento([
    ['m', PLINTH, 'D', 'A'],
    ['m', CUP, 'D', 'A'],
    ['m', BALL, 'K'], ['l', BALL, 'K'],
    ['m', STAR, 'X', 'S'],
    ['m', DOT, 'X', 'deco'],
  ])
  const at = d => mapPath(d, T.S, [12, 12], 0, T.CY - 12)
  // one deliberate shine line along the plinth's top edge, and the glass glint inside the orb's upper left
  out.push(['path', { d: at(LEDGE), stroke: col('shine'), 'stroke-width': 0.45, 'stroke-opacity': 0.7, class: 'wm-shine' }])
  out.push(['path', { d: at(GLINT), stroke: col('shine'), 'stroke-width': 0.6, 'stroke-opacity': 0.9, class: 'wm-shine' }])
  return out
}
