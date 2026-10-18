// forge/hand/glass/timer.mjs — a frosted glass stopwatch: a round body pane over its colour body, a big capsule crown on
// a short stem and an angled side button, each its own glass set apart by a clear gap, and one bold etch-ink hand on a
// luminous hub. The generated crown was a small pale cap that merged into the body and the hand a hairline, so at 16px
// it read as a plain clock; the enlarged crown, button and hand now carry the stopwatch at a glance.
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const disc = (x, y, r) => setOf([circle(x, y, r, 0.3)])
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))
// a soft halo: grow the colour body (piece by piece if the whole outline is too tangled to offset)
const grow = (s, r) => { try { return dilate(s, r) } catch { try { return unionSets(s.map(g => dilate([g], r))) } catch { return s } } }

const C = [11.5, 13.1], R = 8.1

export default function render(icon) {
  const name = (icon && icon.name) || 'timer'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => add(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])

  const body = disc(C[0], C[1], R)
  // crown: a capsule cap on a stem; button: a short angled rod (both plate A, cut clear of the body)
  const crownRaw = unionSets([roundStrokeSet([[9.65, 2.5], [13.35, 2.5]], 2.5), roundStrokeSet([[11.5, 3], [11.5, 6]], 2.1)])
  const btnRaw = roundStrokeSet([[17.5, 7.1], [19.4, 5.2]], 2.3)
  const parts = differenceSets(unionSets([crownRaw, btnRaw]), dilate(body, 0.55))
  const bodyBack = backOf(body, 0.6, 0.9)
  const partsBack = backOf(differenceSets(unionSets([crownRaw, btnRaw]), dilate(body, 0.2)), 0.35, 0.6)
  const allBack = unionSets([bodyBack, partsBack])

  const out = []
  out.push(['path', { d: D(translateSet(grow(allBack, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(grow(allBack, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])

  const [a, b, c, d] = box(allBack)
  const gBack = lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)])
  const [x0, y0, x1, y1] = box(unionSets([body, parts]))
  const gPane = lin(x0, y0, x1, y1, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5 }

  // crown and button
  out.push(['path', { d: D(partsBack), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(parts), fill: gPane, ...edge, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(parts), fill: V.frost, 'fill-opacity': 0.3, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(parts)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // body: colour with a soft orb of accent light behind the frosted pane
  out.push(['path', { d: D(bodyBack), fill: gBack, 'fill-rule': 'evenodd' }])
  const gGlow = add(['radialGradient', { id: id(), cx: 15.8, cy: 17.3, r: 7, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]])
  out.push(['path', { d: D(bodyBack), fill: gGlow, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(body), fill: gPane, ...edge, 'fill-rule': 'evenodd' }])
  // the zero mark at the top of the dial
  out.push(['path', { d: 'M11.5 6.75V8', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.6, 'stroke-width': 0.9, 'stroke-linecap': 'round' }])
  out.push(['path', { d: D(rimOf(body)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // the hand: deep etch ink at the live gauge's weight, on a luminous accent hub
  out.push(['path', { d: 'M11.5 13.1L15.2 9.4', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.9, 'stroke-width': 1.45, 'stroke-linecap': 'round', class: 'wm-a' }])
  out.push(['path', { d: 'M12.5 13.1A1 1 0 1 0 10.5 13.1A1 1 0 1 0 12.5 13.1Z', fill: V.accent, stroke: V.etch, 'stroke-width': 0.5, class: 'wm-a' }])
  out.push(['path', { d: 'M11.44 12.74A.28 .28 0 1 0 10.88 12.74A.28 .28 0 1 0 11.44 12.74Z', fill: V.shine, 'fill-opacity': 0.9, class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
