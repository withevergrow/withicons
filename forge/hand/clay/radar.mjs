// forge/hand/clay/radar.mjs: a plump violet clay radar disc with two concentric range rings pressed
// into the face, a raised orange wedge sweeping out of the centre toward the upper right, a pink candy blip on the sweep
// and a dark glossy centre pit. The generated drawing laid a thick ring and a fat sweep line over the disc, so it read
// as a power button; here the face is a scope. Disc, wedge and blip are the generator's model and light
// (_clay-core.mjs); wedge, blip and centre pit are laid on through the model's transform.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, ellD } from '../../styles/_clay-core.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = n => Math.round(n * 100) / 100
const s = K.SCALE
const tf = (x, y) => [r2((x - 12) * s + 12 + K.TX), r2((y - 12) * s + 12 + K.TY)]

const DISC = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
// a range ring pressed into the face, drawn as two open arcs so it stays a crease (not a hole)
const RING = r => `M${12 - r} 12A${r} ${r} 0 0 1 ${12 + r} 12M${12 + r} 12A${r} ${r} 0 0 1 ${12 - r} 12`
const rad = a => a * Math.PI / 180
const pol = (r, a) => tf(12 + r * Math.cos(rad(a)), 12 + r * Math.sin(rad(a)))

export default function render(icon) {
  const name = (icon && icon.name) || 'radar'
  const nodes = build(skeleton(name, [{ d: DISC, plate: 'K', fill: true }], [RING(3.7), RING(6.7)])) || []
  const defs = nodes[0][0] === 'defs' ? nodes[0][2] : null
  let gid = defs ? defs.length : 0
  const C2 = 'var(--with-clay-c2, #FFB257)', C3 = 'var(--with-clay-c3, #FF5C97)', SH = 'var(--with-clay-shadow, #24166B)'
  const SN = 'var(--with-clay-shine, #FFFFFF)', INK = 'var(--with-clay-ink, #2A1D5C)'
  const grad = (tag, a, stops) => { const id = `wg-clay-${name}-${gid++}`; if (defs) defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops.map(([o, c, op]) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }])]); return `url(#${id})` }
  // the sweep: a wedge from the centre out toward the upper right
  const [ax, ay] = tf(12, 12), R = r2(8.3 * s)
  const [p1x, p1y] = pol(8.3, -102), [p2x, p2y] = pol(8.3, -28)
  const W = (dx = 0, dy = 0) => `M${r2(ax + dx)} ${r2(ay + dy)}L${r2(p1x + dx)} ${r2(p1y + dy)}A${R} ${R} 0 0 1 ${r2(p2x + dx)} ${r2(p2y + dy)}Z`
  const wf = grad('radialGradient', { cx: r2(ax + 1.2), cy: r2(ay - 1.2), r: 8.4 }, [[0, SN, 0.5], [0.45, SN, 0.08], [1, SH, 0.3]])
  nodes.push(['path', { d: W(0.1, 0.5), fill: SH, 'fill-opacity': 0.4, stroke: SH, 'stroke-opacity': 0.4, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }])
  nodes.push(['path', { d: W(), fill: C2, stroke: C2, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }])
  nodes.push(['path', { d: W(), fill: wf, class: 'wm-a' }])
  // lit lip along the wedge's upper-left edge and a soft specular
  const [lx, ly] = pol(4.2, -86)
  nodes.push(['path', { d: `M${r2(ax - 0.05)} ${r2(ay - 0.4)}L${r2(p1x + 0.2)} ${r2(p1y + 0.5)}`, stroke: SN, 'stroke-opacity': 0.55, 'stroke-width': 0.4, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  nodes.push(['path', { d: ellD(lx + 0.5, ly + 0.2, 0.8, 0.38, -75), fill: SN, 'fill-opacity': 0.5, class: 'wm-shine' }])
  // the blip: a pink candy sphere with a catch-light, on the sweep
  const [bx, by] = pol(5.9, -62)
  const bf = grad('radialGradient', { cx: r2(bx - 0.45), cy: r2(by - 0.5), r: 2.1 }, [[0, SN, 0.7], [0.3, C3], [1, SH]])
  nodes.push(['path', { d: ellD(bx + 0.1, by + 0.42, 1.05, 1.05), fill: SH, 'fill-opacity': 0.4, class: 'wm-s' }])
  nodes.push(['path', { d: ellD(bx, by, 1.05, 1.05), fill: C3, class: 'wm-s' }])
  nodes.push(['path', { d: ellD(bx, by, 1.05, 1.05), fill: bf, class: 'wm-s' }])
  nodes.push(['path', { d: ellD(bx - 0.36, by - 0.4, 0.32, 0.2, -40), fill: SN, 'fill-opacity': 0.92, class: 'wm-shine' }])
  // centre pit
  nodes.push(['path', { d: ellD(ax, ay, 0.95, 0.95), fill: INK, class: 'wm-a' }])
  nodes.push(['path', { d: ellD(ax - 0.28, ay - 0.3, 0.26, 0.26), fill: SN, 'fill-opacity': 0.9, class: 'wm-shine' }])
  return nodes
}
