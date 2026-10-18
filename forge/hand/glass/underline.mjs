// forge/hand/glass/underline.mjs — a frosted glass U over a luminous accent underline bar. The generator built the bar
// as one more pale frosted rod that vanished on white at 16px; here the bar is a vivid accent glass rod (the glass
// signal recipe), so the underline is the strongest mark in the icon, and it zooms on its own (wm-a). Same layers
// and paint as the generator (_glass-soft.mjs); only the geometry and the plates are drawn here.
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

const U = 'M6.5 3.5 V10 A5.5 5.5 0 0 0 17.5 10 V3.5'
const BAR = 'M5 20 H19'

export default function render(icon) {
  const name = (icon && icon.name) || 'underline'
  const L = softLayers(skeleton(name, [{ d: U, plate: 'K' }, { d: BAR, plate: 'S' }]))
  const { defs, out } = softPaint(L, name)
  return [['defs', {}, defs], ...tag(out, { '': 'wm-k', 'wm-s': 'wm-a' })]
}
