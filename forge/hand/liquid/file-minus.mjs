// forge/hand/liquid/file-minus.mjs — the page with a clear "remove" sign: the generated minus was a thin violet pill
// in a moat that read as a button on a plain file, so the minus is a wide, 3.5u accent glass bar (the style's modifier
// bead colour) set in a moat across the lower page, under the coloured c2 fold. Same model and paint as the generator
// (_liquid-core.mjs); only the pieces change.
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
  const name = (icon && icon.name) || 'file-minus'
  const page = 'M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z'
  const nodes = build(synth(name, [
    [page, 'K'],
    ['M14 2.5 V6 A1.5 1.5 0 0 0 15.5 7.5 H19', 'A'],
    ['M9.25 14.75 H14.75', 'S'],
  ], [page, 'M9.25 13 H14.75 A1.75 1.75 0 0 1 14.75 16.5 H9.25 A1.75 1.75 0 0 1 9.25 13 Z'],
  ['M14 2.5 V6 A1.5 1.5 0 0 0 15.5 7.5 H19']))
  return hairline(nodes, 0.42)
}
