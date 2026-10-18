// forge/hand/liquid/percent.mjs — the percent sign as glass: a fat clear-glass slash between two violet glass beads.
// The generated slash was the recipe's plain 2.6u tube in barely tinted glass, so on white it thinned to a pale
// hairline next to the dense beads and at 16px the sign read as two dots. Here the slash is a 3.5u bar with a denser
// tint and a firmer edge, so slash and beads carry equal weight. Painted with the style's own glass recipe
// (_liquid-core build); only the geometry is drawn here.
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

const SLASH = 'M19 5L5 19'
// a 0.9u stadium along the slash: with the recipe's 2.6u tube the bar is 3.5u wide, ends fully round
const BAR = 'M19.32 5.32L5.32 19.32A0.45 0.45 0 0 1 4.68 18.68L18.68 4.68A0.45 0.45 0 0 1 19.32 5.32Z'
const TOP = 'M10 7A3 3 0 1 1 4 7A3 3 0 1 1 10 7Z'
const BOTTOM = 'M20 17A3 3 0 1 1 14 17A3 3 0 1 1 20 17Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'percent'
  const nodes = build(model(name, [[SLASH, 'K'], [TOP, 'A'], [BOTTOM, 'A']], [BAR, TOP, BOTTOM]))
  if (!nodes) return null
  const g0 = `wg-liquid-${name}-0`, g1 = `wg-liquid-${name}-1`
  const deeper = { [g0]: [0.3, 0.55, 0.8], [g1]: [0.42, 0.85] }
  return nodes.map(n => {
    if (n[0] === 'defs') {
      return ['defs', {}, n[2].map(g => deeper[g[1].id]
        ? [g[0], g[1], g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': deeper[g[1].id][i] }])]
        : g)]
    }
    const a = n[1]
    if (a['stroke-width'] === 0.22) return [n[0], { ...a, 'stroke-opacity': 0.5, 'stroke-width': 0.28 }]
    return n
  })
}
