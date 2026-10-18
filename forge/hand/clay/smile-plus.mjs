// forge/hand/clay/smile-plus.mjs — a plump pink clay face with two dark glossy dot eyes and a thin smile arc pressed in
// ink, and the violet candy plus badge at the top right. The generator turned the smile into a fat yellow clay tube that
// read as a banana lip; here the mouth is a fine ink arc and the eyes are pits, so it reads as a smiley at 16px. Same
// model, light and colour as the generator (_clay-core.mjs); the eyes come from the model, the smile is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'
import { colorsFor } from '../../styles/_clay-color.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (x, y, rx, ry = rx) => `M${x - rx} ${y}A${rx} ${ry} 0 1 0 ${x + rx} ${y}A${rx} ${ry} 0 1 0 ${x - rx} ${y}Z`
const r2 = n => Math.round(n * 100) / 100
const FACE = disc(10.5, 13.5, 8)

export default function render(icon) {
  const name = (icon && icon.name) || 'smile-plus'
  const sk = skeleton(name, [
    { d: FACE, plate: 'K', fill: true },
    { d: 'M20 2V6', plate: 'S' },
    { d: 'M18 4H22', plate: 'S' },
  ], [disc(7.6, 11.4, 1.05, 1.3), disc(13.4, 11.4, 1.05, 1.3)])
  const nodes = build(sk)
  if (!nodes) return nodes
  const { col } = colorsFor(sk)
  const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
  // the smile: an ink arc with a lit lip under it (pressed in)
  const [ax, ay] = tf(6.9, 15.3), [bx, by] = tf(14.1, 15.3), R = r2(3.6 * K.SCALE)
  const arc = (dy) => `M${ax} ${r2(ay + dy)}A${R} ${R} 0 0 0 ${bx} ${r2(by + dy)}`
  nodes.push(['path', { d: arc(0.28), fill: 'none', stroke: col('shine'), 'stroke-opacity': 0.5, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }])
  nodes.push(['path', { d: arc(0), fill: 'none', stroke: col('ink'), 'stroke-width': 0.85, 'stroke-linecap': 'round', class: 'wm-k' }])
  return nodes
}
