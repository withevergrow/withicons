// forge/hand/glass/strikethrough.mjs — a frosted glass S struck through by a luminous accent bar. The generator fused the
// bar into the S as one pale pane, so the crossing read as a dollar sign at 16px; here the strike is a vivid accent
// glass rod with a clear moat that parts the S into its two bowls, so it reads as a letter struck out, and the strike
// nudges on its own (wm-a). Same layers and paint as the generator (_glass-soft.mjs); only geometry and plates differ.
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

const S = 'M17 6.5 C16 5 14.25 4 12 4 C8.75 4 6.5 5.75 6.5 8 C6.5 10.5 9 11.5 12 12 C15 12.5 17.5 13.5 17.5 16 C17.5 18.25 15.25 20 12 20 C9.75 20 8 19 7 17.5'
const BAR = 'M3.5 12 H20.5'

export default function render(icon) {
  const name = (icon && icon.name) || 'strikethrough'
  const L = softLayers(skeleton(name, [{ d: S, plate: 'K' }, { d: BAR, plate: 'S' }]))
  const { defs, out } = softPaint(L, name)
  return [['defs', {}, defs], ...tag(out, { '': 'wm-k', 'wm-s': 'wm-a' })]
}
