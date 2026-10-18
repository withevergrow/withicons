// forge/hand/liquid/firecracker-string.mjs: a sagging cord, three separate crackers on short ties, spark ticks below.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function synth(name, paths, fills = [], cutouts = []) {
  const ps = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  return {
    name, paths: ps,
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
    cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
  }
}
function hairline(nodes, hair) {
  for (const n of nodes) if (n[0] !== 'defs' && n[1].stroke === 'currentColor') n[1]['stroke-opacity'] = hair
  return nodes
}

const cr = (x, y) => 'M' + (x - 1.5) + ' ' + (y + 1) + ' A1 1 0 0 1 ' + (x - 0.5) + ' ' + y + ' H' + (x + 0.5) + ' A1 1 0 0 1 ' + (x + 1.5) + ' ' + (y + 1) + ' V' + (y + 6) + ' A1 1 0 0 1 ' + (x + 0.5) + ' ' + (y + 7) + ' H' + (x - 0.5) + ' A1 1 0 0 1 ' + (x - 1.5) + ' ' + (y + 6) + ' Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'firecracker-string'
  const C = [[5, 6.5], [12, 8], [19, 6.5]]
  const paths = [['M2 2.75 Q12 7.75 22 2.75', 'A']]
  for (const [x, y] of C) {
    paths.push([cr(x, y), 'K'], ['M' + x + ' ' + (y - 1.5) + ' V' + y, 'A'])
    paths.push(['M' + x + ' ' + (y + 9.5) + ' V' + (y + 11), 'S'])
  }
  return hairline(build(synth(name, paths, C.map(([x, y]) => cr(x, y)))), 0.42)
}
