// forge/hand/gloss/avatar-woman-hijab.mjs — a glossy hijab avatar like the gloss avatar family: one inflated hood and
// shoulders silhouette, the face set inside it by a single clean carved contour, dot eyes, a smile groove and the
// draped fold across the chest. The generated drawing stacked the hood's hole, the face's tube and two grooves into a
// black ring between white rings, so face and hood turned to mud. Same vinyl recipe as the generator
// (forge/styles/gloss.mjs models and lights it); only the skeleton is redrawn for this style.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

function prep(name, paths, fills = [], cutouts = []) {
  const P = paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const C = cutouts.map(d => ({ d, subs: parsePath(d) }))
  return {
    name, paths: P, fills: F, cutouts: C,
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

const HOOD = 'M4.5 21.5 C4.5 19.5 5.25 18 6.5 17 C4.75 15.25 4 13 4 10.5 C4 5.75 7.5 2.5 12 2.5 C16.5 2.5 20 5.75 20 10.5 ' +
  'C20 13 19.25 15.25 17.5 17 C18.75 18 19.5 19.5 19.5 21.5 Z'
// the face contour, carved as two open grooves (a closed sub would be cut out as a hole, not grooved)
const FACE_TOP = 'M7.25 11 C7.25 8 9.4 6.25 12 6.25 C14.6 6.25 16.75 8 16.75 11'
const FACE_LOW = 'M16.75 11 C16.75 14.1 14.6 16.4 12 16.4 C9.4 16.4 7.25 14.1 7.25 11'
const EYE_L = 'M10.4 10.6 A0.8 1 0 1 1 8.8 10.6 A0.8 1 0 1 1 10.4 10.6 Z'
const EYE_R = 'M15.2 10.6 A0.8 1 0 1 1 13.6 10.6 A0.8 1 0 1 1 15.2 10.6 Z'
const SMILE = 'M10.1 13.3 C11.1 14.25 12.9 14.25 13.9 13.3'
const DRAPE = 'M17.6 17.25 C15.25 19.1 12 20.1 9 21.6'

export default function render(icon) {
  const sk = prep((icon && icon.name) || 'avatar-woman-hijab', [], [HOOD], [FACE_TOP, FACE_LOW, EYE_L, EYE_R, SMILE, DRAPE])
  return gloss.render(sk).map(([t, a]) => [t, { ...a, class: a.class || 'wm-k' }])
}
