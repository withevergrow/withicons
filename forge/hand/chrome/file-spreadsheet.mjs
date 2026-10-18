// forge/hand/chrome/file-spreadsheet.mjs — a polished chrome page with a dog-eared fold and a 2 x 2 table window
// cut clean through its lower half: four big cells parted by one fat chrome cross. The generated drawing laid three
// gunmetal grid rods with parting gaps and seams over five cut cells, which tangled into knots at 24 and 16px.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col } from '../../styles/_chrome-core.mjs'

const PAGE = 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z'
const FOLD = 'M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19'
const GROOVE = 'M14 1.5V6A1.5 1.5 0 0 0 15.5 7.5H20.5'
// the table: two columns (a narrow key column, a wide value column) by two rows
const CELLS = [
  'M7 11.25H10V14.5H7Z',
  'M12 11.25H17V14.5H12Z',
  'M7 16.5H10V19.5H7Z',
  'M12 16.5H17V19.5H12Z',
]

function skeleton(name) {
  const paths = [{ id: 'p0', d: PAGE, plate: 'K' }, { id: 'p1', d: FOLD, plate: 'A' }]
    .map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  const cut = d => ({ d, subs: parsePath(d) })
  return {
    name, paths, fills: [fill(PAGE)], cutouts: [cut(GROOVE), ...CELLS.map(cut)],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'file-spreadsheet'
  const Ls = layers(model(skeleton(name)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  // the cells are recessed windows: a soft dark inner wall under each top edge (the table part, wm-a, so the
  // motion spec's grid "fill" still has a part to play on)
  const tf = (x, y) => [r2((x - 12) * 0.88 + 11.8), r2((y - 12) * 0.88 + 11.45)]
  const walls = CELLS.map(d => {
    const n = d.match(/-?[\d.]+/g).map(Number)
    const [x0, y0] = tf(n[0], n[1]), [x1] = tf(n[2], n[1])
    return `M${r2(x0 + 0.15)} ${y0}H${r2(x1 - 0.15)}Q${r2(x1 - 0.15)} ${r2(y0 + 0.55)} ${r2(x1 - 0.7)} ${r2(y0 + 0.55)}H${r2(x0 + 0.7)}Q${r2(x0 + 0.15)} ${r2(y0 + 0.55)} ${r2(x0 + 0.15)} ${y0}Z`
  }).join('')
  out.push(['path', { d: walls, fill: col('shadow'), 'fill-opacity': 0.32, class: 'wm-a' }])
  return out
}
const r2 = v => Math.round(v * 100) / 100
