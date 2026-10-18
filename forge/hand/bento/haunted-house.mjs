// forge/hand/bento/haunted-house.mjs — a bento haunted house: a tall narrow pointed tower stands in front of a lopsided
// gabled house, so the silhouette can no longer pass for 'home'; a dark gothic slit in the tower, a solid pointed door
// (one mass, no seam) that stops inside the base line, and a slim accent crescent moon held clear of the roofs.
// Recipe = the generated bento: tinted squircle tile, soft drop shadow, pale c1 duotone masses under deep strokes,
// A parts as c1 over the deep shade, S parts as accent over the ink. Drawn on the 24 grid, scaled like the generator.
import { mapPath } from '../../styles/_bento-path.mjs'
import { squircle, col, T } from '../../styles/_bento-core.mjs'

const NAME = 'haunted-house'
const id = n => `wg-bento-${NAME}-${n}`, url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, s) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, s]
const CLS = { K: undefined, A: 'wm-a', S: 'wm-s' }

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
      if (tone === 'X') { out.push(['path', a({ d, fill: col('ink') })], ['path', a({ d, fill: col('accent'), 'fill-opacity': 0.8 })]); continue }
      out.push(['path', a({ d, fill: col('shine') })])
      out.push(['path', a({ d, fill: url(2) })])
    } else out.push(['path', a({ d, stroke: col('shadow'), 'stroke-width': T.SW })])
  }
  return out
}

// the house behind: a lopsided gable (apex right of centre, slopes of different pitch); its left side hides behind the tower
const HOUSE = 'M8.5 21H17.5A2 2 0 0 0 19.5 19V11.58L14 7.25L8.5 12Z'
const WALLS = 'M19.5 11.75V19A2 2 0 0 1 17.5 21H8.5'
const ROOF = 'M8 12.43L14 7.25L21 12.75'
// the tower in front: tall, narrow, a pointed spire with short eaves
const TOWER = 'M6 2L9.25 9.25H8.5V21H5.5A2 2 0 0 1 3.5 19V9.25H2.75Z'
// openings: solid dark masses, fill only (no matching stroke, so no seam); they end under the base line
const SLIT = 'M5.25 15.5V12.75C5.25 12 5.6 11.5 6 11C6.4 11.5 6.75 12 6.75 12.75V15.5Z'
const DOOR = 'M11.75 20.5V17.25C11.75 15.75 12.75 14.75 14 14.25C15.25 14.75 16.25 15.75 16.25 17.25V20.5Z'
const MOON = 'M18.95 2.02A2.6 2.6 0 1 0 21.78 5.22A2.15 2.15 0 0 1 18.95 2.02Z'

export default function render() {
  return bento([
    ['m', HOUSE, 'K'],
    ['m', DOOR, 'D', 'A'],
    ['l', WALLS, 'K'], ['l', ROOF, 'K'],
    ['m', TOWER, 'K'],
    ['m', SLIT, 'D', 'A'],
    ['l', TOWER, 'K'],
    ['m', MOON, 'X', 'S'],
  ])
}
