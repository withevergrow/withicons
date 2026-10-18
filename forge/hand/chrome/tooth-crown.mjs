// forge/hand/chrome/tooth-crown.mjs — a clean molar: a broad polished chrome crown with two soft cusps and a
// valley between them, sitting on two gunmetal roots that taper to points. The generated tooth was a lumpy cap on a
// chrome-merged root block; here the crown is a smooth bell, the two roots are a second metal so the crown/root
// split reads at once, and the silhouette is the plain molar everyone knows. Same model and paint as the generator
// (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

// crown: two rounded cusps joined by a shallow valley, full sides, a gently curved neck line
const CROWN = 'M4.6 7.4C4.6 4.6 6.4 3.1 8.5 3.1C10.1 3.1 11.2 3.9 12 4.6C12.8 3.9 13.9 3.1 15.5 3.1C17.6 3.1 19.4 4.6 19.4 7.4C19.4 9.6 18.6 11 17.8 12.2C15.2 13 8.8 13 6.2 12.2C5.4 11 4.6 9.6 4.6 7.4Z'
// the two roots, tucked behind the crown and tapering to points
const ROOTS = 'M6.6 11.5H17.4C17.4 14.4 17.1 17.4 16.4 19.8C16 21.2 14.9 21.4 14.2 20.5C13.5 19.5 12.8 16.6 12 16.6C11.2 16.6 10.5 19.5 9.8 20.5C9.1 21.4 8 21.2 7.6 19.8C6.9 17.4 6.6 14.4 6.6 11.5Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'tooth-crown'
  const Ls = layers(model(skeleton(name, [
    { d: ROOTS, plate: 'A', fill: true },
    { d: CROWN, plate: 'K', fill: true },
  ])))
  return emit(Ls, name, 0)
}
