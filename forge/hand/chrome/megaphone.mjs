// forge/hand/chrome/megaphone.mjs — one continuous polished chrome horn flaring to a tall mouth, with its grip fused
// underneath as part of the same casting, and a solid gunmetal collar at the throat. The generated drawing dropped the
// grip and cut the throat as a thin groove, so the horn read as a plain wedge or a speaker; horn, grip and collar
// together say "megaphone" at 16px. Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const HORN = 'M2.5 11A2 2 0 0 1 4.5 9H8L17.5 3.75Q20.5 2.25 20.5 5.5V18.5Q20.5 21.75 17.5 20.25L8 15H4.5A2 2 0 0 1 2.5 13Z'
const GRIP = 'M7 14.5V19.25A1.75 1.75 0 0 0 8.75 21H9.25A1.75 1.75 0 0 0 11 19.25V15.5Z'
const COLLAR = 'M8.75 9.75V14.25'

function skeleton(name) {
  const paths = [
    { id: 'p0', d: HORN, plate: 'K' }, { id: 'p1', d: GRIP, plate: 'A' }, { id: 'p2', d: COLLAR, plate: 'A' },
  ].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(HORN), fill(GRIP)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'megaphone'
  return emit(layers(model(skeleton(name))), name, 0)
}
