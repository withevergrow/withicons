// forge/hand/liquid/files.mjs: a clear back sheet (an L of glass peeking out top-left) and a front page with a dog-ear fold.
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

export default function render(icon) {
  const name = (icon && icon.name) || 'files'
  const page = 'M15 5.5 H9 A2 2 0 0 0 7 7.5 V19.5 A2 2 0 0 0 9 21.5 H17 A2 2 0 0 0 19 19.5 V9.5 Z'
  const back = 'M3.5 4 A2 2 0 0 1 5.5 2 H14 A1.5 1.5 0 0 1 14 4.25 H7 A1.25 1.25 0 0 0 5.75 5.5 V17 A1.13 1.13 0 0 1 3.5 17 Z'
  const fold = 'M15 5.5 V8 A1.5 1.5 0 0 0 16.5 9.5 H19'
  return hairline(build(synth(name, [[page, 'K'], [back, 'A'], [fold, 'A']], [page, back], [fold])), 0.42)
}
