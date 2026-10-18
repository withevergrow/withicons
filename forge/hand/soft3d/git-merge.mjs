// forge/hand/soft3d/git-merge.mjs — two commits on a straight trunk and a branch that leaves the top
// commit's side and sweeps down into a third commit placed low on the right, well clear of the curve; replaces the generated
// drawing whose right node sat at mid height hugging the curve, so it read as a branch rather than a merge.
// Built with the style's own solid + light engine so it stays in the family.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import { build } from '../../styles/_soft3d-core.mjs'

const N1 = 'M9.25 5.5A2.75 2.75 0 1 1 3.75 5.5A2.75 2.75 0 1 1 9.25 5.5Z'
const N2 = 'M9.25 18.5A2.75 2.75 0 1 1 3.75 18.5A2.75 2.75 0 1 1 9.25 18.5Z'
const N3 = 'M20.5 14A2.75 2.75 0 1 1 15 14A2.75 2.75 0 1 1 20.5 14Z'
const RAW = {
  paths: [
    { d: N1, plate: 'K' }, { d: N2, plate: 'K' }, { d: N3, plate: 'K' },
    { d: 'M6.5 8V16', plate: 'K' },                                   // the trunk
    { d: 'M8.45 7.45C10 11.75 11.75 14 15 14', plate: 'K' },   // the merging branch, off the top commit
  ],
  fills: [N1, N2, N3],
  cutouts: [],
}

function prep(icon, raw) {
  const paths = raw.paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = raw.cutouts.map(d => ({ d, subs: parsePath(d) }))
  return { ...icon, paths, fills, cutouts,
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: unionSets(fills.map(f => f.set)) }
}

export default function render(icon) {
  const ic = prep(icon, RAW)
  let nodes = null
  for (const lite of [0, 1, 2, 3]) {
    nodes = build(ic, lite)
    if (nodes && JSON.stringify(nodes).length < 17000) break
  }
  return nodes
}
