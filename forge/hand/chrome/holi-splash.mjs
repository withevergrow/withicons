// forge/hand/chrome/holi-splash.mjs — an irregular chrome colour burst with drip arms and big hot-pink enamel blobs.
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

const SPLASH = 'M12 3.2 C13.4 3.2 13.6 5.6 14.6 6 C15.8 6.4 17.4 4 18.6 5.2 C19.8 6.4 17.6 8 18 9.4 C18.4 10.6 21 10.6 21 12.2 C21 13.8 18.4 13.6 18.2 14.8 C18 16 19.6 17.6 18.6 18.6 C17.4 19.8 16 17.6 14.8 18 C13.8 18.4 14.2 20.8 12.4 20.8 C10.8 20.8 11 18.6 9.8 18.2 C8.6 17.8 7 19.6 5.8 18.6 C4.6 17.4 6.6 16 6.2 14.8 C5.8 13.6 3 14 3 12.2 C3 10.4 5.6 10.6 6 9.4 C6.4 8.2 4.6 6.6 5.6 5.6 C6.8 4.4 8.2 6.6 9.4 6.2 C10.6 5.8 10.6 3.2 12 3.2 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'holi-splash'
  const out = paint(name, [{ d: SPLASH, fill: true }], [])
  out.push(dot(12, 12, 3.3, 'edge', 'wm-s'), dot(12, 12, 2.7, 'accent'), dot(11.1, 11.1, 0.8, 'shine'))
  out.push(dot(16.2, 16.4, 1.5, 'accent'), dot(7.4, 8, 1.3, 'accent'), dot(16.6, 7.8, 1, 'accent'), dot(20.6, 18.6, 1.1, 'accent', 'wm-deco'), dot(3.6, 4.8, 0.9, 'accent', 'wm-deco'), dot(3.4, 18.8, 0.7, 'accent', 'wm-deco'))
  return glintLast(out)
}
