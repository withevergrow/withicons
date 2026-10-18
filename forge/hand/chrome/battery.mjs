// forge/hand/chrome/battery.mjs — a heavy chrome battery case with a clear window and two tall gunmetal charge cells,
// each ringed by a dark seam, plus a gunmetal terminal nub tucked behind the case. The generated case was a thin pale
// rim and its cells two small grey ticks, so on white the charge all but disappeared. Same model and paint as the
// generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

// a skeleton in the shape model() expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const CASE = 'M4 7H17A2 2 0 0 1 19 9V15A2 2 0 0 1 17 17H4A2 2 0 0 1 2 15V9A2 2 0 0 1 4 7Z'
const NUB = 'M21.5 10.5V13.5'
// the window, with the two cells' seats left standing as islands (even-odd): each seat is its cell plus a seam
const WINDOW = 'M4.5 8.5H16.5A.75 .75 0 0 1 17.25 9.25V14.75A.75 .75 0 0 1 16.5 15.5H4.5A.75 .75 0 0 1 3.75 14.75V9.25A.75 .75 0 0 1 4.5 8.5Z'
const seat = x => `M${x - 1.9} 9.3H${x + 1.9}V14.7H${x - 1.9}Z`
// the cells: cores the gunmetal tube (2.25 wide) inflates to 3 x 4.6 bars
const cell = x => `M${x - 0.38} 10.82H${x + 0.38}V13.18H${x - 0.38}Z`
const X = [6.4, 11]

export default function render(icon) {
  const name = (icon && icon.name) || 'battery'
  const Ls = layers(model(skeleton(name, [
    { d: CASE, plate: 'K', fill: true },
    { d: NUB, plate: 'A' },
    { d: X.map(cell).join(''), plate: 'A' },
  ], [WINDOW + X.map(seat).join('')])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
