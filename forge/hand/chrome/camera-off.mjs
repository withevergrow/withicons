// forge/hand/chrome/camera-off.mjs — a full chrome camera (body, raised viewfinder bump, centred deep lens) crossed by
// a gunmetal slash on the skeleton's diagonal, with a pale gap either side so the camera still reads at 16px.
// Replaces the generated pink hairline slash and the off-centre lens. The lens is the blinking part (wm-a), the slash
// the badge (wm-s). Chrome model and paint from _chrome-core.mjs; only the geometry and the inlays are drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate || 'K', pathId: p.id }))) }
}
const r2 = v => Math.round(v * 100) / 100
const f = (v, axis) => r2((v - 12) * K.SCALE + 12 + (axis ? K.TY : K.TX))
const TD = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(+x, 0)} ${f(+y, 1)}`)
const circ = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`

const BODY = 'M4 6.5 H7.5 L9 4 H15 L16.5 6.5 H20 A2 2 0 0 1 22 8.5 V18.5 A2 2 0 0 1 20 20.5 H4 A2 2 0 0 1 2 18.5 V8.5 A2 2 0 0 1 4 6.5 Z'
const LX = 12, LY = 13.5
const SLASH = 'M4 4.5 L20 20.5'

export default function render(icon) {
  const name = (icon && icon.name) || 'camera-off'
  const Ls = layers(model(skeleton(name, [{ d: BODY, fill: true }, { d: circ(LX, LY, 3.7) }])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  const cx = f(LX, 0), cy = f(LY, 1)
  // the slash first, the lens set over it: the slash runs behind the lens, so the lens still reads
  out.push(['path', { d: TD(SLASH), stroke: col('edge'), 'stroke-width': r2(3.3 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  out.push(['path', { d: TD(SLASH), stroke: col('c3'), 'stroke-width': r2(1.8 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  out.push(['circle', { cx, cy, r: r2(3.6 * K.SCALE), fill: col('shadow'), class: 'wm-a' }],
    ['circle', { cx, cy, r: r2(3.2 * K.SCALE), fill: col('edge'), class: 'wm-a' }],
    ['circle', { cx, cy, r: r2(2.4 * K.SCALE), fill: col('ink'), class: 'wm-a' }],
    ['circle', { cx: r2(cx - 0.85), cy: r2(cy - 0.9), r: 0.55, fill: col('shine'), class: 'wm-a' }])
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  if (gi >= 0) out.push(out.splice(gi, 1)[0])
  return out
}
