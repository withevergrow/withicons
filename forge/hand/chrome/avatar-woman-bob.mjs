// forge/hand/chrome/avatar-woman-bob.mjs: a chin-length bob with a swept fringe framing a pale face, over the shoulders.
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
const BOB = 'M4.6 16.4 C3.8 10 6.2 3.6 12 3.6 C17.8 3.6 20.2 10 19.4 16.4 C19.3 17.4 18.2 17.6 17.5 17 L16.3 15 L7.7 15 L6.5 17 C5.8 17.6 4.7 17.4 4.6 16.4 Z'
const FRINGE = 'M7.3 11.4 C7.4 8.4 9.4 6.6 12 6.6 C14.8 6.6 16.8 8.4 16.9 11.4 C16.1 9.8 14.8 8.9 13.2 8.7 C12 9.9 9.9 10.4 8.3 12 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-woman-bob'
  const out = paint(name, [{ d: SH, fill: true }, { d: BOB, fill: true, plate: 'A' }], [oval(12, 12.6, 4.5, 4.7)])
  out.push(['path', { d: TD(BOB), fill: col('c2'), stroke: col('edge'), 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-k' }])
  out.push(['path', { d: TD('M6.4 15.4 Q5.6 9 8.6 5.8'), stroke: col('tint'), 'stroke-width': 0.5, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  out.push(['path', { d: TD(oval(12, 12.8, 4, 4.4)), fill: col('shine'), class: 'wm-k' }])
  out.push(['path', { d: TD(FRINGE), fill: col('c3'), stroke: col('edge'), 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-k' }])
  face(out, 12, 13)
  return glintLast(out)
}
