// forge/hand/chrome/tombstone.mjs — a slim arched headstone in polished chrome with a gunmetal cross inlaid in its
// face, standing on a separate gunmetal plinth step. The generated stone was a heavy blob with a stubby "=" plate and
// a base that merged into it; here the tall arch is the silhouette, the cross says grave at 16px, and the plinth is a
// second metal so the step reads clearly. Same model and paint as the generator (_chrome-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

// the stone: straight sides, a full semicircular arch
const STONE = 'M7.25 18.5V9.25A4.75 4.75 0 0 1 16.75 9.25V18.5Z'
// the plinth step under it, wider than the stone
const BASE = 'M4.25 19.6H19.75A1 1 0 0 1 20.75 20.6A1 1 0 0 1 19.75 21.6H4.25A1 1 0 0 1 3.25 20.6A1 1 0 0 1 4.25 19.6Z'
// the cross inlaid in the face
const CROSS = 'M12 7.3V14.6M9.1 10.1H14.9'

export default function render(icon) {
  const name = (icon && icon.name) || 'tombstone'
  const Ls = layers(model(skeleton(name, [
    { d: STONE, plate: 'K', fill: true },
    { d: BASE, plate: 'A', fill: true },
    { d: CROSS, plate: 'A' },
  ])))
  return emit(Ls, name, 0)
}
