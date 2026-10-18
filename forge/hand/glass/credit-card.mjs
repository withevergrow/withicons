// forge/hand/glass/credit-card.mjs — Glass credit card, hand-drawn: the generated card was a pale frosted slab whose
// stripe was a hairline etch, so it washed out on white. Here the violet body sits close behind the pane so more colour
// glows through, the pane has a firmer edge, the magnetic stripe is an etched band clipped to the inside of the hairline
// (flush at both ends, under the lit rim) and the number line is bolder.
// Roles: back/shadow body, pane/frost glass, accent orb, etch stripe + number, shine rim. Motion: body wm-k.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { intersectSets, unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'credit-card'
const K = 0.94
const place = (set, d) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * K + d, 12 + (y - 12) * K + d]))
const area = d => unionSets(parsePath(d).map(s => setOf([s.pts])))
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = erode(F, 0.1); return differenceSets(e, translateSet(e, 0.3, 0.45)) }

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const ev = 'evenodd'

  const card = dilate(area('M4 5 H20 A2 2 0 0 1 22 7 V17 A2 2 0 0 1 20 19 H4 A2 2 0 0 1 2 17 V7 A2 2 0 0 1 4 5 Z'), 0.9)
  const F = place(card, -0.45)
  const B = translateSet(place(erode(card, 0.3), 0), 0.75, 0.75)
  const out = []
  // soft diffuse shadow
  const h = translateSet(B, 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  // the colour body behind, with an accent orb
  const bd = D(B)
  out.push(['path', { d: bd, fill: grad('linearGradient', { x1: 3.5, y1: 6, x2: 22, y2: 21 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 17.4, cy: 16.2, r: 7 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  // frosted pane with a firm hairline
  out.push(['path', {
    d: D(F), fill: grad('linearGradient', { x1: 2, y1: 4.5, x2: 20.5, y2: 18.5 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.5), stop(1, V.tint, 0.36)]),
    stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'fill-rule': ev, class: 'wm-k',
  }])
  // magnetic stripe: an etched band ending flush on the inner side of the hairline
  out.push(['path', { d: D(intersectSets(erode(F, 0.3), place(area('M0 8.5H24V10.6H0Z'), -0.45))), fill: V.etch, 'fill-opacity': 0.58, class: 'wm-k' }])
  // card number
  out.push(['path', { d: 'M5.9 14.35H9.6', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.75, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-k' }])
  // light rim on the lit edges
  out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
