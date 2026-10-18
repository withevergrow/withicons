// forge/hand/chrome/champagne-toast.mjs: two separate tilted flutes (bowl, stem, foot) with a clink spark between the rims.
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

const rot = (pts, cx, cy, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [n2(cx + (x - cx) * c - (y - cy) * s), n2(cy + (x - cx) * s + (y - cy) * c)]) }
const poly = p => 'M' + p.map(q => q.join(' ')).join(' L') + ' Z'
function flute(x, deg) {
  const bowl = [[x - 2.3, 4.6], [x + 2.3, 4.6], [x + 2.1, 8], [x + 1.3, 10.4], [x + 0.5, 11.4], [x - 0.5, 11.4], [x - 1.3, 10.4], [x - 2.1, 8]]
  const wine = [[x - 1.7, 6.6], [x + 1.7, 6.6], [x + 1.5, 8.2], [x + 0.9, 9.9], [x, 10.6], [x - 0.9, 9.9], [x - 1.5, 8.2]]
  const stem = [[x - 0.55, 11], [x + 0.55, 11], [x + 0.55, 18.4], [x - 0.55, 18.4]]
  const foot = [[x - 2.8, 18.2], [x + 2.8, 18.2], [x + 2.8, 19.6], [x - 2.8, 19.6]]
  return [bowl, stem, foot, wine].map(p => poly(rot(p, x, 19.6, deg)))
}
export default function render(icon) {
  const name = (icon && icon.name) || 'champagne-toast'
  const L = flute(5.4, 14), R = flute(18.6, -14)
  const parts = [...L.slice(0, 3), ...R.slice(0, 3)].map(d => ({ d, fill: true }))
  const out = paint(name, parts, [])
  for (const d of [L[3], R[3]]) out.push(['path', { d: TD(d), fill: col('c4'), stroke: col('shine'), 'stroke-width': 0.3, class: 'wm-k' }])
  out.push(['path', { d: TD('M12 0.4 L12.5 2 L14 2.4 L12.5 2.8 L12 4.4 L11.5 2.8 L10 2.4 L11.5 2 Z'), fill: col('shine'), stroke: col('c1'), 'stroke-width': 0.3, class: 'wm-s' }])
  return glintLast(out)
}
