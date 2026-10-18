// forge/hand/sticker/bell-off.mjs — a whole lemon bell (no gap carved for the slash: the slash is its own mini sticker
// with a paper rim) and a shorter slash that stops inside the die-cut; replaces the generated drawing, whose bell was
// split into ragged pieces around a full-length slash that crowded it.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_sticker-core.mjs'

const prep = (icon, raw) => {
  const paths = raw.paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { ...icon, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))) }
}

const BELL = 'M6 11 A6 6 0 0 1 18 11 V16.5 L19.5 18.5 H4.5 L6 16.5 Z'
const CLAPPER = 'M9.5 18.5 A2.5 2.5 0 0 0 14.5 18.5'

export default function render(icon) {
  const nodes = build(prep(icon, {
    paths: [{ d: BELL, plate: 'K' }, { d: CLAPPER, plate: 'A' }, { d: 'M12 4.1 V3.4', plate: 'K' }, { d: 'M5.25 5.25 L18.75 18.75', plate: 'S' }],
    fills: [BELL],
  }))
  // the clapper sways (motion parts.A): its tube carries wm-a
  return nodes.map(n => n[0] === 'path' && /A2\.1\d? 2\.1\d? 0 0 0/.test(n[1].d) && !n[1].fill ? ['path', { ...n[1], class: 'wm-a' }] : n)
}
