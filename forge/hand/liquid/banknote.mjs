// forge/hand/liquid/banknote.mjs — a clear glass bill with one big violet-glass medallion in the middle and a small violet dot on each side, the line version drawn in liquid. The generated bill stacked three bubble rings in the centre and read as a gear; here the medallion is a single solid coloured disc. Painted with the style own glass recipe (_liquid-core build); only the geometry is drawn here.
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

const BILL = 'M4 5.5H20A2 2 0 0 1 22 7.5V16.5A2 2 0 0 1 20 18.5H4A2 2 0 0 1 2 16.5V7.5A2 2 0 0 1 4 5.5Z'
const COIN = 'M14.5 12A2.5 2.5 0 1 1 9.5 12A2.5 2.5 0 1 1 14.5 12Z'
const DOTS = 'M5.75 12H6.25M17.75 12H18.25'
export default function render(icon) {
  const name = (icon && icon.name) || 'banknote'
  const nodes = build(model(name, [[BILL, 'K'], [COIN, 'A'], [DOTS, 'A']], [BILL, COIN]))
  if (!nodes) return null
  // coloured glass a step denser, so the marks hold against the clear slab at 16px
  const g1 = `wg-liquid-${name}-1`
  return nodes.map(n => n[0] !== 'defs' ? n : ['defs', {}, n[2].map(g => g[1].id !== g1 ? g
    : [g[0], g[1], g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.55, 0.95][i] }])])])
}
