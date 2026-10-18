// forge/hand/clay/car.mjs — a sky-blue clay car in side view: a long low body with a rounded cabin on top, two dark
// glossy side windows split by a pillar, and two chunky gold wheels set in arches cut clear of the body, each with a
// dark hub. The generated car fused cabin, windows and wheels into one blob with a gold band across it, so at 16px it
// read as a bubble rather than a car. Same model and light as the generator (_clay-core.mjs); only the geometry (and
// the pale hubcaps) is drawn here.
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

// centrelines: every part is also stroked as a tube (K 2.55, A 2.3 wide)
const BODY = 'M3.8 10.8H6.3L8.3 6.6Q8.8 5.6 9.9 5.6H13.6Q14.6 5.6 15.2 6.4L18.4 10.8H20.2A2 2 0 0 1 22.2 12.8V15.2A1.5 1.5 0 0 1 20.7 16.7H3.3A1.5 1.5 0 0 1 1.8 15.2V12.8A2 2 0 0 1 3.8 10.8Z'
// one wide side window: a large closed cutout becomes a recessed glass panel (as on car-front)
const WINDOW = 'M9.6 7.3H13.6Q14 7.3 14.35 7.7L16.9 11.1H7.9Z'
// two tinted panes laid in it, the gap between them left as the door pillar
const PANES = [[[9.75, 7.55], [11.95, 7.55], [11.95, 10.85], [8.3, 10.85]], [[12.65, 7.55], [13.55, 7.55], [14.05, 7.8], [16.45, 10.85], [12.65, 10.85]]]
const WX = [6.7, 17.3], WY = 17.7
// wheel arches: circles that run out past the body cut clean through it, leaving a gap round each wheel
const ARCHES = WX.map(x => disc(x, WY, 3.45))
const WHEELS = WX.map(x => disc(x, WY, 1.65)).join('')
const r2 = n => Math.round(n * 100) / 100

export default function render(icon) {
  const name = (icon && icon.name) || 'car'
  const sk = skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: WHEELS, plate: 'A', fill: true },
  ], [WINDOW, ...ARCHES])
  const nodes = build(sk)
  if (!nodes) return nodes
  // glass panes and pale hubcaps, placed through the model's own transform
  const { col } = colorsFor(sk)
  const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
  const glass = PANES.map(P => 'M' + P.map(p => tf(...p).join(' ')).join('L') + 'Z').join('')
  nodes.push(['path', { d: glass, fill: col('shadow'), 'fill-opacity': 0.4, class: 'wm-k' }])
  for (const x of WX) {
    const [cx, cy] = tf(x, WY)
    nodes.push(['path', { d: ellD(cx + 0.1, cy + 0.14, 0.86, 0.86), fill: col('shadow'), 'fill-opacity': 0.3, class: 'wm-a' }])
    nodes.push(['path', { d: ellD(cx, cy, 0.84, 0.84), fill: col('tint'), class: 'wm-a' }])
  }
  return nodes
}
