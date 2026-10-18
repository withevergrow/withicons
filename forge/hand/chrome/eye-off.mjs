// forge/hand/chrome/eye-off.mjs â€” chrome almond eye with a deep pupil, crossed by a gunmetal slash with a pale cut gap (no pink accent).
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
// transforms x y pairs (no arcs in inlay paths)
const TD = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(+x, 0)} ${f(+y, 1)}`)
const circ = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`
function paint(name, parts, cuts) {
  const Ls = layers(model(skeleton(name, parts, cuts)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
function glintLast(out) {
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  if (gi >= 0) out.push(out.splice(gi, 1)[0])
  return out
}


const EYE = 'M2 12 C5 6.5 19 6.5 22 12 C19 17.5 5 17.5 2 12 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'eye-off'
  const out = paint(name, [{ d: EYE, fill: true }, { d: circ(12, 12, 3.9) }], [])
  out.push(['circle', { cx: f(12, 0), cy: f(12, 1), r: r2(3.4 * K.SCALE), fill: col('edge'), class: 'wm-k' }], ['circle', { cx: f(12, 0), cy: f(12, 1), r: r2(2.7 * K.SCALE), fill: col('ink'), class: 'wm-k' }], ['circle', { cx: f(11.2, 0), cy: f(11.2, 1), r: r2(0.65 * K.SCALE), fill: col('shine'), class: 'wm-k' }])
  const s = 'M4 4 20 20'
  out.push(['path', { d: TD(s), stroke: col('edge'), 'stroke-width': r2(3 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  out.push(['path', { d: TD(s), stroke: col('c3'), 'stroke-width': r2(1.5 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  return glintLast(out)
}
