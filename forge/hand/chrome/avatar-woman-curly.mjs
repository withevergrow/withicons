// forge/hand/chrome/avatar-woman-curly.mjs: a big bumpy mass of dark curls (chrome rim, gunmetal body, swirl marks) with curly bangs over a clear face, over the shoulders.
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
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-woman-curly'
  const C = []
  for (let i = 0; i < 6; i++) { const a = Math.PI * (1.02 + i * 0.96 / 5); C.push([12 + 5.9 * Math.cos(a), 11.2 + 6.1 * Math.sin(a), 2.3]) }
  for (const x of [5.5, 18.5]) for (const y of [13, 16]) C.push([x, y, 2])
  const parts = [{ d: SH, fill: true }, ...C.map(([x, y, r]) => ({ d: oval(x, y, r, r, 24), fill: true, plate: 'A' }))]
  const out = paint(name, parts, [oval(12, 12.9, 4.3, 4.8)])
  for (const [x, y, r] of C) out.push(['path', { d: TD(oval(x, y, r - 0.4, r - 0.4, 24)), fill: col('c3'), class: 'wm-k' }])
  for (const [x, y, r] of C) out.push(['path', { d: TD(`M${n2(x - r * 0.45)} ${n2(y + r * 0.1)} A${n2(r * 0.45)} ${n2(r * 0.45)} 0 1 1 ${n2(x + r * 0.3)} ${n2(y + r * 0.35)}`), stroke: col('c1'), 'stroke-width': 0.35, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  out.push(['path', { d: TD(oval(12, 12.9, 3.8, 4.3)), fill: col('tint'), class: 'wm-k' }])
  for (const [x, y, r] of [[9.1, 8.9, 1.5], [11.4, 8.3, 1.55], [13.7, 8.4, 1.55], [15.1, 9.3, 1.3]]) {
    out.push(['path', { d: TD(oval(x, y, r, r, 20)), fill: col('c3'), stroke: col('c1'), 'stroke-width': 0.3, class: 'wm-k' }])
  }
  face(out, 12, 13.2)
  return glintLast(out)
}
