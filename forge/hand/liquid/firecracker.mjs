// forge/hand/liquid/firecracker.mjs: a tall banded cracker, a curved fuse and a bold spark burst at its tip.
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
  const name = (icon && icon.name) || 'firecracker'
  const body = 'M9.5 9 A1.25 1.25 0 0 1 10.75 7.75 H13.25 A1.25 1.25 0 0 1 14.5 9 V21 A1.25 1.25 0 0 1 13.25 22.25 H10.75 A1.25 1.25 0 0 1 9.5 21 Z'
  return hairline(build(synth(name, [
    [body, 'K'],
    ['M9.5 12 H14.5', 'S'], ['M9.5 18 H14.5', 'S'],
    ['M12 7.75 C12 5.5 14.5 6.5 15 4.75 C15.25 4 15.75 3.75 16.5 3.75', 'A'],
    ['M18 0.75 V2', 'S'], ['M21.25 3.75 H19.75', 'S'], ['M20.25 1.25 L19.25 2.25', 'S'], ['M20.25 6.25 L19.25 5.25', 'S'], ['M18 6.75 V5.5', 'S'],
  ], [body])), 0.42)
}
