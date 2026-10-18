// forge/hand/liquid/save.mjs — a floppy disk as one thick clear glass slab with a clipped top-right corner, a violet
// glass shutter (with its window slot) inlaid at the top edge and a violet glass label framed by clear glass below.
// The generated drawing traced the shutter and label as hollow tubes with grooves around them, so the slab dissolved
// into pale hairlines and at 16px read as a muddle; here both parts are solid coloured inlays on a firmer clear slab,
// built with Liquid's own glass recipe (_liquid-core) so the light, rim, refraction and caustic match the family.
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

const BODY = 'M5 3 H15.5 L21 8.5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z'
// centrelines of the inlays: the glass grows 1.15u around them
const SHUTTER = 'M9.25 3.5 H13.25 A0.75 0.75 0 0 1 14 4.25 V6.25 A0.75 0.75 0 0 1 13.25 7 H9.25 A0.75 0.75 0 0 1 8.5 6.25 V4.25 A0.75 0.75 0 0 1 9.25 3.5 Z'
const LABEL = 'M8 13.75 H16 A1 1 0 0 1 17 14.75 V16.75 A1 1 0 0 1 16 17.75 H8 A1 1 0 0 1 7 16.75 V14.75 A1 1 0 0 1 8 13.75 Z'
const SLOT = 'M11.75 4.25 H13 V6.25 H11.75 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'save'
  const sk = prep(name,
    [{ d: BODY, plate: 'K' }, { d: SHUTTER, plate: 'A' }, { d: LABEL, plate: 'A' }],
    [BODY, SHUTTER, LABEL],
    [SLOT])
  return firm(build(sk), name)
}
