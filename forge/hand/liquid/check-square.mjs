// forge/hand/liquid/check-square.mjs — a firm clear glass tile with a bold violet glass tick inlaid in its moat.
// The generated tile was so faintly tinted it vanished on white and its tick was a thin tube in a groove, so at 16px
// it read as a blank pale square; here the tile carries a deeper tint and a firmer hairline and the tick is heavier
// coloured glass (wm-a, it pops in), built with Liquid's own recipe (_liquid-core) like the other status icons.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, roundStrokeSet } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// skeleton for the glass build: lines carry the plate, fills the mass, cutouts the knock-outs
function prep(name, paths, fills = [], cutouts = []) {
  const lines = paths.flatMap(p => parsePath(p.d).map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate })))
  return {
    name, lines, paths: [],
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
    cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
  }
}
// firmer glass: a deeper clear tint, a deeper refraction band and a stronger ink hairline, so the glass holds
// its silhouette on white
function firm(nodes, name) {
  const g0 = `wg-liquid-${name}-0`, g1 = `wg-liquid-${name}-1`, g2 = `wg-liquid-${name}-2`
  return nodes.map(([tag, a, kids]) => {
    if (tag === 'defs') return [tag, a, kids.map(([t, ga, stops]) => {
      if (ga.id === g0) return [t, ga, stops.map(([s, sa], i) => [s, { ...sa, 'stop-opacity': [0.26, 0.48, 0.74][i] }])]
      if (ga.id === g1) return [t, ga, stops.map(([s, sa], i) => [s, { ...sa, 'stop-opacity': [0.42, 0.86][i] }])]
      if (ga.id === g2) return [t, ga, stops.map(([s, sa], i) => [s, { ...sa, 'stop-opacity': [0.5, 1][i] }])]
      return [t, ga, stops]
    })]
    if (a.stroke === 'currentColor') return [tag, { ...a, 'stroke-opacity': 0.45, 'stroke-width': 0.26 }]
    return [tag, a]
  })
}

// the tile outline (glass grows 1.3u around it) and the tick centreline (coloured glass 3u wide)
const TILE = 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z'
const TICK = 'M7.75 12.5 L10.75 15.5 L16.25 9.25'

export default function render(icon) {
  const name = (icon && icon.name) || 'check-square'
  const tick = parsePath(TICK)[0].pts
  const sk = prep(name, [{ d: TILE, plate: 'K' }, { d: TICK, plate: 'A' }], [TILE])
  sk.fills.push({ set: roundStrokeSet(tick, 3) })
  return firm(build(sk), name)
}
