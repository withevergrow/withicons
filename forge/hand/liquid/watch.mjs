// forge/hand/liquid/watch.mjs — a wristwatch of liquid glass: a big clear round case that fills the frame, a wide violet-glass
// strap above and below (each parted from the case by a hairline gap) and two thick violet-glass hands on the dial. The
// case is a true circle, so it reads as a watch at 16px. Painted with the style's own glass recipe (_liquid-core build);
// only the geometry is drawn here (silhouettes are fills, so the case stays an exact circle).
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function model(name, paths, fills) {
  const P = paths.map(([d, plate], i) => ({ id: `p${i}`, d, plate, subs: parsePath(d) }))
  return {
    name, paths: P, cutouts: [],
    fills: fills.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}

const CASE = 'M19.6 12A7.6 7.6 0 1 1 4.4 12A7.6 7.6 0 1 1 19.6 12Z'
const STRAP_T = 'M8.2 5.42L8.7 2.6A1.2 1.2 0 0 1 9.9 1.6H14.1A1.2 1.2 0 0 1 15.3 2.6L15.8 5.42A7.6 7.6 0 0 0 8.2 5.42Z'
const STRAP_B = 'M8.2 18.58L8.7 21.4A1.2 1.2 0 0 0 9.9 22.4H14.1A1.2 1.2 0 0 0 15.3 21.4L15.8 18.58A7.6 7.6 0 0 1 8.2 18.58Z'
// plate markers: a ring just inside the case edge (clear), a short dash in each strap and the two hands (coloured)
const RING = 'M17 12A5 5 0 1 1 7 12A5 5 0 1 1 17 12Z'
const MARKS = 'M9.6 3.6H14.4M9.6 20.4H14.4'
const HANDS = 'M12 7.4V12L15.3 13.9'

export default function render(icon) {
  const name = (icon && icon.name) || 'watch'
  const nodes = build(model(name, [[RING, 'K'], [MARKS, 'A'], [HANDS, 'A']], [CASE, STRAP_T, STRAP_B]))
  return nodes || null
}
