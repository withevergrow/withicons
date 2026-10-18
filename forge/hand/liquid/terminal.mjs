// forge/hand/liquid/terminal.mjs — a clear glass window with a thick violet-glass prompt chevron and underscore cursor inlaid in it. The generated drawing cut thin loops out of the screen that blurred into it at 16px; here both marks are solid coloured glass strokes. Painted with the style own glass recipe (_liquid-core build); only the geometry is drawn here.
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

const WIN = 'M4 4H20A2 2 0 0 1 22 6V18A2 2 0 0 1 20 20H4A2 2 0 0 1 2 18V6A2 2 0 0 1 4 4Z'
const MARKS = 'M6.5 8.5L10 12L6.5 15.5M12.5 15.5H17.5'
export default function render(icon) {
  const name = (icon && icon.name) || 'terminal'
  const nodes = build(model(name, [[WIN, 'K'], [MARKS, 'A']], [WIN]))
  if (!nodes) return null
  // coloured glass a step denser, so the marks hold against the clear slab at 16px
  const g1 = `wg-liquid-${name}-1`
  return nodes.map(n => n[0] !== 'defs' ? n : ['defs', {}, n[2].map(g => g[1].id !== g1 ? g
    : [g[0], g[1], g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.55, 0.95][i] }])])])
}
