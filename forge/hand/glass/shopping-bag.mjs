// forge/hand/glass/shopping-bag.mjs — a frosted glass bag with a real handle. Generated Glass drew the handle as a
// 0.7u etch hairline that vanished against the pane; here it is a thick opaque arc in the body's deep violet, standing
// clear above the bag and continuing, softened, through the frosted glass down to two bright eyelets. Pane, colour body,
// accent orb and lit rim as the family. Roles: back/shadow body + handle, pane/frost glass, accent orb, shine rim.
// Motion: bag wm-k, handle wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, area as ringArea } from '../../kernel/geom.mjs'
import { setOf, translateSet } from '../../kernel/bool.mjs'

const NAME = 'shopping-bag'
const BAG = 'M6.5 8 H17.5 A1.5 1.5 0 0 1 19 9.4 L19.8 19.4 A2 2 0 0 1 17.8 21.5 H6.2 A2 2 0 0 1 4.2 19.4 L5 9.4 A1.5 1.5 0 0 1 6.5 8 Z'
const D = (set, t = 0.03) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.06), t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const bag = setOf(parsePath(BAG).map(s => s.pts))
  const front = translateSet(bag, -0.3, -0.3)
  const back = translateSet(bag, 0.7, 0.8)
  const out = []

  // diffuse shadow
  const drop = D(translateSet(back, 0, 0.5), 0.06)
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])

  // the handle: a thick opaque arc behind the pane (its feet show through the frost), lit along its top-left
  const H = 'M7.2 10.4C7.2 2.4 16.8 2.4 16.8 10.4'
  out.push(['path', { d: H, fill: 'none', stroke: V.shadow, 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: 'M8.3 8C8.6 5.4 10.2 4.4 12 4.4', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a' }])

  // colour body + accent orb
  const bd = D(back)
  out.push(['path', { d: bd, fill: grad('linearGradient', { x1: 4, y1: 8, x2: 21, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 15.5, cy: 17.5, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  // frosted pane
  out.push(['path', {
    d: D(front), fill: grad('linearGradient', { x1: 4, y1: 7.5, x2: 19.5, y2: 21.5 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]),
    stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k',
  }])
  // eyelets where the handle goes in
  for (const x of [7.2, 16.8]) out.push(['circle', { cx: x, cy: 10.3, r: 0.75, fill: V.frost, 'fill-opacity': 0.9, stroke: V.etch, 'stroke-opacity': 0.5, 'stroke-width': 0.5, class: 'wm-k' }])
  // lit rim: top edge and left side
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }
  out.push(['path', { d: 'M17 7.9H6.9Q5.7 7.9 5.5 9L4.8 12.8', ...rim }])
  return [['defs', {}, defs], ...out]
}
