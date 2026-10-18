// forge/hand/glass/baby-bottle.mjs — Glass baby bottle, hand-drawn: the generated bottle fused teat, collar and body into
// one frosted mass with three etched lines, so at 16px the teat melted into the bottle and it read as a jar. Here the
// teat is the hero: a round glass bulb on a pinched neck flaring to a flange, standing a clear 1u above a collar that is
// only a hair wider than the body (so it never reads as a lid), over a slim, tall frosted body with a gentle waist,
// two short measure marks and an accent glow where the milk would sit.
// Roles: back/shadow body, pane/frost glass, accent glow, shine rim, etch marks. Motion: the whole bottle sways (wm-k).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'baby-bottle'
const f2 = v => +v.toFixed(2)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const area = d => unionSets(parsePath(d, 0.12).map(s => setOf([s.pts])))
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  // body 9 wide (7.5-16.5), tall to 21.5, a gentle waist at y 15.5; its top tucks under the collar
  const body = tidy(area('M7.5 9.5 H16.5 V12.5 C16.5 14 16.1 14.5 16.1 15.5 C16.1 16.5 16.5 17 16.5 18.5 A3 3 0 0 1 13.5 21.5 H10.5 A3 3 0 0 1 7.5 18.5 C7.5 17 7.9 16.5 7.9 15.5 C7.9 14.5 7.5 14 7.5 12.5 Z'))
  // collar: 0.5 wider than the body each side, r1.1
  const collar = tidy(area('M7 8.35 A1.1 1.1 0 0 1 8.1 7.25 H15.9 A1.1 1.1 0 0 1 17 8.35 V8.9 A1.1 1.1 0 0 1 15.9 10 H8.1 A1.1 1.1 0 0 1 7 8.9 Z'))
  // teat: bulb r1.6 (y 2-5.2) on a pinched neck that flares to a 6.5u flange ending at y 6.25 (1u clear of the collar)
  const teat = tidy(unionSets([
    area('M10.4 3.6 A1.6 1.6 0 0 1 13.6 3.6 A1.6 1.6 0 0 1 10.4 3.6 Z'),
    area('M8.75 6.25 C8.75 5.5 10.5 5.45 11.1 4.9 V3.6 H12.9 V4.9 C13.5 5.45 15.25 5.5 15.25 6.25 Z'),
  ]))
  const bodyB = translateSet(tidy(erode(body, 0.3)), 0.7, 0.7)
  const collarB = translateSet(tidy(erode(collar, 0.2)), 0.55, 0.55)
  const teatB = translateSet(tidy(erode(teat, 0.15)), 0.35, 0.4)
  const all = tidy(unionSets([bodyB, collarB, teatB]))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const [a, b, c, d] = box(all)
  const gBack = grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [stop(0, V.c1), stop(1, V.shadow)])
  const pane = (x0, y0, x1, y1, k = 1) => grad('linearGradient', { x1: x0, y1: y0, x2: x1, y2: y1 }, [stop(0, V.frost, f2(0.6 * k)), stop(0.4, V.tint, f2(0.52 * k)), stop(1, V.tint, f2(0.4 * k))])

  // teat: the hero, a bulb of glass on a flared flange, standing clear of the collar
  out.push(['path', { d: D(teatB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(teat), fill: pane(8.75, 2, 15.25, 6.25, 0.9), ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(teat)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // body: colour, milk glow low in the bottle, frost, two measure marks, rim
  out.push(['path', { d: D(bodyB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(bodyB), fill: grad('radialGradient', { cx: 14, cy: 19, r: 6 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(body), fill: pane(7.5, 9.5, 16.5, 21.5), ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: 'M9.5 13.25H11.25M9.5 17.75H11.25', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.6, 'stroke-width': 0.75, 'stroke-linecap': 'round', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(body)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // collar: a deeper glass ring screwed onto the neck
  out.push(['path', { d: D(collarB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(collar), fill: grad('linearGradient', { x1: 7, y1: 7.25, x2: 17, y2: 10 }, [stop(0, V.frost, 0.5), stop(0.45, V.tint, 0.3), stop(1, V.tint, 0.2)]), ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(collar)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
