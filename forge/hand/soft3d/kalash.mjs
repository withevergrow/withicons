// forge/hand/soft3d/kalash.mjs — an upright, centred brass kalash: a round-bellied pot with a flared rim, a brown coconut on
// top and two mango leaves fanning out symmetrically (the generated drawing was tilted with mismatched ear-like leaves).
import { build } from '../../styles/_soft3d-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

// a prepared skeleton (as forge/lib/load.mjs prepares one), kept in a front-facing category so the style lights it as a soft slab
function skel(icon, { paths, fills, cutouts }) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    ...icon, category: 'shapes', paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}
// role -> hex fallback overrides applied to every node
function recolor(nodes, map) {
  const re = /--with-soft3d-([a-z0-9]+), (#[0-9A-Fa-f]{6})/g
  const fix = v => typeof v === 'string' ? v.replace(re, (m, r) => map[r] ? `--with-soft3d-${r}, ${map[r]}` : m) : v
  const walk = n => [n[0], Object.fromEntries(Object.entries(n[1]).map(([k, v]) => [k, fix(v)])), ...(n[2] ? [n[2].map(walk)] : [])]
  return nodes ? nodes.map(walk) : nodes
}

const POT = 'M9.4 12.4 C6.1 13.5 4.4 15.5 4.4 17.7 C4.4 20.2 7.6 21.8 12 21.8 C16.4 21.8 19.6 20.2 19.6 17.7 C19.6 15.5 17.9 13.5 14.6 12.4 Z'
const RIM = 'M8.1 10.2 H15.9 A1.2 1.2 0 0 1 15.9 12.6 H8.1 A1.2 1.2 0 0 1 8.1 10.2 Z'
const COCO_MASS = 'M12 3.6 A3.2 3.2 0 1 1 11.99 3.6 Z'
const COCO = 'M12 5.2 A1.6 1.6 0 1 1 11.99 5.2 Z'
const LEAF_L = 'M9.4 9.4 C7.2 7.4 4.6 6 1.9 6.4 C2.7 9.2 5.4 10.6 9.4 9.4 Z M9.2 7.4 C8.2 5.6 6.8 3.6 5 2.6 C4.4 5.2 5.9 7.3 9.2 7.4 Z'
const LEAF_R = 'M14.6 9.4 C16.8 7.4 19.4 6 22.1 6.4 C21.3 9.2 18.6 10.6 14.6 9.4 Z M14.8 7.4 C15.8 5.6 17.2 3.6 19 2.6 C19.6 5.2 18.1 7.3 14.8 7.4 Z'
const BAND = 'M6.4 17.4 C9.6 18.7 14.4 18.7 17.6 17.4'

export default function render(icon) {
  const nodes = build(skel(icon, {
    paths: [[LEAF_L + ' ' + LEAF_R, 'A'], [BAND, 'A'], [COCO, 'A']],
    fills: [POT, RIM, COCO_MASS], cutouts: [],
  }))
  return recolor(nodes, { c1: '#E9B43A', c2: '#4FB463', c3: '#8A5838', c4: '#E5483F' })
}
