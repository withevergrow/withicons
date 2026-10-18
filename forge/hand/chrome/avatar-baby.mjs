// forge/hand/chrome/avatar-baby.mjs: a baby: an oversized round chrome head on tiny narrow shoulders (the big-head,
// small-body proportion is what says baby), a pale inlaid face lit by a soft radial chrome gradient, big wide-set
// ink eyes with catchlights, rosy enamel cheeks, a tiny smile, and one small gunmetal curl wisp on the crown.
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

const SH = 'M7 22 C7 20 9.2 18.9 12 18.9 C14.8 18.9 17 20 17 22 Z'
const BIB = 'M10.2 19C10.4 20.6 11 21.3 12 21.3C13 21.3 13.6 20.6 13.8 19C13.2 19.4 10.8 19.4 10.2 19Z'
const WISP = 'M12 5.3C11.2 4 12.2 2.8 13.3 3.3C14.2 3.8 13.7 5 12.8 4.8'

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-baby'
  const parts = [{ d: SH, fill: true }, { d: oval(12, 11.2, 6.6, 6.4), fill: true }]
  const FACE = oval(12, 11.2, 6.05, 5.85)
  const out = paint(name, parts, [FACE])
  const defs = out[0][0] === 'defs' ? out.shift()[2] : []
  const id = `wg-chrome-${name}-${defs.length}`, st = (o, r) => ['stop', { offset: o, 'stop-color': col(r) }]
  defs.push(['radialGradient', { id, cx: 0.4, cy: 0.3, r: 0.85 }, [st(0, 'shine'), st(0.45, 'tint'), st(1, 'c1')]])
  out.unshift(['defs', {}, defs])
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const gl = gi >= 0 ? out.splice(gi, 1)[0] : null
  out.push(['path', { d: TD(FACE), fill: `url(#${id})`, class: 'wm-k' }])
  out.push(['path', { d: TD(WISP), stroke: col('c3'), 'stroke-width': 1, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }])
  dot(out, 8.9, 11.3, 1.1, 'ink'); dot(out, 15.1, 11.3, 1.1, 'ink')
  dot(out, 9.25, 10.9, 0.36, 'shine', 'wm-shine'); dot(out, 15.45, 10.9, 0.36, 'shine', 'wm-shine')
  dot(out, 7.5, 13.6, 1, 'accent'); dot(out, 16.5, 13.6, 1, 'accent')
  out.push(['path', { d: TD('M10.7 13.7Q12 15.1 13.3 13.7'), stroke: col('ink'), 'stroke-width': 0.75, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  out.push(['path', { d: TD(BIB), fill: col('tint'), class: 'wm-k' }])
  if (gl) out.push(gl)
  return out
}
