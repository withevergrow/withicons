// forge/hand/chrome/avatar-person-wheelchair.mjs — a heavy chrome figure in a wheelchair: a big round head, a thick
// torso and seat, a leg with a footrest, all inflated chrome, in front of a large gunmetal wheel whose tyre is
// drawn in dark steel with a bright rim and hub, so the wheel is the second strong shape and reads at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
const circ = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`
const rect = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

const WHEEL = [8.6, 17, 4.1]
const PARTS = [
  { d: circ(10.2, 4.6, 2.5), plate: 'K', fill: true },
  { d: rect(8.4, 8.7, 12.0, 13.4, 1.6), plate: 'K', fill: true },
  { d: rect(8.4, 11.6, 15.8, 13.7, 1), plate: 'K', fill: true },
  { d: 'M15 13.2L17.1 18.4L19.7 18.4', plate: 'K' },
  { d: circ(...WHEEL), plate: 'A' },
]

function skeleton(name) {
  const paths = PARTS.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = PARTS.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-person-wheelchair'
  const out = emit(layers(model(skeleton(name))), name, 0)
  // the tyre: a dark steel band on the outside of the wheel, a bright rim inside it, a hub
  const [wx, wy] = tf(WHEEL[0], WHEEL[1]), rr = WHEEL[2] * K.SCALE
  const ring = (r, w, c, op) => ['circle', { cx: wx, cy: wy, r: r2(r), fill: 'none', stroke: col(c), 'stroke-width': w, ...(op ? { 'stroke-opacity': op } : {}), class: 'wm-a' }]
  const tyre = [ring(rr + 0.65, 0.95, 'c3'), ring(rr - 0.25, 0.35, 'shine', 0.85), ['circle', { cx: wx, cy: wy, r: 0.85, fill: col('c3'), class: 'wm-a' }]]
  // the wheel sits behind the person: its tyre goes in before the first chrome (body) layer
  out.splice(out.findIndex(n => n[1] && n[1].class === 'wm-k'), 0, ...tyre)
  return out
}
