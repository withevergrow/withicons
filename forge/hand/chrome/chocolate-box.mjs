// forge/hand/chrome/chocolate-box.mjs: a heart-shaped box of chocolates: a fat chrome heart with five round gunmetal
// chocolates set in it, each parted from the lid by a clear gap, a chrome cap-shine on every one. The generated drawing
// cut the chocolates out and left a bone-like hole; here they are solid pieces, so the heart and the five dots both read.
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
const n2 = v => +v.toFixed(2)
function paint(name, parts, cuts) {
  const Ls = layers(model(skeleton(name, parts, cuts)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}

const HEART = 'M12 21 C12 21 2.6 15.4 2.6 8.8 C2.6 5.9 4.8 3.7 7.6 3.7 C9.5 3.7 11.1 4.7 12 6.3 C12.9 4.7 14.5 3.7 16.4 3.7 C19.2 3.7 21.4 5.9 21.4 8.8 C21.4 15.4 12 21 12 21 Z'
// five chocolates: two on the lobes, one in the cleft, two on the belly
const CH = [[7.2, 9.1], [16.8, 9.1], [12, 11.8], [9.3, 15.7], [14.7, 15.7]]
const R = 1.95
export default function render(icon) {
  const name = (icon && icon.name) || 'chocolate-box'
  const out = paint(name, [{ d: HEART, fill: true }], [])
  const gid = `wg-chrome-${name}-9`
  const defs = out[0][0] === 'defs' ? out[0] : null
  const choc = ['radialGradient', { id: gid, cx: 0.38, cy: 0.3, r: 0.85 }, [
    ['stop', { offset: 0, 'stop-color': col('c3') }], ['stop', { offset: 1, 'stop-color': col('ink') }]]]
  if (defs) defs[2].push(choc)
  const body = out.filter(n => n[0] !== 'defs')
  const glint = body.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const g = glint >= 0 ? body.splice(glint, 1)[0] : null
  const add = []
  for (const [x, y] of CH) {
    const cx = f(x, 0), cy = f(y, 1), r = R * K.SCALE
    add.push(['circle', { cx, cy, r: r2(r + 0.32), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-a' }])
    add.push(['circle', { cx, cy, r: r2(r), fill: col('c4'), class: 'wm-a' }])
    add.push(['circle', { cx, cy, r: r2(r - 0.2), fill: `url(#${gid})`, class: 'wm-a' }])
    add.push(['path', { d: `M${r2(cx - r * 0.55)} ${r2(cy - r * 0.05)}Q${r2(cx - r * 0.5)} ${r2(cy - r * 0.5)} ${r2(cx - r * 0.1)} ${r2(cy - r * 0.55)}`, stroke: col('tint'), 'stroke-width': 0.4, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  }
  const res = [...(defs ? [defs] : []), ...body, ...add]
  if (g) res.push(g)
  return res
}
