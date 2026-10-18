// forge/hand/chrome/avatar-older-woman.mjs: an older woman: a smooth gunmetal grey hair cap crowned with a round bun over a pale
// inlaid face with round ink-rimmed glasses, two eyes and a smile, over chrome shoulders. Hair and face are cleanly
// separated tones (the generated drawing was scribbly noise that read as a skull); glasses and bun say grandma.
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
const HAIR = 'M6 12.2C5.2 6.8 8 4.2 12 4.2C16 4.2 18.8 6.8 18 12.2C17.7 10.2 16.7 8.8 15.4 8.2C13.6 9.2 11 8.8 9.2 8.3C7.6 8.3 6.4 10 6 12.2Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-older-woman'
  const parts = [{ d: SH, fill: true }, { d: HAIR, fill: true, plate: 'A' }, { d: oval(12, 3.6, 1.9, 1.7), fill: true, plate: 'A' }]
  const out = paint(name, parts, [oval(12, 12.4, 4.7, 4.8)])
  out.push(['path', { d: TD(oval(12, 12.4, 4.1, 4.2)), fill: col('shine'), class: 'wm-k' }])
  const rim = { fill: 'none', stroke: col('c3'), 'stroke-width': 0.6, class: 'wm-k' }
  for (const x of [10, 14]) {
    out.push(['path', { d: TD(oval(x, 12.5, 1.4, 1.4, 28)), ...rim }])
    dot(out, x, 12.5, 0.5, 'ink')
  }
  out.push(['path', { d: TD('M11.4 12.2Q12 11.8 12.6 12.2'), ...rim, 'stroke-width': 0.5 }])
  out.push(['path', { d: TD('M10.5 15Q12 16.1 13.5 15'), stroke: col('ink'), 'stroke-width': 0.65, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  return glintLast(out)
}
