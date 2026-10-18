// forge/hand/chrome/avatar-woman.mjs: a woman with shoulder-length hair: a gunmetal hair mass that frames a light inlaid
// face (flipped ends curling at the shoulders), a swept dark fringe, two ink eyes and a smile, over wide chrome shoulders.
// Hair, face and shoulders are three tones, so the face reads at 16px instead of the generated mask.
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
const dot = (out, x, y, r, c) => out.push(['circle', { cx: f(x, 0), cy: f(y, 1), r: r2(r * K.SCALE), fill: col(c), class: 'wm-k' }])

const SH = 'M4.4 22 C4.4 19.4 7.6 18.2 12 18.2 C16.4 18.2 19.6 19.4 19.6 22 Z'
// long hair: a tall dome, down both sides to flipped-out ends
const HAIR = 'M12 2.6 C7.2 2.6 3.9 5.8 3.9 10.6 V15.4 C3.9 16.9 4.7 17.6 5.9 17.6 C7.5 17.6 8.6 16.7 9.1 15.2 L14.9 15.2 C15.4 16.7 16.5 17.6 18.1 17.6 C19.3 17.6 20.1 16.9 20.1 15.4 V10.6 C20.1 5.8 16.8 2.6 12 2.6 Z'
// the dark inlay: the hair shape drawn in once, inset, so the gunmetal rim frames it
const INSET = (d, cx, cy, k) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${n2(cx + (+x - cx) * k)} ${n2(cy + (+y - cy) * k)}`)
const FACE = oval(12, 11.4, 4.3, 5.1)
// a swept fringe across the brow, parted a little left of centre
const FRINGE = 'M7.6 11.2 C7.4 7.6 9.4 5.9 12 5.9 C14.6 5.9 16.6 7.6 16.4 11.2 C15.2 9.6 13.4 8.6 11 8.4 C10 9.6 8.8 10.6 7.6 11.2 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-woman'
  const out = paint(name, [{ d: SH, fill: true }, { d: HAIR + ' ' + FACE, fill: true, plate: 'A' }], [FACE])
  out.push(['path', { d: TD(INSET(HAIR, 12, 10, 0.91)), fill: col('c3'), class: 'wm-k' }])
  out.push(['path', { d: TD('M6.3 10Q6.4 5.8 10.6 4.5'), stroke: col('tint'), 'stroke-width': 0.6, 'stroke-linecap': 'round', fill: 'none', 'stroke-opacity': 0.9, class: 'wm-k' }])
  out.push(['path', { d: TD(FACE), fill: col('shine'), stroke: col('c1'), 'stroke-width': 0.3, class: 'wm-k' }])
  out.push(['path', { d: TD(FRINGE), fill: col('c3'), stroke: col('tint'), 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-k' }])
  dot(out, 10.1, 12.1, 0.62, 'ink'); dot(out, 13.9, 12.1, 0.62, 'ink')
  out.push(['path', { d: TD('M10.4 14.5Q12 16 13.6 14.5'), stroke: col('ink'), 'stroke-width': 0.65, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  return glintLast(out)
}
