// forge/hand/chrome/copy-check.mjs — two chrome sheets with a big hot-pink check jewel. The back sheet is a darker
// gunmetal L behind, the front sheet a bright chrome slab with a clear dark seam where it overlaps; the check is one
// large closed jewel (bezel + enamel) so it reads at 16px instead of a hairline tick.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const FRONT = 'M12 10H19A2 2 0 0 1 21 12V19A2 2 0 0 1 19 21H12A2 2 0 0 1 10 19V12A2 2 0 0 1 12 10Z'
const BACK = 'M5.5 3.5H11.5A2 2 0 0 1 13.5 5.5V11.5A2 2 0 0 1 11.5 13.5H5.5A2 2 0 0 1 3.5 11.5V5.5A2 2 0 0 1 5.5 3.5Z'
// the check as a solid closed shape
const CHECK = 'M12.1 15.7L14 17.6L18.8 12.8L19.5 13.5L14 19L11.4 16.4Z'

function skeleton(name) {
  const parts = [{ d: FRONT, plate: 'K', fill: true }, { d: BACK, plate: 'A', fill: true }, { d: CHECK, plate: 'S' }]
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'copy-check'
  return emit(layers(model(skeleton(name))), name, 0)
}
