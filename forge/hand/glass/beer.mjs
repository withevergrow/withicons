// forge/hand/glass/beer.mjs — a clear glass beer mug full of deep colour under a bright frothy head: the generated mug
// frosted the whole body to a pale lilac slab with a pale head, so it read as a blob or a bucket. Here the beer is the
// colour body (deep, seen through a clearer pane), the foam is an opaque bright crown with a drip over the rim, the
// handle is a clear glass loop and the two facets are lit glass stripes.
// Roles: back/shadow beer, pane/frost glass + foam, accent orb, shine rims. Motion: mug wm-k, foam + facets wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'beer'
const MUG = 'M4 9.5 H16 V19.5 A2 2 0 0 1 14 21.5 H6 A2 2 0 0 1 4 19.5 Z'
const HANDLE = 'M15.5 11.6 H17.9 A2.1 2.1 0 0 1 20 13.7 V15.9 A2.1 2.1 0 0 1 17.9 18 H15.5'
const FOAM = 'M4.6 10.7 C2.5 9.6 2.9 5.7 6.5 5.7 C7.6 3.1 12.3 2.6 13.6 5.1 C16.3 4.7 17.8 8.1 15.7 10 C15.3 10.7 14.5 10.8 14 10.3 C13.4 11 12.5 11 12 10.4 C11.6 10.8 11 10.9 10.5 10.6 V11.9 A1 1 0 0 1 8.5 11.9 V10.6 C7.9 11 7 11 6.4 10.5 C5.9 11 5.1 11 4.6 10.7 Z'

const area = d => unionSets(parsePath(d).map(s => setOf([s.pts])))
const D = (set, t = 0.03) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.06), t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const ev = 'evenodd'

  const mug = area(MUG)
  const handle = differenceSets(roundStrokeSet(parsePath(HANDLE)[0].pts, 2.1), mug)
  const foam = area(FOAM)
  const Fm = translateSet(mug, -0.3, -0.3), Bm = translateSet(mug, 0.7, 0.55)
  const Fh = translateSet(handle, -0.3, -0.3), Bh = translateSet(handle, 0.7, 0.55)
  const Ff = translateSet(foam, -0.3, -0.3)
  const out = []
  // soft diffuse shadow
  const drop = D(translateSet(unionSets([Bm, Bh]), 0, 0.5), 0.06)
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  // the beer: the colour body behind, deep, with an accent glow low right; the handle's body is a lighter echo
  const body = grad('linearGradient', { x1: 4, y1: 9, x2: 17, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  out.push(['path', { d: D(Bh), fill: body, 'fill-opacity': 0.5, class: 'wm-k' }])
  const bd = D(Bm)
  out.push(['path', { d: bd, fill: body, class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 13.2, cy: 17.6, r: 6.5 }, [stop(0, V.accent, 0.55), stop(0.5, V.accent, 0.2), stop(1, V.accent, 0)]), class: 'wm-k' }])
  // the glass: a clearer pane than usual so the beer reads deep, with a currentColor hairline
  const pane = grad('linearGradient', { x1: 3.5, y1: 9, x2: 17, y2: 21.5 }, [stop(0, V.frost, 0.5), stop(0.45, V.tint, 0.32), stop(1, V.tint, 0.2)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.28, 'stroke-width': 0.5, 'stroke-linejoin': 'round', 'fill-rule': ev, class: 'wm-k' }
  out.push(['path', { d: D(Fh), fill: V.frost, 'fill-opacity': 0.45, ...edge }])
  out.push(['path', { d: D(Fm), fill: pane, ...edge }])
  // facets: two lit glass stripes, and the lit left wall of the mug
  out.push(['path', { d: 'M7.7 13.6V17.9M11.7 13.6V17.9', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 1.05, 'stroke-linecap': 'round', class: 'wm-a' }])
  out.push(['path', { d: 'M4.2 12V18.9', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  out.push(['path', { d: 'M17.9 11.8A1.6 1.6 0 0 1 19.3 13.4', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }])
  // the head: an opaque bright crown with a drip, a soft shade on its lower edge, lit bubbles
  out.push(['path', { d: D(translateSet(Ff, 0.3, 0.5)), fill: V.shadow, 'fill-opacity': 0.22, class: 'wm-a' }])
  out.push(['path', {
    d: D(Ff), fill: grad('linearGradient', { x1: 7, y1: 3, x2: 10, y2: 12 }, [stop(0, V.frost), stop(0.55, V.frost, 0.97), stop(1, V.tint)]),
    stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a',
  }])
  out.push(['path', { d: 'M6.8 8.1h0M11.1 6.9h0M13.9 8.5h0', fill: 'none', stroke: V.c1, 'stroke-opacity': 0.32, 'stroke-width': 0.95, 'stroke-linecap': 'round', class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
