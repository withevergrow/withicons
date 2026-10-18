// forge/hand/glass/phone-off.mjs: one whole frosted handset struck through by a slim accent slash that runs in a clean moat,
// so both halves keep their pane, colour and rim and no pale halo is left around the bar.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const D = set => setD(set, 0.03)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = erode(F, 0.1); return differenceSets(e, translateSet(e, 0.3, 0.45)) }

const HANDSET = 'M3 5A2 2 0 0 1 5 3H8A1.5 1.5 0 0 1 9.5 4.5V6C9.5 7.25 8.5 7.25 8.5 8.5A7 7 0 0 0 15.5 15.5C16.75 15.5 16.75 14.5 18 14.5H19.5A1.5 1.5 0 0 1 21 16V19A2 2 0 0 1 19 21A16 16 0 0 1 3 5Z'
const SLASH = [[20.4, 3.6], [3.6, 20.4]]

export default function render() {
  const NAME = 'phone-off'
  const defs = []
  let n = 0
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const blue = grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 21 }, [stop(0, V.c1), stop(1, V.shadow)])
  const frost = grad('linearGradient', { x1: 3, y1: 3, x2: 19, y2: 19 }, [stop(0, V.frost, 0.62), stop(0.45, V.tint, 0.48), stop(1, V.tint, 0.34)])
  const glow = grad('radialGradient', { cx: 17, cy: 17, r: 7.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const bar = grad('linearGradient', { x1: 20.4, y1: 3.6, x2: 3.6, y2: 20.4 }, [stop(0, V.accent), stop(1, V.accent, 0.82)])

  const moat = roundStrokeSet(SLASH, 3.6)
  const F = differenceSets(area(HANDSET), moat)
  const B = differenceSets(translateSet(erode(F, 0.3), 0.55, 0.55), moat)
  const slash = roundStrokeSet(SLASH, 1.8)
  const sheen = roundStrokeSet([[20.1, 3.3], [3.3, 20.1]], 0.45)
  const h = translateSet(unionSets([F, slash]), 0.55, 1)
  return [['defs', {}, defs],
    ['path', { d: D(dilate(h, 0.8)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['path', { d: D(dilate(h, 0.3)), fill: V.shadow, 'fill-opacity': 0.09, class: 'wm-shadow' }],
    ['path', { d: D(B), fill: blue, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: D(B), fill: glow, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: D(F), fill: frost, stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }],
    ['path', { d: D(slash), fill: bar, stroke: V.etch, 'stroke-opacity': 0.28, 'stroke-width': 0.4, class: 'wm-s' }],
    ['path', { d: D(sheen), fill: V.shine, 'fill-opacity': 0.7, class: 'wm-s' }],
  ]
}
