// forge/hand/liquid/file-spreadsheet.mjs — the clear glass page with its folded corner and a table of four coloured
// glass cells set into its lower half (a narrow key column and a wide value column, two rows). The generated drawing
// built the grid from three crossing tubes plus four cut cells, so every crossing piled rims, moats and refraction bands
// together and the table tangled into knots at 24 and 16px; here the grid is the clean gaps between four fat rounded
// cells, which read as a spreadsheet at any size. Same glass recipe as the generator (_liquid-core.mjs build); only the
// geometry is drawn here. The cells and fold are the A part (wm-a) for the spec's parts.A fill.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const PAGE = 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z'
const FOLD = 'M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19'
// cells (x 7-10.25 | 11.75-17, y 10-14 | 15.5-19.5) with 0.6u corners: each is filled as its own rect, with a centre ring
// inset by the coloured glass's half-width so the A stroke grown round it lands on the rect's edge (and votes the fill A)
const rr = (x0, y0, x1, y1, r = 0.6) =>
  `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}` +
  `H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
const rect = (x0, y0, x1, y1) => `M${x0} ${y0}H${x1}V${y1}H${x0}Z`
const BOX = [[7, 12.5, 10.25, 15.9], [11.75, 12.5, 17, 15.9], [7, 17, 10.25, 20.25], [11.75, 17, 17, 20.25]]
// accent header row (S bead, like file-pdf's label): centre ring grown ~1.25u to about x 7-17, y 8.4-11.6
const HEAD = 'M8.25 9.75H15.75V10.25H8.25Z'
const IN = 1.35
const CELLS = BOX.map(b => rr(...b))
const RINGS = BOX.map(([x0, y0, x1, y1]) => rect(x0 + IN, y0 + IN, x1 - IN, y1 - IN))

function skeleton(name) {
  const paths = [
    { id: 'p0', d: PAGE, plate: 'K' }, { id: 'p1', d: FOLD, plate: 'A' }, { id: 'h', d: HEAD, plate: 'S' },
    ...RINGS.map((d, i) => ({ id: 'c' + i, d, plate: 'A' })),
  ].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(PAGE), fill(HEAD), ...CELLS.map(fill)], cutouts: [{ d: FOLD, subs: parsePath(FOLD) }],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  return build(skeleton((icon && icon.name) || 'file-spreadsheet'))
}
