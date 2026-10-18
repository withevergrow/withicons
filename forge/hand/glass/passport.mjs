// forge/hand/glass/passport.mjs — Glass passport, hand-drawn: the generated booklet was a frosted slab with a solid
// round dot and a dash, so it read as a phone or an ID card. Here the cover carries the real passport cues: a shaded
// spine band behind an etched binding groove on the left, an etched globe emblem (rim, equator, meridian) on a tinted
// disc, and a title line under it; the violet body sits close behind a thinner frost so the cover keeps its colour.
// Roles: back/shadow body + spine, pane/frost glass, accent orb, etch globe + groove + title, shine rim. Motion: wm-k.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, intersectSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'passport'
const K = 0.95
const place = (set, d, k = K) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * k + d, 12 + (y - 12) * k + d]))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = erode(F, 0.1); return differenceSets(e, translateSet(e, 0.3, 0.45)) }

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const etch = (d, w = 0.85, op = 0.7) => ['path', { d, fill: 'none', stroke: V.etch, 'stroke-opacity': op, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }]

  // portrait booklet on the 16x20 keyline, cover corners r2
  const book = area('M6.5 2.5 H17.5 A2 2 0 0 1 19.5 4.5 V19.5 A2 2 0 0 1 17.5 21.5 H6.5 A2 2 0 0 1 4.5 19.5 V4.5 A2 2 0 0 1 6.5 2.5 Z')
  const F = place(book, -0.4)
  const B = translateSet(place(book, 0), 0.6, 0.6)
  const out = []
  const h = translateSet(B, 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  const bd = D(B)
  out.push(['path', { d: bd, fill: grad('linearGradient', { x1: 4.5, y1: 3, x2: 21, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 16.2, cy: 17.6, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', {
    d: D(F), fill: grad('linearGradient', { x1: 4, y1: 2.5, x2: 19, y2: 20 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.48), stop(1, V.tint, 0.34)]),
    stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, class: 'wm-k',
  }])
  // the spine: a shaded band on the bound edge, closed by an etched binding groove
  const spine = intersectSets(erode(F, 0.25), setOf([[[0, 0], [7.15, 0], [7.15, 24], [0, 24]]]))
  out.push(['path', { d: D(spine), fill: V.shadow, 'fill-opacity': 0.26, class: 'wm-k' }])
  out.push(etch('M7.55 3.7V20.1', 0.6, 0.5))
  // globe emblem: a tinted disc with an etched rim, equator and meridian
  const gx = 12.85, gy = 9.6, r = 3.4
  out.push(['path', { d: `M${gx - r} ${gy}A${r} ${r} 0 1 0 ${gx + r} ${gy}A${r} ${r} 0 1 0 ${gx - r} ${gy}Z`, fill: V.etch, 'fill-opacity': 0.14, class: 'wm-k' }])
  out.push(etch(`M${gx - r} ${gy}A${r} ${r} 0 1 0 ${gx + r} ${gy}A${r} ${r} 0 1 0 ${gx - r} ${gy}ZM${gx - r} ${gy}H${gx + r}M${gx} ${gy - r}A1.45 ${r} 0 0 0 ${gx} ${gy + r}A1.45 ${r} 0 0 0 ${gx} ${gy - r}Z`))
  // title line under the emblem
  out.push(etch('M10.35 16.6H15.35', 0.9, 0.72))
  out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
