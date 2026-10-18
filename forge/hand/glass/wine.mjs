// forge/hand/glass/wine.mjs — a clear glass goblet holding deep colour wine, on a firm stem and foot: the generated glass
// frosted the whole bowl to one pale lilac shape with a hairline surface, so on white the bowl washed out and the stem
// and bowl merged. Here only the wine is the colour body (deep, with an accent glow), the empty top of the bowl is clear
// glass with a lit rim, the wine surface is a lit oval, and the stem and foot are a firmer tinted glass.
// Roles: back/shadow wine + stem, pane/frost glass, accent glow, shine rims. Motion: glass wm-k, wine wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, rect, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, intersectSets, differenceSets, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'wine'
const BOWL = 'M6.5 2.5 H17.5 C18.5 6 18.5 8.5 17 11 C15.75 13 14 14 12 14 C10 14 8.25 13 7 11 C5.5 8.5 5.5 6 6.5 2.5 Z'
const STEM = 'M10.9 13.4 H13.1 V20.3 H10.9 Z'
const FOOT = 'M8.4 19.7 H15.6 A1.05 1.05 0 0 1 15.6 21.8 H8.4 A1.05 1.05 0 0 1 8.4 19.7 Z'
const LEVEL = 7.2

const area = d => unionSets(parsePath(d).map(s => setOf([s.pts])))
const D = (set, t = 0.03) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.06), t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const ev = 'evenodd'

  const bowl = area(BOWL)
  const base = unionSets([area(STEM), area(FOOT)])
  const wine = intersectSets(bowl, setOf([rect(0, LEVEL, 24, 24)]))
  const Fb = translateSet(bowl, -0.3, -0.3), Fs = translateSet(differenceSets(base, bowl), -0.3, -0.3)
  const Fall = translateSet(unionSets([bowl, base]), -0.3, -0.3)
  const Bw = translateSet(wine, 0.6, 0.55), Bs = translateSet(base, 0.45, 0.4)
  const out = []
  // soft diffuse shadow
  const drop = D(translateSet(unionSets([translateSet(bowl, 0.6, 0.55), Bs]), 0, 0.5), 0.06)
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.05, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.03, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  // colour bodies behind: the stem and foot, and the wine with an accent glow
  const body = grad('linearGradient', { x1: 6, y1: 6, x2: 18, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])
  out.push(['path', { d: D(Bs), fill: body, class: 'wm-k' }])
  const wd = D(Bw)
  out.push(['path', { d: wd, fill: body, class: 'wm-a' }])
  out.push(['path', { d: wd, fill: grad('radialGradient', { cx: 14.6, cy: 11.4, r: 5.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-a' }])
  // the glass: bowl and base panes, clearer than usual so the wine reads deep, with a currentColor hairline
  // (the stem pane is cut by the bowl, and one hairline traces the whole goblet so the joint is smooth)
  out.push(['path', { d: D(Fs), fill: grad('linearGradient', { x1: 8, y1: 13, x2: 15, y2: 22 }, [stop(0, V.frost, 0.45), stop(1, V.tint, 0.2)]), 'fill-rule': ev, class: 'wm-k' }])
  out.push(['path', { d: D(Fb), fill: grad('linearGradient', { x1: 5.5, y1: 2, x2: 17.5, y2: 14 }, [stop(0, V.frost, 0.55), stop(0.45, V.tint, 0.36), stop(1, V.tint, 0.22)]), 'fill-rule': ev, class: 'wm-k' }])
  out.push(['path', { d: D(Fall), fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }])
  // the wine surface: a lit oval across the bowl
  const oval = intersectSets(area('M5.95 7.15A6.05 0.8 0 0 1 18.05 7.15A6.05 0.8 0 0 1 5.95 7.15Z'), translateSet(bowl, -0.45, -0.35))
  out.push(['path', { d: D(oval, 0.02), fill: V.c1, 'fill-opacity': 0.75, stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.4, class: 'wm-a' }])
  // lit rims: the bowl's left wall and lip, the stem's left edge
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }
  out.push(['path', { d: 'M8.6 2.65H6.55C5.8 5.3 5.65 7.5 6.3 9.5', ...rim }])
  out.push(['path', { d: 'M11.05 14.6V18.9', ...rim, 'stroke-width': 0.45 }])
  return [['defs', {}, defs], ...out]
}
