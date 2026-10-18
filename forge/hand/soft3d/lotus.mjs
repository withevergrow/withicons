// forge/hand/soft3d/lotus.mjs — an upright, symmetrical five-petal lotus (tall centre petal, two flanking petals, two low
// outer petals) resting over a water bar, lit as a soft front-facing solid (the generated drawing was a tilted pink bud).
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

const CENTER = 'M12 2.8 C14.9 5.5 15.7 8.8 15.7 11.8 C15.7 15 14 17.3 12 18.3 C10 17.3 8.3 15 8.3 11.8 C8.3 8.8 9.1 5.5 12 2.8 Z'
const MID_L = 'M12 18.3 C6.4 17.6 3.6 14 3.6 7.8 C6.8 8.8 9 10.6 10.2 13.4 Z'
const MID_R = 'M12 18.3 C17.6 17.6 20.4 14 20.4 7.8 C17.2 8.8 15 10.6 13.8 13.4 Z'
const OUT_L = 'M12 18.3 C5.2 18.3 2.6 16.8 1.8 13.8 C5 13.2 8.2 14.2 10.4 16.2 Z'
const OUT_R = 'M12 18.3 C18.8 18.3 21.4 16.8 22.2 13.8 C19 13.2 15.8 14.2 13.6 16.2 Z'
const WATER = 'M5 20.6 H19'
// grooves between the petals (the style cuts them as a shaded recess)
const GROOVES = ['M8.4 11.4 C8.5 14.5 10 16.6 12 18.3', 'M15.6 11.4 C15.5 14.5 14 16.6 12 18.3']

export default function render(icon) {
  const nodes = build(skel(icon, { paths: [[WATER, 'A']], fills: [CENTER, MID_L, MID_R, OUT_L, OUT_R], cutouts: GROOVES }))
  return recolor(nodes, { c2: '#5BB8E8' })
}
