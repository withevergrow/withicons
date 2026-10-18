// forge/hand/chrome/avatar-girl.mjs: a girl with pigtails: a gunmetal hair cap with two bunches hanging at the sides, each
// tied with a hot enamel bobble, a light inlaid round face with a fringe, two eyes and a grin, over small chrome shoulders.
// The pigtails are what say "girl" at 16px, so they stand out of the head silhouette on both sides.
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
const dot = (out, x, y, r, c, cls = 'wm-k') => out.push(['circle', { cx: f(x, 0), cy: f(y, 1), r: r2(r * K.SCALE), fill: col(c), class: cls }])

const SH = 'M6.6 22 C6.6 20.2 8.6 19.2 12 19.2 C15.4 19.2 17.4 20.2 17.4 22 Z'
// cap over the head with a bunch hanging from each side
const HAIR = 'M12 3.2 C7.8 3.2 5 5.8 4.9 9.4 C3.6 9.4 2.4 10.6 2.2 13 C2 16 2.6 19 4.4 20.4 C6.2 19.6 6.9 17 6.8 14.6 C6.8 13.8 7 13.2 7.4 12.8 L7.4 15 L16.6 15 L16.6 12.8 C17 13.2 17.2 13.8 17.2 14.6 C17.1 17 17.8 19.6 19.6 20.4 C21.4 19 22 16 21.8 13 C21.6 10.6 20.4 9.4 19.1 9.4 C19 5.8 16.2 3.2 12 3.2 Z'
const INSET = (d, cx, cy, k) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${n2(cx + (+x - cx) * k)} ${n2(cy + (+y - cy) * k)}`)
const FACE = oval(12, 11.5, 4.7, 5.1)
const FRINGE = 'M7.4 10.2 C8 7.4 9.8 6.2 12 6.2 C14.2 6.2 16 7.4 16.6 10.2 C14.8 9.6 13 8.8 12 7.8 C11 8.8 9.2 9.6 7.4 10.2 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-girl'
  const out = paint(name, [{ d: SH, fill: true }, { d: HAIR + ' ' + FACE, fill: true, plate: 'A' }], [FACE])
  out.push(['path', { d: TD(INSET(HAIR, 12, 12, 0.93)), fill: col('c3'), class: 'wm-k' }])
  out.push(['path', { d: TD('M6.4 8.6Q7.6 5.6 11 4.8'), stroke: col('tint'), 'stroke-width': 0.6, 'stroke-linecap': 'round', fill: 'none', 'stroke-opacity': 0.9, class: 'wm-k' }])
  out.push(['path', { d: TD(FACE), fill: col('shine'), stroke: col('c1'), 'stroke-width': 0.3, class: 'wm-k' }])
  out.push(['path', { d: TD(FRINGE), fill: col('c3'), stroke: col('tint'), 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-k' }])
  dot(out, 10.2, 12.3, 0.62, 'ink'); dot(out, 13.8, 12.3, 0.62, 'ink')
  out.push(['path', { d: TD('M10.3 14.6Q12 16.2 13.7 14.6'), stroke: col('ink'), 'stroke-width': 0.65, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  dot(out, 4.3, 10.6, 1.2, 'accent', 'wm-s'); dot(out, 19.7, 10.6, 1.2, 'accent', 'wm-s')
  return glintLast(out)
}
