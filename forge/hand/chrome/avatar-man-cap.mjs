// forge/hand/chrome/avatar-man-cap.mjs — a man in a baseball cap: a dark gunmetal crown and a forward brim sitting on a
// chrome head, a pale face inlay with two ink eyes and a smile, over chrome shoulders. The generated cap was cut
// across the head by a fat groove that read as a visor or goggles; here the cap is one solid dark piece.
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

const HEAD = 'M6.5 10.5 A5.5 6 0 1 1 17.5 10.5 A5.5 6 0 1 1 6.5 10.5 Z'
const CROWN = 'M6.5 9.2 C6.3 5.4 8.6 2.9 12 2.9 C15.4 2.9 17.7 5.4 17.5 9.2 Z'
const BRIM = 'M16.6 8.4 L20.8 8.4 C21.8 8.4 21.8 9.7 20.8 10 C19.6 10.5 18 10.5 16.6 10 Z'
const SH = 'M4.5 22 C4.5 18.8 7.8 17.2 12 17.2 C16.2 17.2 19.5 18.8 19.5 22 Z'
const FACE = 'M7.7 11.4 C9.4 11.1 14.6 11.1 16.3 11.4 C16.5 14.8 14.7 16.5 12 16.5 C9.3 16.5 7.5 14.8 7.7 11.4 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-man-cap'
  const Ls = layers(model(skeleton(name, [
    { d: HEAD, fill: true },
    { d: SH, fill: true },
  ], [FACE, CROWN, BRIM])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  // the cap: one solid gunmetal piece (own ramp) laid into the hole cut for it, with a dark edge and a light sickle
  const defs = out[0][0] === 'defs' ? out.shift()[2] : []
  const id = `wg-chrome-${name}-${defs.length}`, st = (o, r) => ['stop', { offset: o, 'stop-color': col(r) }]
  defs.push(['linearGradient', { id, x1: 0, y1: f(2.9, 1), x2: 0, y2: f(10.5, 1), gradientUnits: 'userSpaceOnUse' }, [st(0, 'tint'), st(0.3, 'c1'), st(0.62, 'c2'), st(0.64, 'c3'), st(1, 'c2')]])
  const cap = d => ({ d: TD(d), fill: `url(#${id})`, stroke: col('shadow'), 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' })
  out.unshift(['defs', {}, defs])
  const glint = out.pop()
  out.push(['path', cap(BRIM)], ['path', cap(CROWN)])
  out.push(['path', { d: TD('M7.6 7.6 C8 5.6 9.4 4.2 11.2 3.9'), fill: 'none', stroke: col('shine'), 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, class: 'wm-shine' }])
  out.push(['path', { d: TD(FACE), fill: col('tint'), class: 'wm-k' }])
  for (const x of [10.2, 13.8]) out.push(['circle', { cx: f(x, 0), cy: f(13.1, 1), r: r2(0.65 * K.SCALE), fill: col('ink'), class: 'wm-k' }])
  out.push(['path', { d: TD('M10.3 14.6 Q12 16 13.7 14.6'), fill: 'none', stroke: col('ink'), 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-k' }])
  out.push(glint)
  return out
}
