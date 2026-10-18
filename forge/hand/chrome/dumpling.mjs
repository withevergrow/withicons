// forge/hand/chrome/dumpling.mjs â€” pleated crescent dumpling with a scalloped crest, light pleat ridges and a flat base.
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
// transforms x y pairs (no arcs in inlay paths)
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


const BODY = 'M3 18 C2.6 12 7 8 9 8.6 C10 6.8 11 6.6 12 7.6 C13 6.6 14 6.8 15 8.6 C17 8 21.4 12 21 18 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'dumpling'
  const out = paint(name, [{ d: BODY, fill: true }], [])
  for (const s of ['M9 9.4 Q8.6 12 7.4 14', 'M12 8.4 Q12 11.4 12 13.6', 'M15 9.4 Q15.4 12 16.6 14']) {
    out.push(['path', { d: TD(s), stroke: col('shadow'), 'stroke-width': r2(1.5 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
    out.push(['path', { d: TD(s), stroke: col('shine'), 'stroke-width': r2(0.7 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  }
  out.push(['path', { d: TD('M2.6 18.1 21.4 18.1'), stroke: col('shadow'), 'stroke-width': r2(1.4 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  return glintLast(out)
}
