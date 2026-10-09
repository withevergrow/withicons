// prepare() for style modules that build their own skeletons (hand-drawn per-style icons). The same as forge/lib/load.mjs's
// prepare(), without its Node imports, so the styles still bundle for the browser (@withicons/dynamic, the site's live runtime).
import { parsePath } from '../kernel/geom.mjs'
import { setOf, unionSets } from '../kernel/bool.mjs'

export function prepare(raw) {
  const paths = (raw.paths || []).map((p, i) => ({
    id: p.id || `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d),
  }))
  const fills = (raw.fills || []).map(d => {
    const subs = parsePath(d)
    return { d, subs, set: setOf(subs.map(s => s.pts)) }
  })
  const cutouts = (raw.cutouts || []).map(d => ({ d, subs: parsePath(d) }))
  return {
    ...raw, paths, fills, cutouts,
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: fills.length ? unionSets(fills.map(f => f.set)) : [],
  }
}
