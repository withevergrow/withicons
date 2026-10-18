// forge/hand/chrome/arrow-up-left.mjs — the diagonal arrow as two polished chrome pieces instead of a pale gunmetal
// corner hidden behind the shaft: a fat chrome shaft runs up-left and tucks under a chrome arrowhead that sits in front
// of it (its dark edge draws the joint), so the head leads at full contrast and stays a separate wm-a part for its
// nudge. Same model and paint as the generator (_chrome-core.mjs); only the pieces and their order are drawn here.
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
  const name = (icon && icon.name) || 'arrow-up-left'
  const shaft = piece(name, ['M17.5 17.5 L9.25 9.25'])
  const head = piece(name, ['M15.75 6.5 H6.5 V15.75'])
  for (const L of shaft.list) if (!L.cls) L.cls = 'wm-k'
  for (const L of head.list) L.cls = 'wm-a'
  // the glint: a small star tucked inside the head's corner (the generated one overhangs the rim)
  const glint = ['path', { d: star(7.35, 7.1, 1.15), fill: col('shine'), class: 'wm-a' }]
  return emit({ list: [...shaft.list, ...head.list], glint }, name, 0)
}
