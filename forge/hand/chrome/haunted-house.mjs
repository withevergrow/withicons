// forge/hand/chrome/haunted-house.mjs: the common haunted house in chrome: a plain gable roof in gunmetal over chrome walls, an
// arched gunmetal door, a round pale attic window glowing in the gable, and a fat pink enamel crescent moon over the roof.
// The earlier jagged-roof drawing was a different, muddy design at small size; this is the simple silhouette every other style uses.
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

const BODY = 'M4.8 11.2H19.2V19.8A2 2 0 0 1 17.2 21.8H6.8A2 2 0 0 1 4.8 19.8Z'
const ROOF = 'M2.2 12.6L12 3.4L21.8 12.6Z'
const DOOR = 'M9.6 21.8V18C9.6 16.4 10.6 15.3 12 15.3C13.4 15.3 14.4 16.4 14.4 18V21.8Z'
const MOON = 'M21.4 5A2.7 2.7 0 1 1 18.5 1.9A2.1 2.1 0 0 0 21.4 5Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'haunted-house'
  const parts = [{ d: BODY, fill: true }, { d: ROOF, fill: true, plate: 'A' }, { d: DOOR, fill: true, plate: 'A' }, { d: MOON, fill: true, plate: 'S' }]
  const out = paint(name, parts, [oval(12, 9.3, 1.9, 1.9, 32)])
  out.push(['path', { d: TD(oval(12, 9.3, 1.45, 1.45, 32)), fill: col('shine'), class: 'wm-k' }])
  return glintLast(out)
}
