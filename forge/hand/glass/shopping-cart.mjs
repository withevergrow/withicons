// forge/hand/glass/shopping-cart.mjs — Glass shopping cart, hand-drawn: the generated cart was thin and pale, its handle
// a white frosted tube that vanished on white and its wheels hollow frosted rings. Here the basket is a full frosted pane
// over the violet colour body with a firm hairline, the handle is a solid violet glass rod running into the basket, and
// the wheels are deep violet glass beads with a specular dot, so the cart reads at 16px.
// The rod ends cleanly at the basket's hairline (one hairline at the junction), its bend has a wide radius so the tube
// has no inner notch and its rim runs as one smooth highlight, and the wheels sit about 1.5u under the basket.
// Roles: back/shadow body, handle and wheels, pane/frost basket, accent orb, shine rim. Motion: the whole cart rolls (wm-k).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, circle } from '../../kernel/geom.mjs'
import { roundStrokeSet, unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'shopping-cart'
const K = 0.94
const place = (set, d) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * K + d, 12 + (y - 12) * K + d]))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const tube = (d, w) => unionSets(parsePath(d, 0.15).map(s => roundStrokeSet(s.pts, w, s.closed)))
const soften = (set, r) => dilate(erode(set, r), r)
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, w = 0.45) => { const e = erode(F, 0.08); return differenceSets(e, translateSet(e, w * 0.66, w)) }

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }

  // the basket as the frame draws it (fill grown by the frame's half stroke), the handle rod and two wheels
  const basket = soften(dilate(area('M5.25 7 H20.5 L18.25 13.8 A1 1 0 0 1 17.3 14.5 H7.68 A1 1 0 0 1 6.7 13.8 Z'), 1.15), 0.4)
  const handle = tube('M2.2 3.2 H2.9 A1.6 1.6 0 0 1 4.46 4.46 L4.9 6.5', 2.4)
  const wheels = setOf([circle(8.5, 19, 1.95, 0.12), circle(17, 19, 1.95, 0.12)])
  const F = place(basket, -0.45)
  const B = translateSet(place(erode(basket, 0.3), 0), 0.7, 0.7)
  const R = differenceSets(place(handle, -0.25), dilate(F, 0.15))
  const W = place(wheels, -0.2)
  const out = []
  const h = translateSet(unionSets([B, R, W]), 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  const body = grad('linearGradient', { x1: 2.5, y1: 3, x2: 21, y2: 21.5 }, [stop(0, V.c1), stop(1, V.shadow)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.45 }
  // handle rod: solid violet glass, ending at the basket's edge
  out.push(['path', { d: D(R), fill: body, ...edge, class: 'wm-k' }])
  // colour body with the accent orb
  const bd = D(B)
  out.push(['path', { d: bd, fill: body, class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 16.6, cy: 13.4, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  // basket: frosted pane, firm hairline
  out.push(['path', {
    d: D(F), fill: grad('linearGradient', { x1: 4.5, y1: 5.5, x2: 18, y2: 15 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.48), stop(1, V.tint, 0.34)]),
    ...edge, 'stroke-opacity': 0.32, 'stroke-width': 0.5, class: 'wm-k',
  }])
  // wheels: violet glass beads
  out.push(['path', { d: D(W), fill: body, ...edge, class: 'wm-k' }])
  // light rims: basket, handle, wheels
  out.push(['path', { d: D(unionSets([rimOf(F), rimOf(R, 0.36), rimOf(W, 0.4)])), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
