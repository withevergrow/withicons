// forge/hand/chrome/ring-box.mjs — a chrome ring box seen from the front: the open lid leans back behind, a big gunmetal band
// stands in the slot of the base in full view, and a large pink enamel diamond is set on top. The old drawing hid the band behind the gem and read as a stamp. Same model and paint as the generator (_chrome-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

// the open lid, hinged at the back and leaning away: a domed half-shell
const LID = 'M8 8H16A1.2 1.2 0 0 1 17.1 8.8L19.6 14.4A1 1 0 0 1 18.7 15.6H5.3A1 1 0 0 1 4.4 14.4L6.9 8.8A1.2 1.2 0 0 1 8 8Z'
// the box: a wide rounded block in front, with the ring slot as a groove across it
const BOX = 'M4.6 16.2H19.4A1.1 1.1 0 0 1 20.5 17.3V20.5A1.1 1.1 0 0 1 19.4 21.6H4.6A1.1 1.1 0 0 1 3.5 20.5V17.3A1.1 1.1 0 0 1 4.6 16.2Z'
const SEAM = 'M3.5 18.8H20.5'
// the ring band, standing in the slot: a full circle, lower half tucked behind the box
const RING = 'M12 6.6A5.1 5.1 0 1 1 12 16.8A5.1 5.1 0 1 1 12 6.6Z'
// the diamond sitting on the band: flat table, girdle, pointed pavilion
const GEM = 'M9.6 1.2H14.4L16.6 3.7L12 8L7.4 3.7Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'ring-box'
  const Ls = layers(model(skeleton(name, [
    { d: LID, plate: 'K', fill: true },
    { d: RING, plate: 'A' },
    { d: BOX, plate: 'K', fill: true },
    { d: GEM, plate: 'S', fill: true },
  ], [SEAM])))
  return emit(Ls, name, 0)
}
