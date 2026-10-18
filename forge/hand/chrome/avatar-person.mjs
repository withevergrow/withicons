// forge/hand/chrome/avatar-person.mjs: the neutral short-hair person: a gunmetal hair cap with a swept fringe sits on
// a chrome head, a pale inlaid face carries two ink eyes and a smile, over chrome shoulders. Hair, head and face are
// three separate tones with a clear gap (the generated drawing melted them into one muddy metal blob with no face).
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

const SH = 'M4.5 22 C4.5 18.8 7.8 17.2 12 17.2 C16.2 17.2 19.5 18.8 19.5 22 Z'
// short hair: a smooth cap over the crown with a fringe swept to one side
const HAIR = 'M6.2 11.2C5.4 6.2 8 3.6 12 3.6C16 3.6 18.6 6.2 17.8 11.2C17.5 9.6 16.8 8.6 15.6 8.1C13.6 9 11.2 8.6 9.4 8.2C8 8.1 6.7 9.4 6.2 11.2Z'
const FRINGE = 'M16.2 8.1Q12 6.9 7.8 8.1Q10.8 8.4 14 10.8Q15.6 10.6 16.2 9.4Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-person'
  const parts = [{ d: SH, fill: true }, { d: HAIR, fill: true, plate: 'A' }]
  const out = paint(name, parts, [oval(12, 12.2, 4.6, 4.9)])
  out.push(['path', { d: TD(oval(12, 12.2, 4, 4.3)), fill: col('shine'), class: 'wm-k' }])
  out.push(['path', { d: TD(FRINGE), fill: col('c3'), stroke: col('c1'), 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-k' }])
  dot(out, 10.2, 12.4, 0.62, 'ink'); dot(out, 13.8, 12.4, 0.62, 'ink')
  out.push(['path', { d: TD('M10.4 14.5Q12 16 13.6 14.5'), stroke: col('ink'), 'stroke-width': 0.65, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  return glintLast(out)
}
