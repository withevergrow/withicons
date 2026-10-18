// forge/hand/glass/calendar-clock.mjs — a frosted calendar (binder rings, header rule, date dots) with a round clock pane
// set over its bottom-right corner, the calendar cut back around it by a clear gap; deep etch-ink hands on a luminous hub.
// The generated drawing put a blank pink disc there; the clock now carries its face and hands as in the line icon.
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const rr = (x0, y0, x1, y1, r) => {
  const pts = []
  for (const [cx, cy, a0] of [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]])
    for (let i = 0; i <= 12; i++) { const a = (a0 + 90 * i / 12) * Math.PI / 180; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  return setOf([pts])
}
const disc = (x, y, r) => setOf([circle(x, y, r, 0.3)])
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))

export default function render(icon) {
  const name = (icon && icon.name) || 'calendar-clock'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const CX = 16.6, CY = 16.7, CR = 5.2
  const clock = disc(CX, CY, CR)
  const body = rr(2.4, 4.4, 20.6, 20.8, 2.6)
  const cal = differenceSets(body, dilate(clock, 0.9))
  const rings = unionSets([roundStrokeSet([[7.6, 3.0], [7.6, 5.6]], 2.2), roundStrokeSet([[15.4, 3.0], [15.4, 5.6]], 2.2)])
  const calBack = differenceSets(backOf(body, 0.45, 1.25), dilate(clock, 0.5))
  const clockBack = backOf(clock, 0.5, 0.9)
  const allBack = unionSets([calBack, clockBack])

  const out = []
  out.push(['path', { d: D(translateSet(dilate(allBack, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(allBack, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const [a, b, c, d] = box(allBack)
  const gBack = add(['linearGradient', { id: id(), x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2), gradientUnits: 'userSpaceOnUse' }, [stop(0, V.c1), stop(1, V.shadow)]])
  const gPane = add(['linearGradient', { id: id(), x1: 2.4, y1: 3, x2: 21, y2: 21.5, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]])
  const gGlow = add(['radialGradient', { id: id(), cx: CX + 1.5, cy: CY + 1.5, r: 6.2, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.62), stop(0.5, V.accent, 0.24), stop(1, V.accent, 0)]])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5 }

  // binder rings: small clear glass tabs behind the top edge (plate A)
  out.push(['path', { d: D(rings), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(rings), fill: gPane, ...edge, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(rings)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // calendar: colour body, frosted pane, header rule and date dots
  out.push(['path', { d: D(calBack), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(cal), fill: gPane, ...edge, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(cal), fill: V.frost, 'fill-opacity': 0.3, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: 'M5.2 9.6H17.8', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.62, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-k' }])
  const dots = [[6.2, 13.6], [9.8, 13.6], [6.2, 17.2]].map(([x, y]) => disc(x, y, 0.75))
  out.push(['path', { d: D(unionSets(dots)), fill: V.etch, 'fill-opacity': 0.55, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(cal)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // clock: colour body with an orb of accent light, frosted dial in front, etched hands on a luminous hub
  out.push(['path', { d: D(clockBack), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-s' }])
  out.push(['path', { d: D(clockBack), fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-s' }])
  out.push(['path', { d: D(clock), fill: gPane, ...edge, 'fill-rule': 'evenodd', class: 'wm-s' }])
  out.push(['path', { d: D(clock), fill: V.frost, 'fill-opacity': 0.3, 'fill-rule': 'evenodd', class: 'wm-s' }])
  out.push(['path', { d: D(rimOf(clock)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  out.push(['path', { d: `M${CX} ${CY - 3}V${CY}L${CX + 2.2} ${CY + 1.5}`, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.9, 'stroke-width': 1.3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-s' }])
  out.push(['path', { d: D(disc(CX, CY, 0.85)), fill: V.accent, stroke: V.etch, 'stroke-width': 0.45, 'fill-rule': 'evenodd', class: 'wm-s' }])
  return [['defs', {}, defs], ...out]
}
