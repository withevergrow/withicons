// forge/hand/chrome/avatar-man-bald.mjs: a bald man: a smooth chrome dome with no hair at all (the pale skin inlay runs
// right up to a thin metal rim and a bright crown glint is the baldness), thick brows, ink eyes, a short moustache and
// smile, chrome ears and wide square shoulders. A soft radial gradient on the skin gives it chrome light.
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

const SH = 'M4.5 22 C4.5 18.8 7.8 17.2 12 17.2 C16.2 17.2 19.5 18.8 19.5 22 Z'
const EAR = (s) => oval(12 + s * 5.9, 11.6, 1.2, 1.8)
const MOU = 'M9.6 13.7C10.4 12.9 11.5 13.2 12 13.6C12.5 13.2 13.6 12.9 14.4 13.7C13.5 14.4 12.5 14.1 12 13.9C11.5 14.1 10.5 14.4 9.6 13.7Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-man-bald'
  const parts = [{ d: SH, fill: true }, { d: EAR(-1), fill: true }, { d: EAR(1), fill: true }, { d: oval(12, 10.4, 5.8, 6.4), fill: true }]
  const FACE = oval(12, 10.5, 5.5, 6.05)
  const out = paint(name, parts, [FACE])
  const defs = out[0][0] === 'defs' ? out.shift()[2] : []
  const id = `wg-chrome-${name}-${defs.length}`, st = (o, r) => ['stop', { offset: o, 'stop-color': col(r) }]
  defs.push(['radialGradient', { id, cx: 0.42, cy: 0.25, r: 0.9 }, [st(0, 'shine'), st(0.5, 'tint'), st(1, 'c1')]])
  out.unshift(['defs', {}, defs])
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const gl = gi >= 0 ? out.splice(gi, 1)[0] : null
  out.push(['path', { d: TD(FACE), fill: `url(#${id})`, class: 'wm-k' }])
  out.push(['path', { d: TD('M8.6 6C9.6 4.9 11 4.5 12.4 4.6'), stroke: col('shine'), 'stroke-width': 0.9, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  for (const x of [9.8, 14.2]) {
    dot(out, x, 10.9, 0.8, 'ink')
    out.push(['path', { d: TD('M' + (x - 1.3) + ' 9.2Q' + x + ' 8.4 ' + (x + 1.3) + ' 9.2'), stroke: col('ink'), 'stroke-width': 0.95, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  }
  out.push(['path', { d: TD(MOU), fill: col('ink'), class: 'wm-k' }])
  out.push(['path', { d: TD('M10.4 15.3Q12 16.5 13.6 15.3'), stroke: col('ink'), 'stroke-width': 0.7, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  if (gl) out.push(gl)
  return out
}
