// forge/hand/chrome/avatar-monster-fluffy.mjs — a fluffy chrome monster: the shaggy-edged body, two big white eyes with
// ink pupils and a catch light, and a dark open mouth with two pale fangs. The generated one cut blank grey sockets for
// the eyes and a murky mouth, so the face read as a ghost; here the eyes and mouth are inlaid in contrast.
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
const ell = (x, y, rx, ry) => `M${x + rx} ${y} A${rx} ${ry} 0 1 1 ${x - rx} ${y} A${rx} ${ry} 0 1 1 ${x + rx} ${y} Z`
const ellOut = (x, y, rx, ry) => { const cx = f(x, 0), cy = f(y, 1), a = r2(rx * K.SCALE), b = r2(ry * K.SCALE); return `M${r2(cx + a)} ${cy}A${a} ${b} 0 1 1 ${r2(cx - a)} ${cy}A${a} ${b} 0 1 1 ${r2(cx + a)} ${cy}Z` }

const BODY = 'M4.5 11 C4.5 7.5 7 5.25 10 4.75 L10.75 2.75 L12 4.5 L13.25 2.75 L14 4.75 C17 5.25 19.5 7.5 19.5 11 L21.5 12.75 L19.5 14.5 L21.25 16.75 L19.5 17.75 L20.75 20.25 L18.75 19.5 L17.25 21.5 L15.5 19.5 L13.75 21.25 L12 19.75 L10.25 21.5 L8.5 19.5 L6.75 21.25 L5.25 19.5 L3.25 20.25 L4.5 17.75 L2.75 16.5 L4.5 14.5 L2.5 13.25 Z'
const EL = [8.9, 9.4, 2, 2.5], ER = [15.1, 9.4, 2, 2.5]
const MOUTH = 'M7.6 13.7 C10.4 15 13.6 15 16.4 13.7 C16.2 16.8 14.4 18.3 12 18.3 C9.6 18.3 7.8 16.8 7.6 13.7 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-monster-fluffy'
  const Ls = layers(model(skeleton(name, [{ d: BODY, fill: true }], [ell(...EL), ell(...ER), MOUTH])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  const glint = out.pop()
  out.push(['path', { d: ellOut(...EL), fill: col('edge'), class: 'wm-k' }])
  out.push(['path', { d: ellOut(...ER), fill: col('edge'), class: 'wm-k' }])
  for (const [x, y] of [[9.3, 10], [15.5, 10]]) {
    out.push(['path', { d: ellOut(x, y, 1.05, 1.35), fill: col('ink'), class: 'wm-k' }])
    out.push(['circle', { cx: f(x - 0.35, 0), cy: f(y - 0.5, 1), r: r2(0.38 * K.SCALE), fill: col('shine'), class: 'wm-shine' }])
  }
  out.push(['path', { d: TD(MOUTH), fill: col('ink'), class: 'wm-k' }])
  for (const x of [9.6, 14.4]) out.push(['path', { d: TD(`M${x - 1.05} 14.35 L${x + 1.05} 14.55 L${x} 16.9 Z`), fill: col('edge'), class: 'wm-k' }])
  out.push(glint)
  return out
}
