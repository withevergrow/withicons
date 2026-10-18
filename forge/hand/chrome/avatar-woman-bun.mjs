// forge/hand/chrome/avatar-woman-bun.mjs — a woman with a big top bun and a dark gunmetal hair mass framing a pale
// face (cut from the hair and inlaid light) with a swept fringe, two ink eyes, over wide chrome shoulders.
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

const HAIR = 'M5.5 12.5 A6.5 6 0 0 1 18.5 12.5 V16 H5.5 Z'
const FACE = 'M8.2 11.8 C10.6 11.6 13 10.4 14.6 8.6 C15.4 9.6 15.9 10.8 15.9 12.2 C15.9 14.6 14.2 16.3 12 16.3 C9.8 16.3 8.1 14.6 8.2 11.8 Z'
const SH = 'M4.5 22 C4.5 18.8 7.8 17.2 12 17.2 C16.2 17.2 19.5 18.8 19.5 22 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-woman-bun'
  const out = paint(name, [
    { d: HAIR, fill: true, plate: 'A' },
    { d: circ(12, 2.9, 2), fill: true, plate: 'A' },
    { d: SH, fill: true },
  ], [FACE])
  out.push(['path', { d: TD(FACE), fill: col('tint'), class: 'wm-k' }])
  for (const x of [10.6, 13.6]) out.push(['circle', { cx: f(x, 0), cy: f(13, 1), r: r2(0.65 * K.SCALE), fill: col('ink'), class: 'wm-k' }])
  return glintLast(out)
}
