// forge/hand/chrome/avatar-dino.mjs: a dino bust in profile (long snout facing right, back spikes, eye and nostril) rising from the common chrome shoulders.
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
const HEAD = 'M7.6 17.6 C7.2 14.4 7.4 11.4 8.6 8.9 C9.5 6.9 11.2 5.5 13.4 5.5 L18.6 5.5 C20.1 5.5 21.2 6.5 21.2 7.9 C21.2 9.3 20.2 10.2 18.9 10.5 L16.6 10.9 C15.5 11.1 14.8 11.8 14.6 13 L14.2 17.6 Z'
const SPIKES = ['M9 9.8 L5.2 8.4 L8.2 12.4 Z', 'M8.2 13.6 L4.4 13.4 L7.8 16.6 Z', 'M10.6 6.8 L9.2 3 L13 5.6 Z']
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-dino'
  const out = paint(name, [{ d: SH, fill: true }, { d: HEAD, fill: true }, ...SPIKES.map(d => ({ d, fill: true, plate: 'A' }))], [])
  out.push(['path', { d: TD('M14.6 11.6 Q16.6 11.1 18.9 10.7 Q19.8 10.5 20.4 9.8'), stroke: col('c3'), 'stroke-width': 0.5, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  out.push(['path', { d: TD(oval(15.7, 7.9, 1.5, 1.5, 20)), fill: col('shine'), class: 'wm-k' }])
  dot(out, 15.8, 8, 0.85, 'ink'); dot(out, 20, 7.3, 0.45, 'c3')
  out.push(['circle', { cx: f(15.5, 0), cy: f(7.6, 1), r: r2(0.3 * K.SCALE), fill: col('shine'), class: 'wm-k' }])
  return glintLast(out)
}
