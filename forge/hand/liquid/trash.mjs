// forge/hand/liquid/trash.mjs — a tapered clear glass bin with two grooves cut through its face, under a separate violet
// glass lid with a loop handle. The generated drawing built the lid as a thin clear tube fused to the rim and laid two
// coloured bars inside a pale body, so on white the bin faded to hairlines; here the lid is a solid coloured bar parted
// from a firmer clear bin by a real gap, using Liquid's own glass recipe (_liquid-core) for light, rim and caustic.
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

// the bin (glass grows 1.3u around its outline) and the lid + handle centrelines (glass grows 1.15u)
const BIN = 'M5.75 9.75 H18.25 L17.4 19.2 A2 2 0 0 1 15.4 21 H8.6 A2 2 0 0 1 6.6 19.2 Z'
const LID = 'M4.5 6.5 H19.5'
const HANDLE = 'M9.25 6 V4.25 A1.25 1.25 0 0 1 10.5 3 H13.5 A1.25 1.25 0 0 1 14.75 4.25 V6'
const GROOVES = ['M10 12.75 V18', 'M14 12.75 V18']

export default function render(icon) {
  const name = (icon && icon.name) || 'trash'
  const sk = prep(name,
    [{ d: BIN, plate: 'K' }, ...GROOVES.map(d => ({ d, plate: 'K' })), { d: LID, plate: 'A' }, { d: HANDLE, plate: 'A' }],
    [BIN])
  return firm(build(sk), name)
}
