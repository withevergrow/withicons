// forge/hand/chrome/avatar-woman-hijab.mjs: a round chrome hood framing a clear face (dark inner rim), a warm scarf band running diagonally across the chest, over the shoulders.
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
const HOOD = 'M12 2.6 C16.5 2.6 19.8 5.9 19.8 10.6 C19.8 13.6 18.6 16 16.6 17.4 L7.4 17.4 C5.4 16 4.2 13.6 4.2 10.6 C4.2 5.9 7.5 2.6 12 2.6 Z'
const SHW = 'M3.8 22 C3.8 19 7.4 17 12 17 C16.6 17 20.2 19 20.2 22 Z'
const BAND = 'M15.4 16.7 C18.2 16.1 20.4 17.6 20.4 20.6 C16.4 19.9 11.4 20.8 7.8 22 L5.8 22 L5.8 21 C10.2 19.9 13.2 18.6 15.4 16.7 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-woman-hijab'
  const out = paint(name, [{ d: SHW, fill: true }, { d: HOOD, fill: true, plate: 'A' }], [oval(12, 11.2, 4.5, 5.2)])
  out.push(['path', { d: TD(oval(12, 11.2, 4.5, 5.2)), fill: col('c3'), class: 'wm-k' }])
  out.push(['path', { d: TD('M6 11 Q5.6 6.8 9 4.6'), stroke: col('shine'), 'stroke-width': 0.5, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  out.push(['path', { d: TD(oval(12, 11.4, 3.8, 4.5)), fill: col('shine'), class: 'wm-k' }])
  out.push(['path', { d: TD(BAND), fill: col('c4'), stroke: col('edge'), 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: TD('M15.6 18.4 C13.4 19.6 10.6 20.2 8.4 21'), stroke: col('c2'), 'stroke-width': 0.45, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }])
  face(out, 12, 11.4)
  return glintLast(out)
}
