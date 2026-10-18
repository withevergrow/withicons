// forge/hand/chrome/black-cat.mjs — an arched chrome cat in the common pose: head with two ears and eyes on the right, the back arched over two legs, and a gunmetal tail curling up on the left.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate || 'K', pathId: p.id }))) }
}
const oval = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`
const run = (name, parts, cuts) => emit(layers(model(skeleton(name, parts, cuts))), name, 0)

const CAT = 'M6 21C6 18 5.5 15 6 12.5C7 9 9 6.5 11.5 6.5C13 6.5 14 7.25 14.75 8C14.75 6.5 15 5.25 15.2 2.7L17.25 5.75H18.75L20.8 2.7C21 5.25 21.25 6.5 21.25 8C21.25 10.5 20 12 18 12.25C17.5 12.5 17.25 13 17.25 13.75L17.5 21H15.25L15 16.25C13.5 14.25 10 14.25 8.25 16.25L8 21Z'
const TAIL = 'M6 13.5C3.25 12.5 2.5 9 3.5 6.5C4 5.25 3.75 4 2.5 3.5'
export default function render(icon) {
  const name = (icon && icon.name) || 'black-cat'
  return run(name, [{ d: CAT, fill: true }, { d: TAIL, plate: 'A' }], [oval(16.4, 9.1, 0.8, 1.25), oval(19.6, 9.1, 0.8, 1.25)])
}
