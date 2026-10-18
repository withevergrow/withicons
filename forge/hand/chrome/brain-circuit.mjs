// forge/hand/chrome/brain-circuit.mjs: a lobed left brain half, separated by a clear gap from right-side circuit traces ending in node dots.
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

const BRAIN = 'M11 4 C9.8 2.8 7.6 2.8 6.6 4.4 C4.8 4.2 3.2 5.8 3.4 7.6 C1.8 8.6 1.6 10.8 2.8 11.8 C1.8 13.2 2 15.4 3.6 16.2 C3.4 18.2 5.2 19.8 7 19.2 C7.8 21 10 21.2 11 20 Z'
const FOLDS = ['M11 4.2 L11 20', 'M7 4.6 C7.6 6 9 6.4 10 6.2', 'M3.6 7.8 C5 8.2 6.4 9.4 6.6 11', 'M2.9 11.8 C4.6 11.6 6 12.2 7.4 13.4 C8.4 12.6 9.6 12.6 11 12.8', 'M3.8 16.2 C5.4 15.6 6.8 16.2 7.6 17.4', 'M7.2 19 C7.8 17.8 9 17.2 10.8 17.4', 'M7.6 8.6 C8.6 8.6 9.6 9.4 9.6 10.4']
export default function render(icon) {
  const name = (icon && icon.name) || 'brain-circuit'
  const parts = [{ d: BRAIN, fill: true },
    { d: 'M12.8 7 H15.6 L17.2 5.4', plate: 'A' }, { d: 'M12.8 11.7 H18', plate: 'A' }, { d: 'M12.8 16.4 H15.6 L17.2 18', plate: 'A' },
    { d: circ(18.4, 4.6, 1.5), fill: true, plate: 'A' }, { d: circ(19.4, 11.7, 1.5), fill: true, plate: 'A' }, { d: circ(18.4, 18.8, 1.5), fill: true, plate: 'A' }]
  const out = paint(name, parts, [])
  out.push(['path', { d: TD(BRAIN), fill: 'none', stroke: col('edge'), 'stroke-width': 0.4, class: 'wm-k' }])
  for (const d of FOLDS) out.push(['path', { d: TD(d), fill: 'none', stroke: col('c3'), 'stroke-width': 0.75, 'stroke-linecap': 'round', class: 'wm-k' }])
  return glintLast(out)
}
