// forge/hand/glass/cauldron.mjs — Glass cauldron, hand-drawn: the generated drawing fused lip, belly and feet into one
// pale lumpy pane with the lip only a faint etched line, so it read as a piggy bank or a teapot. Here the round belly
// stands on two short distinct feet, the thick lip is its own overhanging glass slab with a soft shadow under it, a
// luminous accent brew domes over the rim, and three accent bubbles rise from it.
// Roles: back/shadow body, pane/frost glass, accent brew + bubbles, shine rims. Motion: body wm-k (breathe about 12 21),
// bubbles are plate S (wm-s, rise about 12.5 4).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'cauldron'
const K = 0.94
const place = (set, d) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * K + d, 12 + (y - 12) * K + d]))
const area = d => unionSets(parsePath(d, 0.25).map(s => setOf([s.pts])))
const D = set => setD(set, 0.06)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, w = 0.45) => { const e = erode(F, 0.08); return differenceSets(e, translateSet(e, w * 0.66, w)) }
const disc = (cx, cy, r) => `M${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}Z`

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }

  const belly = area('M7.5 11.5C2.2 13.2 2.2 18.25 6.5 19.75C8 20.25 10 20.5 12 20.5C14 20.5 16 20.25 17.5 19.75C21.8 18.25 21.8 13.2 16.5 11.5Z')
  const feet = area('M6.3 19.4L5.4 21.9H8.9L9.6 20.2Z M17.7 19.4L18.6 21.9H15.1L14.4 20.2Z')
  const lip = area('M6.9 8.9H17.1A1.6 1.6 0 0 1 17.1 12.1H6.9A1.6 1.6 0 0 1 6.9 8.9Z')
  const brew = area('M8.2 9.3C9.2 7.3 14.8 7.3 15.8 9.3Z')
  const bubbles = area(disc(9.5, 4.6, 0.95) + disc(15, 3.5, 1.5) + disc(12, 6.4, 0.6))
  const F = place(unionSets([belly, feet]), -0.45)
  const L = place(lip, -0.45)
  const R = place(brew, -0.45)
  const S = place(bubbles, -0.45)
  const B = translateSet(place(erode(unionSets([belly, feet, lip]), 0.35), 0), 0.55, 0.5)
  const out = []
  const h = translateSet(B, 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  const body = grad('linearGradient', { x1: 3, y1: 8, x2: 21, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const bd = D(B)
  out.push(['path', { d: bd, fill: body, class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 15.2, cy: 17.6, r: 7 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
  const pane = grad('linearGradient', { x1: 3.5, y1: 8, x2: 19.5, y2: 22 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.5), stop(1, V.tint, 0.36)])
  // the frosted round belly on its feet
  out.push(['path', { d: D(F), fill: pane, 'fill-rule': 'evenodd', ...edge, class: 'wm-k' }])
  // the bubbling brew dome rising over the rim
  const rd = D(R)
  out.push(['path', { d: rd, fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.18, 'stroke-width': 0.35, class: 'wm-k' }])
  out.push(['path', { d: rd, fill: grad('linearGradient', { x1: 11, y1: 7.2, x2: 12, y2: 9.6 }, [stop(0, V.shine, 0.6), stop(1, V.shine, 0)]), class: 'wm-k' }])
  // soft shadow the lip casts on the belly, then the thick lip slab itself
  out.push(['path', { d: D(translateSet(erode(L, 0.3), 0.35, 0.75)), fill: V.shadow, 'fill-opacity': 0.24, class: 'wm-shadow' }])
  out.push(['path', { d: D(L), fill: pane, ...edge, 'stroke-opacity': 0.38, class: 'wm-k' }])
  out.push(['path', { d: D(L), fill: V.frost, 'fill-opacity': 0.25, class: 'wm-k' }])
  // luminous accent bubbles
  const sd = D(S)
  out.push(['path', { d: sd, fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.14, 'stroke-width': 0.4, class: 'wm-s' }])
  out.push(['path', { d: sd, fill: grad('linearGradient', { x1: 8, y1: 1.5, x2: 12, y2: 6.5 }, [stop(0, V.shine, 0.7), stop(1, V.shine, 0)]), class: 'wm-s' }])
  out.push(['path', { d: D(rimOf(S, 0.3)), fill: V.shine, 'fill-opacity': 0.9, 'fill-rule': 'evenodd', class: 'wm-s' }])
  // lit rims: lip and belly
  out.push(['path', { d: D(unionSets([rimOf(L, 0.5), rimOf(F)])), fill: V.shine, 'fill-opacity': 0.85, 'fill-rule': 'evenodd', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
