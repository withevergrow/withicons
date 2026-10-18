// forge/hand/liquid/volume-off.mjs — the clear glass speaker with a big, bold accent-glass X beside it. The generated X
// was a pair of thin beads at the style's badge weight in translucent accent, so on white it read as a faint pink
// scribble at 24 and 16px; here the X spans the speaker's height, its bars are a third heavier and the bead is nearly
// opaque, so "muted" is the first thing you see. Same glass recipe as the generator (_liquid-core.mjs build); only the
// geometry is drawn here. The X is the S part (wm-s) for the spec's parts.S pulse about (18, 12).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, col } from '../../styles/_liquid-core.mjs'

const SPEAKER = 'M9.84 5.98A1 1 0 0 1 11.5 6.73L11.5 17.27A1 1 0 0 1 9.84 18.02L7 15.5L4.5 15.5A1.5 1.5 0 0 1 3 14L3 10A1.5 1.5 0 0 1 4.5 8.5L7 8.5L9.84 5.98Z'
// each bar of the X drawn twice, 0.7 apart across its width, so the glass bar is about 2.8u thick
const o = 0.25
const X = [
  `M${15 - o} ${8.75 + o}L${21 - o} ${14.75 + o}`, `M${15 + o} ${8.75 - o}L${21 + o} ${14.75 - o}`,
  `M${21 - o} ${8.75 - o}L${15 - o} ${14.75 - o}`, `M${21 + o} ${8.75 + o}L${15 + o} ${14.75 + o}`,
].join('')

function skeleton(name) {
  const paths = [{ id: 'p0', d: SPEAKER, plate: 'K' }, { id: 'p1', d: X, plate: 'S' }].map(p => ({ ...p, subs: parsePath(p.d) }))
  const subs = parsePath(SPEAKER)
  return {
    name, paths, cutouts: [], fills: [{ d: SPEAKER, subs, set: setOf(subs.map(s => s.pts)) }],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'volume-off'
  const out = build(skeleton(name))
  for (const n of out) {
    const a = n[1]
    // the X's body: denser accent glass with a firmer hairline
    if (a && a.fill === col('accent')) { a['fill-opacity'] = 0.95; a['stroke-opacity'] = 0.45 }
  }
  return out
}
