// forge/hand/gloss/git-fork.mjs — a glossy fork: three round nodes on one U-shaped tube with a stem down to the root node.
// The generated drawing inflated r2.75 nodes so close to the bar that the top nodes melted into it (a Mickey blob);
// here the nodes are smaller (r2 + tube), the bar drops to y11.5 so short necks show under each top node, and the
// stem runs a clear 3u before the root node. Lit by the gloss renderer itself.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

function prep(name, paths, fills = [], cutouts = []) {
  const P = paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const C = cutouts.map(d => ({ d, subs: parsePath(d) }))
  return {
    name, paths: P, fills: F, cutouts: C,
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

const PATHS = [
  {"d":"M7.5 5 A2 2 0 1 1 3.5 5 A2 2 0 1 1 7.5 5 Z"},
  {"d":"M20.5 5 A2 2 0 1 1 16.5 5 A2 2 0 1 1 20.5 5 Z"},
  {"d":"M14 19.25 A2 2 0 1 1 10 19.25 A2 2 0 1 1 14 19.25 Z"},
  {"d":"M5.5 7 V9.5 A2 2 0 0 0 7.5 11.5 H16.5 A2 2 0 0 0 18.5 9.5 V7"},
  {"d":"M12 11.5 V17.25"},
]
const FILLS = [
  "M7.5 5 A2 2 0 1 1 3.5 5 A2 2 0 1 1 7.5 5 Z",
  "M20.5 5 A2 2 0 1 1 16.5 5 A2 2 0 1 1 20.5 5 Z",
  "M14 19.25 A2 2 0 1 1 10 19.25 A2 2 0 1 1 14 19.25 Z",
]
const CUTS = []

export default function render(icon) {
  const sk = prep((icon && icon.name) || 'git-fork', PATHS, FILLS, CUTS)
  return gloss.render(sk).map(([t, a]) => [t, { ...a, class: a.class || 'wm-k' }])
}
