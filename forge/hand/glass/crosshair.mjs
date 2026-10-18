// forge/hand/glass/crosshair.mjs — a frosted glass ring with four clean ticks crossing it and a luminous accent bead at
// the centre. The generator built it from Solid's ring-and-notch knockouts, so the ticks fused into the ring as pale
// lumps and the small centre dot drowned at 16px; here ring and ticks are plain glass rods with clear gaps and the
// centre is a vivid accent bead that pulses on its own (wm-a). Same layers and paint as the generator (_glass-soft.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { softLayers, softPaint } from '../../styles/_glass-soft.mjs'

// a skeleton in the shape softLayers() expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
// the body is wm-k; the signal layers become the moving part (motion animates parts.A)
const tag = (nodes, map) => nodes.map(([t, a, k]) => {
  const cls = a.class ? map[a.class] ?? a.class : map[''] ?? ''
  return [t, cls ? { ...a, class: cls } : a, ...(k ? [k] : [])]
})

const RING = 'M19 12 A7 7 0 1 1 5 12 A7 7 0 1 1 19 12 Z'
const TICKS = 'M12 2.75 V8 M12 16 V21.25 M2.75 12 H8 M16 12 H21.25'
const DOT = 'M12.5 12 A0.5 0.5 0 1 1 11.5 12 A0.5 0.5 0 1 1 12.5 12 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'crosshair'
  const L = softLayers(skeleton(name, [{ d: RING, plate: 'K' }, { d: TICKS, plate: 'K' }, { d: DOT, plate: 'S' }]))
  const { defs, out } = softPaint(L, name)
  return [['defs', {}, defs], ...tag(out, { '': 'wm-k', 'wm-s': 'wm-a' })]
}
