// forge/hand/bento/witch-hat.mjs — a bento witch hat: a bent cone drawn as one closed outline that sits on the brim (no
// open stroke ends, so no nubs over the brim edge), a full-width band at its base with a small framed buckle and lit
// hole, and a cone shaded deeper toward the brim so cone and brim separate at 16px.
// Recipe = the generated bento: tinted squircle tile, soft drop shadow, pale c1 duotone masses under deep strokes,
// A parts as c1 over the deep shade, S parts as accent over the ink. Drawn on the 24 grid, scaled like the generator.
import { mapPath } from '../../styles/_bento-path.mjs'
import { squircle, col, T } from '../../styles/_bento-core.mjs'

const NAME = 'witch-hat'
const id = n => `wg-bento-${NAME}-${n}`, url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const ty = y => +(T.CY + (y - 12) * T.S).toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, s) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, s]
const CLS = { K: undefined, A: 'wm-a', S: 'wm-s' }

// layers: ['m', d, tone, plate] mass (K pale gradient, C cone gradient, D / X solid A / S colour, W lit pane),
// ['l', d, tone, plate] line
function bento(layers) {
  const out = [['defs', {}, [
    lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
    lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
    lin(2, 0, ty(5), 0, ty(21), [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
    // the cone: pale at the tip, deepening toward the brim so it stands off the brim's paler top
    lin(3, 0, ty(6), 0, ty(15.5), [stop(0, 'c1', 0.28), stop(1, 'c1', 0.74)]),
  ]]]
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  out.push(['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }])
  out.push(['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }])
  out.push(['path', { d: 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62', stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }])
  const fd = layers.filter(l => l[0] === 'm' && l[2] !== 'W').map(l => l[1]), sd = layers.filter(l => l[0] === 'l').map(l => l[1])
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: fd.map(d => M(d, dy)).join(''), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: sd.map(d => M(d, dy)).join(''), stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  for (const [k, d0, tone, pl = 'K'] of layers) {
    const d = M(d0), c = CLS[pl], a = o => (c ? { ...o, class: c } : o)
    if (k === 'm') {
      if (tone === 'W') { out.push(['path', a({ d, fill: col('shine'), 'fill-opacity': 0.9 })]); continue }
      if (tone === 'D') { out.push(['path', a({ d, fill: col('shadow') })], ['path', a({ d, fill: col('c1'), 'fill-opacity': 0.72 })]); continue }
      if (tone === 'X') { out.push(['path', a({ d, fill: col('ink') })], ['path', a({ d, fill: col('accent'), 'fill-opacity': 0.85 })]); continue }
      out.push(['path', a({ d, fill: col('shine') })])
      out.push(['path', a({ d, fill: url(tone === 'C' ? 3 : 2) })])
    } else out.push(['path', a({ d, stroke: col('shadow'), 'stroke-width': T.SW })])
  }
  return out
}

// brim: a wide flat ellipse; the cone stands on it in front of its back edge
const BRIM = 'M2.5 18.25C2.5 16.75 6.75 15.5 12 15.5C17.25 15.5 21.5 16.75 21.5 18.25C21.5 19.75 17.25 21 12 21C6.75 21 2.5 19.75 2.5 18.25Z'
// cone: one closed outline, bent tip to the right, its base a front arc on the brim (no open ends)
const CONE = 'M6.75 17.25L10.25 7.5C11.25 4.75 14.75 3.25 18.5 5.25C16 5.5 14.25 6.75 14.25 9L17.25 17.25C15.5 18.25 8.5 18.25 6.75 17.25Z'
// band: a solid strip over the cone's base, full width between the sides (fill only: the cone outline closes it)
const BAND = 'M8.01 13.75C9.75 14.5 14.25 14.5 15.98 13.75L17.25 17.25C15.5 18.25 8.5 18.25 6.75 17.25Z'
// buckle: a small framed ring with a lit hole, centred on the band
const BUCKLE = 'M11.15 14.25H12.85Q13.5 14.25 13.5 14.9V16.6Q13.5 17.25 12.85 17.25H11.15Q10.5 17.25 10.5 16.6V14.9Q10.5 14.25 11.15 14.25Z'
const HOLE = 'M11.45 15.2H12.55V16.3H11.45Z'

export default function render() {
  return bento([
    ['m', BRIM, 'K'], ['l', BRIM, 'K'],
    ['m', CONE, 'C'],
    ['m', BAND, 'D', 'A'],
    ['l', CONE, 'K'],
    ['m', BUCKLE, 'X', 'S'], ['m', HOLE, 'W', 'S'],
  ])
}
