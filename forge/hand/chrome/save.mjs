// forge/hand/chrome/save.mjs: a chrome floppy disk in three plain reads, a chamfered polished body with its mirror
// horizon, a solid gunmetal shutter with one slot across the top, and a wide label window below. The generated
// drawing made the shutter and label into gunmetal tube frames, so the dark seams knotted together and at 16px the
// disk read as a busy grille.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const BODY = 'M5 3H15.75L21 8.25V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z'
const SHUTTER = 'M8.25 4.5H14.25A.75 .75 0 0 1 15 5.25V7.5A.75 .75 0 0 1 14.25 8.25H8.25A.75 .75 0 0 1 7.5 7.5V5.25A.75 .75 0 0 1 8.25 4.5Z'
const SLOT = 'M12.75 5.6V7.15'
const LABEL = 'M8 13H16A1.5 1.5 0 0 1 17.5 14.5V18.5H6.5V14.5A1.5 1.5 0 0 1 8 13Z'

function skeleton(name) {
  const paths = [[BODY, 'K'], [SHUTTER, 'A']].map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(BODY), fill(SHUTTER)], cutouts: [SLOT, LABEL].map(d => ({ d, subs: parsePath(d) })),
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'save'
  return emit(layers(model(skeleton(name))), name, 0)
}
