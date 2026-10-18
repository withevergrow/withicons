// forge/hand/liquid/trash-2.mjs: the straight-sided bin with a wide lid bar, a plain arc handle and two clean slots cut through its face.
// The generated drawing looped the handle like a paperclip and tangled the slots. A firmer clear bin under a coloured glass lid and handle,
// parted by a real gap, using Liquid's own glass recipe (_liquid-core) for light, rim and caustic.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function prep(name, paths, fills = []) {
  const lines = paths.flatMap(p => parsePath(p.d).map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate })))
  return {
    name, lines, paths: [], cutouts: [],
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
  }
}
// firmer glass: a deeper clear tint, a deeper refraction band and a stronger ink hairline, so the glass holds its silhouette on white
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

const BIN = 'M5.75 10 H18.25 V18.5 A2.5 2.5 0 0 1 15.75 21 H8.25 A2.5 2.5 0 0 1 5.75 18.5 Z'
const LID = 'M3.75 6.75 H20.25'
const HANDLE = 'M9.5 6.25 V4.75 A1.25 1.25 0 0 1 10.75 3.5 H13.25 A1.25 1.25 0 0 1 14.5 4.75 V6.25'
const GROOVES = ['M9.75 13 V17.5', 'M14.25 13 V17.5']

export default function render(icon) {
  const name = (icon && icon.name) || 'trash-2'
  const sk = prep(name,
    [{ d: BIN, plate: 'K' }, ...GROOVES.map(d => ({ d, plate: 'K' })), { d: LID, plate: 'A' }, { d: HANDLE, plate: 'A' }],
    [BIN])
  return firm(build(sk), name)
}
