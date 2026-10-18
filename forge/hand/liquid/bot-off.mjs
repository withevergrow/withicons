// forge/hand/liquid/bot-off.mjs: the bot head whole (rounded-square clear glass, antenna bead, violet ear pods) with two deep
// glass eyes, and one clean accent slash laid over it on a white halo, steered between the eyes so the face stays readable.
// The old slash was a heavy moated glass bar that cut the head and hid the eyes.
// Motion: the eyes (wm-a) blink; the slash (wm-s) stays; antenna and ears are the coloured glass (wm-a from the model).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, col, L } from '../../styles/_liquid-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`
const r2 = v => Math.round(v * 100) / 100
const tf = (x, y) => [r2((x - 12) * L.SCALE + 12 + L.TX), r2((y - 12) * L.SCALE + 12 + L.TY)]
const T = (x, y) => tf(x, y).join(' ')

const HEAD = 'M8 8H16A3 3 0 0 1 19 11V17.5A3 3 0 0 1 16 20.5H8A3 3 0 0 1 5 17.5V11A3 3 0 0 1 8 8Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'bot-off'
  const nodes = build(skeleton(name, [
    { d: HEAD, plate: 'K', fill: true },
    { d: 'M12 8V4.9', plate: 'A' },
    { d: disc(12, 3.6, 1.3), plate: 'A', fill: true },
    { d: 'M2.4 12.7V16.3', plate: 'A' },
    { d: 'M21.6 12.7V16.3', plate: 'A' },
  ]))
  if (!nodes) return null
  const deep = { fill: col('c3'), 'fill-opacity': 0.92, stroke: 'currentColor', 'stroke-opacity': 0.55, 'stroke-width': 0.22, class: 'wm-a' }
  const glint = { fill: col('shine'), 'fill-opacity': 0.8, class: 'wm-a' }
  for (const x of [7.6, 16.4]) {
    const [cx, cy] = tf(x, 13.8)
    nodes.push(['ellipse', { cx, cy, rx: r2(1 * L.SCALE), ry: r2(1.5 * L.SCALE), ...deep }])
    nodes.push(['circle', { cx: r2(cx - 0.25), cy: r2(cy - 0.45), r: 0.28, ...glint }])
  }
  // the slash: a white halo then the accent bar, one clean cut across the face
  const d = `M${T(3.5, 4.5)}L${T(20.5, 21.5)}`
  nodes.push(['path', { d, fill: 'none', stroke: col('shine'), 'stroke-opacity': 0.9, 'stroke-width': 3.2, 'stroke-linecap': 'round', class: 'wm-s' }])
  nodes.push(['path', { d, fill: 'none', stroke: col('accent'), 'stroke-width': 1.7, 'stroke-linecap': 'round', class: 'wm-s' }])
  return nodes
}
