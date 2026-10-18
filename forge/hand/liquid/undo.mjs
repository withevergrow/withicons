// forge/hand/liquid/undo.mjs — a clear glass hook bending back on itself, led by an open violet glass chevron: the exact
// mirror of the generated liquid redo (same hook radius, same 5u chevron arms, same tube weight), so the pair matches.
// The generated undo put its chevron in the palest corner of the light, so the head washed out on white and the arrow
// lost its direction at 16px; here the hook glass is firmer, the chevron's coloured glass runs dense violet (as save's
// label) with the same 0.26 ink hairline as the hook, and the hook starts at the chevron's tip so the join is one piece.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
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
// firmer glass: a deeper clear tint, a deeper refraction band and a stronger ink hairline on every part, so the glass
// holds its silhouette on white; the chevron sits under the light's hot spot, so its violet glass runs dense and the
// white bloom laid over it is held back (the rim highlights stay)
function firm(nodes, name) {
  const g0 = `wg-liquid-${name}-0`, g1 = `wg-liquid-${name}-1`, g2 = `wg-liquid-${name}-2`, g4 = `url(#wg-liquid-${name}-4)`
  return nodes.map(([tag, a, kids]) => {
    if (tag === 'defs') return [tag, a, kids.map(([t, ga, stops]) => {
      if (ga.id === g0) return [t, ga, stops.map(([s, sa], i) => [s, { ...sa, 'stop-opacity': [0.26, 0.48, 0.74][i] }])]
      if (ga.id === g1) return [t, ga, stops.map(([s, sa], i) => [s, { ...sa, 'stop-opacity': [0.72, 0.95][i] }])]
      if (ga.id === g2) return [t, ga, stops.map(([s, sa], i) => [s, { ...sa, 'stop-opacity': [0.5, 1][i] }])]
      return [t, ga, stops]
    })]
    if (a.stroke === 'currentColor') return [tag, { ...a, 'stroke-opacity': 0.45, 'stroke-width': 0.26 }]
    if (a.fill === g4 && /wm-a/.test(a.class || '')) return [tag, { ...a, 'fill-opacity': 0.4 }]
    return [tag, a]
  })
}

// mirror of redo: the hook runs from the chevron's tip (x=3.5) so tail and head share one joint
const HOOK = 'M3.5 9.5 H15 A5.5 5.5 0 0 1 15 20.5 H9.5'
const HEAD = 'M8.5 4.5 L3.5 9.5 L8.5 14.5'

export default function render(icon) {
  const name = (icon && icon.name) || 'undo'
  const sk = prep(name, [{ d: HOOK, plate: 'K' }, { d: HEAD, plate: 'A' }])
  return firm(build(sk), name)
}
