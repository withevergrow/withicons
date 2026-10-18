// forge/hand/gloss/tooth-crown.mjs — a glossy molar crown lifted off its tooth: the cap has a concave underside that
// echoes the tooth's domed stump, so a clear 2.25u arched gap separates the two and the crown reads as a cap.
// The generated drawing left a hairline slot between two flat slabs, so crown and tooth fused into one black blob.
// Same inflated vinyl recipe as the generator (forge/styles/gloss.mjs models and lights each part); only the shapes
// are redrawn: crown (wm-k) and tooth (wm-a, the part the motion spec pulses from 12,21) are separate pillows.
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

// the cap: two cusps on top, its underside arched up to fit over the stump
const CROWN = 'M4.25 9.5 C3.5 6.75 4 4.25 6.5 3.25 C8.25 2.5 10.25 3 12 4.25 C13.75 3 15.75 2.5 17.5 3.25 ' +
  'C20 4.25 20.5 6.75 19.75 9.5 C19.6 10.25 19 10.6 18.4 10.4 C16.25 9.6 14 9 12 9 C10 9 7.75 9.6 5.6 10.4 ' +
  'C5 10.6 4.4 10.25 4.25 9.5 Z'
// the tooth: domed stump, two roots with an open notch between them
const TOOTH = 'M5.75 12.9 C8 12 10 11.25 12 11.25 C14 11.25 16 12 18.25 12.9 C18 15.5 17.5 17.5 17 19 ' +
  'C16.75 20.25 16.25 21 15.5 21 C14.5 21 14 19.75 13.75 18.5 C13.5 17.25 12.85 16 12 16 C11.15 16 10.5 17.25 10.25 18.5 ' +
  'C10 19.75 9.5 21 8.5 21 C7.75 21 7.25 20.25 7 19 C6.5 17.5 6 15.5 5.75 12.9 Z'

const tag = (nodes, cls) => nodes.map(([t, a]) => [t, { ...a, class: cls }])

export default function render(icon) {
  const name = (icon && icon.name) || 'tooth-crown'
  return [
    ...tag(gloss.render(prep(name, [], [CROWN])), 'wm-k'),
    ...tag(gloss.render(prep(name, [], [TOOTH])), 'wm-a'),
  ]
}
