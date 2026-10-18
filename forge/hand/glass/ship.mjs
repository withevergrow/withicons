// forge/hand/glass/ship.mjs — Glass steamship, hand-drawn: the generated ship fused cabin, funnel and hull into one pale
// frosted mass with hairline etches, so the hull had no contrast and the waves melted into it. Here each part is its
// own piece of glass: an accent funnel with a dark smoke band, a frosted cabin with three etched portholes, a deep
// violet hull (thinner frost so the colour shows) overlapping the cabin, and a separate glass wave band below.
// Roles: back/shadow bodies, pane/frost glass, accent funnel + orb, etch portholes + band, shine rims.
// Motion: hull + cabin wm-k, funnel + waves wm-a (the ship rocks about 12 18).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'ship'
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, dx = 0.3, dy = 0.45) => { const e = erode(F, 0.1); return differenceSets(e, translateSet(e, dx, dy)) }

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }

  const funnel = area('M10.1 8.6 V4.35 A1.2 1.2 0 0 1 11.3 3.15 H12.7 A1.2 1.2 0 0 1 13.9 4.35 V8.6 Z')
  const cabin = area('M8 7.5 H16 A1.5 1.5 0 0 1 17.5 9 V13 H6.5 V9 A1.5 1.5 0 0 1 8 7.5 Z')
  const hull = area('M3.35 11.75 H20.65 Q21.6 11.75 21.15 12.6 L19.45 15.85 Q19.1 16.5 18.35 16.5 H5.65 Q4.9 16.5 4.55 15.85 L2.85 12.6 Q2.4 11.75 3.35 11.75 Z')
  const waveLine = parsePath('M3.4 20.2 Q5.1 18.75 6.8 20.2 T10.2 20.2 T13.6 20.2 T17 20.2 T20.4 20.2', 0.15)[0].pts
  const waves = roundStrokeSet(waveLine, 1.75)

  const pane = M => translateSet(erode(M, 0.12), -0.25, -0.25)
  const back = M => translateSet(erode(M, 0.12), 0.5, 0.5)
  const out = []
  const all = unionSets([back(funnel), back(cabin), back(hull), back(waves)])
  const h = translateSet(all, 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])

  const body = grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])
  const frost = (op0, op1, op2) => grad('linearGradient', { x1: 3, y1: 3, x2: 19, y2: 21 }, [stop(0, V.frost, op0), stop(0.4, V.tint, op1), stop(1, V.tint, op2)])
  const glassPiece = (M, cls, fill, edge = 0.32) => {
    const F = pane(M)
    out.push(['path', { d: D(back(M)), fill: body, class: cls }])
    out.push(['path', { d: D(F), fill, stroke: 'currentColor', 'stroke-opacity': edge, 'stroke-width': 0.5, class: cls }])
    return F
  }

  // funnel: luminous accent glass with a dark smoke band near the top
  const Ff = pane(funnel)
  out.push(['path', { d: D(back(funnel)), fill: V.shadow, 'fill-opacity': 0.6, class: 'wm-a' }])
  out.push(['path', { d: D(Ff), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.45, class: 'wm-a' }])
  out.push(['path', { d: D(Ff), fill: grad('linearGradient', { x1: 9.8, y1: 3, x2: 12.2, y2: 8.5 }, [stop(0, V.shine, 0.62), stop(1, V.shine, 0)]), class: 'wm-a' }])
  out.push(['path', { d: 'M10.2 5.05H13.6V6.05H10.2Z', fill: V.etch, 'fill-opacity': 0.55, class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(Ff, 0.25, 0.35)), fill: V.shine, 'fill-opacity': 0.9, class: 'wm-a wm-shine' }])

  // cabin: frosted glass with three etched portholes
  const Fc = glassPiece(cabin, 'wm-k', frost(0.62, 0.52, 0.4))
  out.push(['path', { d: 'M9.1 9.9h0M11.75 9.9h0M14.4 9.9h0', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.66, 'stroke-width': 1.25, 'stroke-linecap': 'round', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(Fc)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // hull: the deepest glass, overlapping the cabin's foot, with an accent glow low in it
  const Fh = pane(hull)
  out.push(['path', { d: D(back(hull)), fill: body, class: 'wm-k' }])
  out.push(['path', { d: D(back(hull)), fill: grad('radialGradient', { cx: 16, cy: 16, r: 6 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', { d: D(Fh), fill: frost(0.42, 0.26, 0.14), stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(Fh)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // waves: their own band of glass under the hull
  const Fw = glassPiece(waves, 'wm-a', frost(0.55, 0.42, 0.3))
  out.push(['path', { d: D(rimOf(Fw, 0.2, 0.35)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-a wm-shine' }])
  return [['defs', {}, defs], ...out]
}
