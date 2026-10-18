// forge/hand/glass/send-horizontal.mjs — Glass paper plane, hand-drawn: the generated plane was one flat pale pane with
// a hairline etch, so it washed out at 16px and had no fold. Here the violet body sits close behind a thinner frost with
// a firm hairline, the tips are softly rounded, and the lower wing is a shaded facet under a crisp fold line, so the
// paper plane reads as folded paper pointing right even at small sizes.
// Roles: back/shadow body, pane/frost glass, accent orb, shadow facet, etch fold, shine rim. Motion: whole plane wm-k.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, intersectSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'send-horizontal'
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const place = (set, d, k = 0.95) => set.map(r => r.map(([x, y]) => [12 + (x - 12) * k + d, 12 + (y - 12) * k + d]))
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = erode(F, 0.1); return differenceSets(e, translateSet(e, 0.3, 0.45)) }

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }

  // the dart: the skeleton's silhouette, convex tips softened
  const M = area('M3.83 4.44 Q3.5 3.5 4.4 3.93 L20.42 11.49 Q21.5 12 20.42 12.51 L4.4 20.07 Q3.5 20.5 3.83 19.56 L6.3 12.57 Q6.5 12 6.3 11.43 Z')
  const F = place(M, -0.35)
  const B = translateSet(place(M, 0), 0.6, 0.6)
  const out = []
  const h = translateSet(B, 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  const bd = D(B)
  out.push(['path', { d: bd, fill: grad('linearGradient', { x1: 3.5, y1: 4, x2: 20, y2: 21 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 12.5, cy: 15.5, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  // frosted pane: thinner frost so the violet glows through, firm hairline
  out.push(['path', {
    d: D(F), fill: grad('linearGradient', { x1: 3, y1: 3, x2: 18, y2: 19 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.48), stop(1, V.tint, 0.34)]),
    stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, class: 'wm-k',
  }])
  // the lower wing sits in shade under the fold
  const low = intersectSets(place(M, -0.2, 0.9), setOf([[[0, 11.7], [24, 11.7], [24, 24], [0, 24]]]))
  out.push(['path', { d: D(low), fill: V.shadow, 'fill-opacity': 0.22, class: 'wm-k' }])
  // the fold: a crisp etched crease from the notch toward the nose
  out.push(['path', { d: 'M6.8 11.7H14.2', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.66, 'stroke-width': 0.85, 'stroke-linecap': 'round', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
