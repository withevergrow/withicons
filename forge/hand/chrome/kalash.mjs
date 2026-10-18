// forge/hand/chrome/kalash.mjs — a chrome kalash: round pot with defined neck and rim, a fan of three gunmetal mango leaves and a distinct coconut sphere on top.
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

const POT = 'M10.2 12.8 H13.8 V14 C17.2 14.4 19.2 16.2 19.2 18.2 C19.2 20.6 16 21.6 12 21.6 C8 21.6 4.8 20.6 4.8 18.2 C4.8 16.2 6.8 14.4 10 13.8 Z'
const RIM = 'M9 9.6 H15 V11.2 H9 Z'
const LEAVES = 'M7.4 10 C5.2 10.2 2.6 9 1.8 6.4 C4.4 6.2 6.6 7.6 7.4 10 Z M16.6 10 C18.8 10.2 21.4 9 22.2 6.4 C19.6 6.2 17.4 7.6 16.6 10 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'kalash'
  const out = paint(name, [{ d: POT, fill: true }, { d: RIM, fill: true }, { d: circ(12, 5.2, 2.4), fill: true }, { d: LEAVES, plate: 'A', fill: true }], ['M7 9.4 L3 7', 'M17 9.4 L21 7'])
  out.push(['path', { d: TD('M6.4 17.4 H17.6'), stroke: col('accent'), 'stroke-width': r2(1 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-deco' }])
  return glintLast(out)
}
