// forge/hand/clay/ambulance.mjs — a puffy clay ambulance in side view: a tall box body with a raked cab on the right, a
// pale windshield on the cab, a raised white cross on the box and two chunky gold wheels set in arches cut clear of the
// body (each with a pale hubcap). The generated ambulance fused the cross, the window and the wheels into one blob with an
// L-shaped window and stubby feet. Same model and light as the generator (_clay-core.mjs); only the geometry (the cross,
// glass and hubcaps are laid on through the model's own transform) is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, ellD } from '../../styles/_clay-core.mjs'
import { colorsFor } from '../../styles/_clay-color.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`
const r2 = n => Math.round(n * 100) / 100

// tall box on the left, the roof raking down to a cab on the right
const BODY = 'M3.8 4H12.8Q13.8 4 14.4 4.8L18 9.6H20A2.2 2.2 0 0 1 22.2 11.8V15.6A1.1 1.1 0 0 1 21.1 16.7H2.9A1.1 1.1 0 0 1 1.8 15.6V6A2 2 0 0 1 3.8 4Z'
// the windshield recess, raked parallel to the roof line, 1.2u in from it
const WINDOW = 'M12.6 6.3H14.6Q14.9 6.3 15.1 6.6L16.9 9.1Q17.1 9.9 16.6 9.9H12.6Z'
const PANE = [[12.95, 6.65], [14.4, 6.65], [16.4, 9.5], [12.95, 9.5]]
const STREAK = [[14.2, 6.65], [14.9, 6.65], [13.4, 9.5], [12.95, 9.5], [12.95, 9.0]]
const WX = [6.3, 17.7], WY = 17.5
const ARCHES = WX.map(x => disc(x, WY, 3.4))
const WHEELS = WX.map(x => disc(x, WY, 1.6)).join('')
// raised cross on the box (skeleton coordinates), centred at (8.2, 9.8), arms 1.5 wide, 5.2 long
const CROSS = (cx, cy, h, w) => `M${cx - w} ${cy - h}H${cx + w}V${cy - w}H${cx + h}V${cy + w}H${cx + w}V${cy + h}H${cx - w}V${cy + w}H${cx - h}V${cy - w}H${cx - w}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'ambulance'
  const sk = skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: WHEELS, plate: 'A', fill: true },
  ], [WINDOW, ...ARCHES])
  const nodes = build(sk)
  if (!nodes) return nodes
  // reach the body colour sooner so the big flat box keeps its red (the house face ramp washes it out to pastel)
  for (const g of nodes[0][0] === 'defs' ? nodes[0][2] : []) {
    const st = g[2]
    if (g[0] === 'radialGradient' && st.length === 3 && /clay-tint/.test(st[0][1]['stop-color']) && /clay-c1/.test(st[1][1]['stop-color'])) st[1][1].offset = 0.3
  }
  const { col } = colorsFor(sk)
  const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
  const P = pts => 'M' + pts.map(p => tf(...p).join(' ')).join('L') + 'Z'
  nodes.push(['path', { d: P(PANE), fill: col('tint'), 'fill-opacity': 0.95, class: 'wm-k' }])
  nodes.push(['path', { d: P(STREAK), fill: col('shine'), 'fill-opacity': 0.7, class: 'wm-shine' }])
  // the cross: a soft shade, the pale cross with rounded joins, a lit stripe
  const arm = 2.9 * K.SCALE, wid = 1.0 * K.SCALE
  const [cx, cy] = tf(7.2, 9.9)
  const crossD = (ox, oy) => CROSS(r2(cx + ox), r2(cy + oy), r2(arm), r2(wid))
  nodes.push(['path', { d: crossD(0.12, 0.3), fill: col('shadow'), 'fill-opacity': 0.35, 'stroke-linejoin': 'round', stroke: col('shadow'), 'stroke-opacity': 0.35, 'stroke-width': 0.5, class: 'wm-k' }])
  nodes.push(['path', { d: crossD(0, 0), fill: col('tint'), stroke: col('tint'), 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }])
  nodes.push(['path', { d: `M${r2(cx - wid)} ${r2(cy - arm - 0.1)}H${r2(cx + wid * 0.3)}`, stroke: col('shine'), 'stroke-opacity': 0.8, 'stroke-width': 0.35, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  for (const x of WX) {
    const [hx, hy] = tf(x, WY)
    nodes.push(['path', { d: ellD(hx + 0.1, hy + 0.14, 0.86, 0.86), fill: col('shadow'), 'fill-opacity': 0.3, class: 'wm-a' }])
    nodes.push(['path', { d: ellD(hx, hy, 0.84, 0.84), fill: col('tint'), class: 'wm-a' }])
  }
  return nodes
}
