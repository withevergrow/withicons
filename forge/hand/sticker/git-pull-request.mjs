// forge/hand/sticker/git-pull-request.mjs — the return arrow as a candy tube with a bigger, open arrowhead and no
// sparkle beside it; replaces the generated drawing, where a sparkle sat right next to the small arrowhead and the
// arrow lost its lead at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_sticker-core.mjs'

const prep = (icon, raw) => {
  const paths = raw.paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { ...icon, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`
const firstXY = d => d.match(/-?\d*\.?\d+/g).slice(0, 2).map(Number)

export default function render(icon) {
  const A = disc(5, 6, 3), B = disc(5, 18, 3), C = disc(19, 18, 3)
  const nodes = build(prep(icon, {
    paths: [
      { d: A, plate: 'K' }, { d: B, plate: 'K' }, { d: C, plate: 'K' },
      { d: 'M5 9 V15', plate: 'K' },
      { d: 'M11.75 6 H17 A2 2 0 0 1 19 8 V15', plate: 'K' },
      { d: 'M15 2.75 L11.75 6 L15 9.25', plate: 'K' },
    ],
    fills: [A, B, C],
  }))
  // keep the low-left sparkle; drop the top-right one that crowds the arrowhead
  return nodes.filter(n => !(n[1].class === 'wm-deco' && firstXY(n[1].d)[0] > 12 && firstXY(n[1].d)[1] < 12))
}
