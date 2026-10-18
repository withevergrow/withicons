// forge/hand/chrome/laddoo.mjs — three separate chrome sweet balls stacked on a distinct plate with a rim, dark seams between them.
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
const circ = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`
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
const dot = (x, y, r, c, cls = 'wm-s') => ['circle', { cx: f(x, 0), cy: f(y, 1), r: r2(r * K.SCALE), fill: col(c), class: cls }]

const PLATE = 'M1.8 18 H22.2 C21.8 20.4 19.4 21.8 17 21.8 H7 C4.6 21.8 2.2 20.4 1.8 18 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'laddoo'
  const out = paint(name, [
    { d: circ(6.4, 13.2, 2.8), fill: true }, { d: circ(17.6, 13.2, 2.8), fill: true },
    { d: circ(12, 6.2, 2.8), fill: true }, { d: PLATE, fill: true },
  ], ['M3.6 19.4 H20.4'])
  for (const [x, y] of [[5.6, 12.4], [7.2, 14], [16.8, 12.4], [18.4, 14], [11.2, 5.4], [12.8, 7]]) out.push(dot(x, y, 0.4, 'c3', 'wm-deco'))
  return glintLast(out)
}
