// forge/hand/chrome/drag-handle.mjs â€” six plain solid chrome grip dots, each one gradient disc with a single small highlight (no inner ring).
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


export default function render(icon) {
  const name = (icon && icon.name) || 'drag-handle'
  const g = 'wg-chrome-' + name + '-0'
  const out = [['defs', {}, [['linearGradient', { id: g, x1: '0', y1: '0', x2: '0', y2: '1' }, [
    ['stop', { offset: '0', 'stop-color': col('shine') }], ['stop', { offset: '0.4', 'stop-color': col('tint') }],
    ['stop', { offset: '0.55', 'stop-color': col('c2') }], ['stop', { offset: '0.85', 'stop-color': col('c3') }], ['stop', { offset: '1', 'stop-color': col('c4') }]]]]]]
  const P = []
  for (const y of [6, 12, 18]) for (const x of [9, 15]) P.push([x, y])
  for (const [x, y] of P) out.push(['circle', { cx: f(x + 0.2, 0), cy: f(y + 0.35, 1), r: r2(2.1 * K.SCALE), fill: col('shadow'), 'fill-opacity': '0.25', class: 'wm-shadow' }])
  for (const [x, y] of P) out.push(['circle', { cx: f(x, 0), cy: f(y, 1), r: r2(2 * K.SCALE), fill: col('shadow'), class: 'wm-k' }], ['circle', { cx: f(x, 0), cy: f(y, 1), r: r2(1.75 * K.SCALE), fill: 'url(#' + g + ')', class: 'wm-k' }])
  for (const [x, y] of P) out.push(['ellipse', { cx: f(x - 0.55, 0), cy: f(y - 0.75, 1), rx: r2(0.7 * K.SCALE), ry: r2(0.4 * K.SCALE), fill: col('shine'), 'fill-opacity': '0.9', class: 'wm-shine' }])
  return out
}
