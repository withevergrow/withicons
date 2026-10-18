// forge/hand/chrome/avatar-cat.mjs: a cat head with two pointed ears, warm inner ears, big ink eyes, a muzzle and whiskers.
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
const n2 = v => +v.toFixed(2)
const circ = (x, y, r) => `M${n2(x + r)} ${n2(y)} A${r} ${r} 0 1 1 ${n2(x - r)} ${n2(y)} A${r} ${r} 0 1 1 ${n2(x + r)} ${n2(y)} Z`
const oval = (x, y, rx, ry, k = 48) => 'M' + Array.from({ length: k }, (_, i) => { const a = i / k * Math.PI * 2; return `${n2(x + rx * Math.cos(a))} ${n2(y + ry * Math.sin(a))}` }).join(' L') + ' Z'
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
const SH = 'M4.5 22 C4.5 18.8 7.8 17.2 12 17.2 C16.2 17.2 19.5 18.8 19.5 22 Z'
const dot = (out, x, y, r, c, cls = 'wm-k') => out.push(['circle', { cx: f(x, 0), cy: f(y, 1), r: r2(r * K.SCALE), fill: col(c), class: cls }])
const face = (out, x = 12, y = 12.6) => {
  dot(out, x - 1.5, y, 0.6, 'ink'); dot(out, x + 1.5, y, 0.6, 'ink')
  out.push(['path', { d: TD(`M${n2(x - 1.3)} ${n2(y + 1.6)} Q${x} ${n2(y + 2.6)} ${n2(x + 1.3)} ${n2(y + 1.6)}`), stroke: col('ink'), 'stroke-width': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
}
const HEAD = 'M12 20.6 C7.6 20.6 4.8 18 4.8 14.4 C4.8 12.6 5.3 11.2 6 10.1 L5.5 3.9 C5.5 3 6.3 2.7 7 3.3 L10.3 6.2 C10.9 6.1 11.4 6 12 6 C12.6 6 13.1 6.1 13.7 6.2 L17 3.3 C17.7 2.7 18.5 3 18.5 3.9 L18 10.1 C18.7 11.2 19.2 12.6 19.2 14.4 C19.2 18 16.4 20.6 12 20.6 Z'
const EAR_L = 'M7.1 5.6 L7.3 9 L9.4 7.4 Z'
const EAR_R = 'M16.9 5.6 L16.7 9 L14.6 7.4 Z'
const eye = (out, x, y) => {
  out.push(['path', { d: TD(oval(x, y, 2, 2.1, 24)), fill: col('shine'), class: 'wm-k' }])
  out.push(['path', { d: TD(oval(x, y + 0.1, 0.95, 1.3, 20)), fill: col('ink'), class: 'wm-k' }])
  out.push(['circle', { cx: f(x - 0.3, 0), cy: f(y - 0.5, 1), r: r2(0.36 * K.SCALE), fill: col('shine'), class: 'wm-k' }])
}
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-cat'
  const wh = [[2.2, 14.6, 6.2, 15.6], [2.4, 18.4, 6.2, 17.2], [21.8, 14.6, 17.8, 15.6], [21.6, 18.4, 17.8, 17.2]]
  const parts = [{ d: HEAD, fill: true }]
  const out = paint(name, parts, [])
  out.push(['path', { d: TD(EAR_L), fill: col('c4'), stroke: col('edge'), 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-k' }])
  out.push(['path', { d: TD(EAR_R), fill: col('c4'), stroke: col('edge'), 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-k' }])
  out.push(['path', { d: TD(oval(12, 17.2, 3.4, 2.5)), fill: col('shine'), class: 'wm-k' }])
  eye(out, 9, 12.4); eye(out, 15, 12.4)
  out.push(['path', { d: TD('M10.6 15 H13.4 L12 16.4 Z'), fill: col('c3'), stroke: col('c3'), 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-k' }])
  out.push(['path', { d: TD('M12 16.5 V17.5 M10.2 18.3 Q12 19.1 12 17.5 Q12 19.1 13.8 18.3'), stroke: col('ink'), 'stroke-width': 0.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', class: 'wm-k' }])
  for (const [a, b, c, d] of wh) out.push(['path', { d: TD('M' + a + ' ' + b + ' L' + c + ' ' + d), stroke: col('c3'), 'stroke-width': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }])
  return glintLast(out)
}
