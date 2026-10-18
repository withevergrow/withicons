// forge/hand/chrome/arrow-up-down.mjs — the double-headed vertical arrow as two polished chrome pieces: one continuous
// chrome shaft, with an up chevron and a down chevron sitting in front of it at the two ends (their dark edge draws the
// joint). The generated drawing split the shaft with a gap at each head and read as a pipe with a slot; here the shaft
// runs unbroken from tip to tip and the two heads are one wm-a part for the pulse. Same model and paint as the
// generator (_chrome-core.mjs); only the pieces and their order are drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { model, layers, emit, col } from '../../styles/_chrome-core.mjs'

const f = v => String(Math.round(v * 100) / 100)
const star = (x, y, r, w = 0.28) =>
  `M${f(x)} ${f(y - r)}Q${f(x + w)} ${f(y - w)} ${f(x + r)} ${f(y)}Q${f(x + w)} ${f(y + w)} ${f(x)} ${f(y + r)}` +
  `Q${f(x - w)} ${f(y + w)} ${f(x - r)} ${f(y)}Q${f(x - w)} ${f(y - w)} ${f(x)} ${f(y - r)}Z`

// one chrome piece from skeleton lines (a pure line drawing: the style inflates it into a tube)
function piece(name, ds) {
  const paths = ds.map((d, i) => ({ id: 'p' + i, d, plate: 'K', subs: parsePath(d) }))
  return layers(model({ name, paths, fills: [], cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: 'K', pathId: p.id }))) }))
}

export default function render(icon) {
  const name = (icon && icon.name) || 'arrow-up-down'
  const shaft = piece(name, ['M12 4.5 V19.5'])
  const heads = piece(name, ['M6.9 8.6 L12 3.5 L17.1 8.6', 'M6.9 15.4 L12 20.5 L17.1 15.4'])
  for (const L of shaft.list) if (!L.cls) L.cls = 'wm-k'
  for (const L of heads.list) L.cls = 'wm-a'
  // the glint tucked inside the upper head, clear of the rim
  const glint = ['path', { d: star(10.7, 5.9, 1), fill: col('shine'), class: 'wm-a' }]
  return emit({ list: [...shaft.list, ...heads.list], glint }, name, 0)
}
