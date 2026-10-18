// forge/hand/clay/truck.mjs — an orange clay delivery truck in side view: a tall cargo box and a lower cab with a raked
// nose, split by a pressed seam, a big pale-glass cab window, and two chunky yellow wheels set in arches cut clear of the body,
// each with a pale hubcap. The generated truck swallowed its wheels into the body (only two yellow slivers showed) and
// lost the cab, so at 16px it read as an orange sofa. Same model and light as the generator (_clay-core.mjs); only the
// geometry (and the window tint and hubcaps) is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, ellD } from '../../styles/_clay-core.mjs'
import { colorsFor } from '../../styles/_clay-color.mjs'
import { K } from '../../styles/_clay-model.mjs'

// a skeleton in the shape the clay model expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`
const r2 = n => Math.round(n * 100) / 100

// centrelines: every part is also stroked as a tube (K 2.55, A 2.3 wide)
const BODY = 'M3.6 4.6H12.4A1.6 1.6 0 0 1 14 6.2V9.2H17.6Q18.4 9.2 18.9 9.8L21.7 13.2Q22.2 13.8 22.2 14.6V15.6A1 1 0 0 1 21.2 16.6H2.8A1 1 0 0 1 1.8 15.6V6.4A1.8 1.8 0 0 1 3.6 4.6Z'
// the seam between cargo box and cab: it runs the full cab height, from the step down to the arch line, continuing the
// box's front face so the cab reads as its own mass (an open cutout becomes a pressed crease)
const SEAM = 'M14 7.8V15'
// the cab window: a large closed cutout becomes a recessed glass panel. It fills most of the cab's upper half, its front
// edge raked parallel to the nose (about 1.35u in from it) and 1.2u clear of the seam
const WINDOW = 'M15.2 10.2H18.1Q18.45 10.2 18.67 10.47L21 13.35Q21.3 13.9 20.7 13.9H15.2Z'
const PANE = [[15.5, 10.5], [17.95, 10.5], [18.3, 10.7], [20.55, 13.45], [20.4, 13.6], [15.5, 13.6]]
const STREAK = [[16.6, 10.5], [17.6, 10.5], [15.5, 12.5], [15.5, 11.5]]
const WX = [6.3, 17.6], WY = 17.8
// wheel arches: circles that run out past the body cut clean through it, leaving a gap round each wheel
const ARCHES = WX.map(x => disc(x, WY, 3.45))
const WHEELS = WX.map(x => disc(x, WY, 1.65)).join('')

export default function render(icon) {
  const name = (icon && icon.name) || 'truck'
  const sk = skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: WHEELS, plate: 'A', fill: true },
  ], [SEAM, WINDOW, ...ARCHES])
  const nodes = build(sk)
  if (!nodes) return nodes
  // the cargo box is a big flat face, so the house face ramp (tint -> c1 at 0.5) washes most of it out to pastel:
  // reach the body colour sooner so the truck keeps its orange
  for (const g of nodes[0][0] === 'defs' ? nodes[0][2] : []) {
    const s = g[2]
    if (g[0] === 'radialGradient' && s.length === 3 && /clay-tint/.test(s[0][1]['stop-color']) && /clay-c1/.test(s[1][1]['stop-color'])) s[1][1].offset = 0.3
  }
  // pale glass laid in the window recess (inset 0.45 in output units so the recess wall shows round it), with a
  // diagonal shine streak, placed through the model's own transform
  const { col } = colorsFor(sk)
  const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
  const P = (pts) => 'M' + pts.map(p => tf(...p).join(' ')).join('L') + 'Z'
  nodes.push(['path', { d: P(PANE), fill: col('tint'), 'fill-opacity': 0.95, class: 'wm-k' }])
  nodes.push(['path', { d: P(STREAK), fill: col('shine'), 'fill-opacity': 0.75, class: 'wm-shine' }])
  for (const x of WX) {
    const [cx, cy] = tf(x, WY)
    nodes.push(['path', { d: ellD(cx + 0.1, cy + 0.14, 0.86, 0.86), fill: col('shadow'), 'fill-opacity': 0.3, class: 'wm-a' }])
    nodes.push(['path', { d: ellD(cx, cy, 0.84, 0.84), fill: col('tint'), class: 'wm-a' }])
  }
  return nodes
}
