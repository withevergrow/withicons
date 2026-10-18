// forge/hand/glass/lightbulb-off.mjs: a frosted glass bulb with its screw base, struck through by a slim accent slash that
// runs in a clear moat on both sides (no pale halo). The globe keeps its full silhouette, so the
// unlit bulb stays readable; the base is its own glass and sits well clear of the slash.
// Layers as the rest of Glass: soft shadow, colour body down-right with an accent orb, frosted pane with hairline.
// Motion: bulb and base wm-k, the slash wm-s.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, roundStrokeSet, translateSet, erode } from '../../kernel/bool.mjs'

const OFF = 0.9
const f = v => +v.toFixed(2)
const shape = d => setOf(parsePath(d, 0.15).filter(s => s.closed).map(s => s.pts))
const D = set => setD(set, 0.02)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.55, 'stroke-linejoin': 'round' }

// globe on its tapered neck, the screw base, the slash (24 grid)
const BULB = 'M9.1 15.6C9.1 13.6 4.8 12.4 4.8 8.7A7.2 7.2 0 0 1 19.2 8.7C19.2 12.4 14.9 13.6 14.9 15.6Z'
const BASE = 'M9.4 16.9H14.6V19.3A2.6 2.6 0 0 1 12 21.8A2.6 2.6 0 0 1 9.4 19.3Z'
const SLASH = [[4.4, 2.0], [20.6, 18.2]]

export default function render(icon) {
  const name = (icon && icon.name) || 'lightbulb-off'
  const id = n => `wg-glass-${name}-${n}`, url = n => `url(#${id(n)})`
  const moat = roundStrokeSet(SLASH, 3.3)
  const bulb = differenceSets(shape(BULB), moat), base = differenceSets(shape(BASE), moat)
  const body = unionSets([bulb, base])
  const defs = [
    ['linearGradient', { id: id(0), x1: 4, y1: 2, x2: 21, y2: 22, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.c1), stop(1, V.shadow)]],
    ['radialGradient', { id: id(1), cx: 15.4, cy: 12, r: 7, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.5), stop(0.5, V.accent, 0.18), stop(1, V.accent, 0)]],
    ['linearGradient', { id: id(2), x1: 4, y1: 2, x2: 19, y2: 20, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.frost, 0.55), stop(0.4, V.tint, 0.5), stop(1, V.tint, 0.38)]],
    ['linearGradient', { id: id(3), x1: 20.6, y1: 2, x2: 4.4, y2: 18.2, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent), stop(1, V.accent, 0.85)]],
  ]
  const back = (set, cls) => { const b = translateSet(erode(set, 0.15), OFF, OFF); return [['path', { d: D(b), fill: url(0), 'fill-rule': 'evenodd', class: cls }], ['path', { d: D(b), fill: url(1), 'fill-rule': 'evenodd', class: cls }]] }
  const pane = (set, cls) => ['path', { d: D(set), fill: url(2), ...EDGE, 'fill-rule': 'evenodd', class: cls }]
  const slash = roundStrokeSet(SLASH, 1.7)
  // lit rim just inside the globe's upper-left edge, broken where the moat crosses it
  const [p0, p1] = SLASH, L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
  const off = (x, y) => Math.abs((x - p0[0]) * (p1[1] - p0[1]) - (y - p0[1]) * (p1[0] - p0[0])) / L
  const gr = 7.2 - 0.9, rims = []
  let run = []
  for (let a = 150; a <= 270; a += 5) {
    const x = 12 + gr * Math.cos(a * Math.PI / 180), y = 8.7 + gr * Math.sin(a * Math.PI / 180)
    if (off(x, y) > 2.3) run.push(f(x) + ' ' + f(y))
    else { if (run.length > 2) rims.push('M' + run.join('L')); run = [] }
  }
  if (run.length > 2) rims.push('M' + run.join('L'))
  return [['defs', {}, defs],
    ['path', { d: D(translateSet(body, 0.4, 1.1)), fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.05, 'stroke-width': 1.4, 'stroke-linejoin': 'round', 'fill-rule': 'evenodd', class: 'wm-shadow' }],
    ...back(bulb, 'wm-k'), pane(bulb, 'wm-k'),
    ...back(base, 'wm-k'), pane(base, 'wm-k'),
    // screw thread on the base
    ['path', { d: 'M10.4 19H13.6', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.6, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-k' }],
    ...rims.map(d => ['path', { d, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }]),
    ['path', { d: D(slash), fill: url(3), stroke: V.etch, 'stroke-opacity': 0.28, 'stroke-width': 0.4, class: 'wm-s' }],
    ['path', { d: D(roundStrokeSet([[5.5, 1.7], [19.7, 15.9]], 0.4)), fill: V.shine, 'fill-opacity': 0.7, class: 'wm-s' }],
  ]
}
