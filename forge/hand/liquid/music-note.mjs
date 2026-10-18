// forge/hand/liquid/music-note.mjs — an eighth note in the style's clear glass: a full, tilted oval head, a straight
// stem and a solid swept flag. The generated note was a round head on a thin stem with a hairline curl of a flag, so
// almost all of it was faint tint and the flag vanished on white at 24 and 16px; here the head is a real note head
// (wider than tall, tilted), and the flag is a filled teardrop of glass, so the whole note carries enough glass mass
// (and edge) to hold its contrast. Same glass recipe as the generator (_liquid-core.mjs build); only the geometry is
// drawn here, with the slab's tint ramp a step deeper like the other media controls redrawn by hand.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, col } from '../../styles/_liquid-core.mjs'

// head: an oval 7.2 x 5.4 tilted -20 degrees about (8, 17.5)
const HEAD = 'M4.62 18.73A3.6 2.7 -20 1 1 11.38 16.27A3.6 2.7 -20 1 1 4.62 18.73Z'
const STEM = 'M11 16.5V3.5'
// flag: a swept teardrop from the stem top, its tip curling down to the right
const FLAG = 'M11 3.25C11.75 5.5 13.75 6.25 15.5 7.75C17 9 17.75 10.5 17.25 12.5C16.5 10.75 14.75 9.75 11 8.75Z'

function skeleton(name) {
  const paths = [
    { id: 'p0', d: HEAD, plate: 'K' }, { id: 'p1', d: STEM, plate: 'K' }, { id: 'p2', d: FLAG, plate: 'K' },
  ].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, cutouts: [], fills: [fill(HEAD), fill(FLAG)],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

const stop = (offset, role, op) => ['stop', { offset, 'stop-color': col(role), 'stop-opacity': op }]

export default function render(icon) {
  const name = (icon && icon.name) || 'music-note'
  const out = build(skeleton(name))
  for (const g of out[0][2]) {
    if (g[1].id.endsWith('-0')) g[2] = [stop(0, 'c1', 0.26), stop(0.55, 'c1', 0.5), stop(1, 'c1', 0.78)]
    if (g[1].id.endsWith('-2')) g[2] = [stop(0, 'c3', 0.55), stop(1, 'c3', 1)]
  }
  for (const n of out) if (n[1] && n[1].stroke === 'currentColor') n[1]['stroke-opacity'] = 0.45
  return out
}
