// forge/hand/glass/user-minus.mjs — a frosted glass person with a bold accent minus bar in the badge position (top right).
// The generated drawing left the minus as a tiny pill lost over the shoulder; here it is a thick, lit glass bar that
// sits clear of the head and shoulders, so the "remove" meaning reads at 16px.
// Roles: back/shadow body, pane/frost glass, accent bar, shine rim. Motion: person wm-k, bar wm-s.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, circle, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'user-minus'
const HX = 8.4, HY = 7.6, HR = 4.4
const TORSO = 'M3 21.9 A1.5 1.5 0 0 1 1.5 20.4 V18.6 A5.4 5.4 0 0 1 6.9 13.2 H10.1 A5.4 5.4 0 0 1 15.5 18.6 V20.4 A1.5 1.5 0 0 1 14 21.9 Z'
const BX0 = 15.3, BX1 = 22.7, BY = 10, BW = 3.5

const f = v => +v.toFixed(2)
const area = d => unionSets(parsePath(d).map(s => setOf([s.pts])))
const ring = (x, y, r) => `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x - r)} ${f(y)}Z`
const arc = (x, y, r, a0, a1) => {
  const p = a => [f(x + r * Math.cos(a * Math.PI / 180)), f(y + r * Math.sin(a * Math.PI / 180))]
  const [sx, sy] = p(a0), [ex, ey] = p(a1)
  return `M${sx} ${sy}A${f(r)} ${f(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${ex} ${ey}`
}
const D = (set, t = 0.04) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.06), t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const ev = 'evenodd'
  const torso = area(TORSO)
  const front = ring(HX - 0.3, HY - 0.3, HR) + D(translateSet(torso, -0.3, -0.3))
  const back = ring(HX + 0.75, HY + 0.75, HR) + D(translateSet(torso, 0.75, 0.75))
  const out = []
  const drop = ring(HX + 0.75, HY + 1.25, HR) + D(translateSet(torso, 0.75, 1.25))
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: back, fill: grad('linearGradient', { x1: 3, y1: 4, x2: 15, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: back, fill: grad('radialGradient', { cx: 12, cy: 18.8, r: 7 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', {
    d: front, fill: grad('linearGradient', { x1: 2, y1: 3, x2: 14, y2: 21.5 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]),
    stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, 'stroke-linejoin': 'round', 'fill-rule': ev, class: 'wm-k',
  }])
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }
  out.push(['path', { d: arc(HX - 0.3, HY - 0.3, HR - 0.5, 160, 280), ...rim }])
  out.push(['path', { d: 'M2.3 18.8A4.5 4.5 0 0 1 6.8 14H8.6', ...rim }])

  // the minus: one fat round bar, lit on its upper edge, with a darker lower edge
  const bar = roundStrokeSet([[BX0 + BW / 2, BY], [BX1 - BW / 2, BY]], BW)
  const lowEdge = translateSet(bar, 0.3, 0.55)
  out.push(['path', { d: D(lowEdge, 0.02), fill: V.shadow, 'fill-opacity': 0.5, 'fill-rule': ev, class: 'wm-s' }])
  out.push(['path', { d: D(bar, 0.02), fill: V.accent, 'fill-rule': ev, stroke: 'currentColor', 'stroke-opacity': 0.16, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-s' }])
  out.push(['path', { d: D(bar, 0.02), fill: grad('linearGradient', { x1: BX0, y1: BY - BW / 2, x2: BX0 + 2.5, y2: BY + BW / 2 + 0.5 }, [stop(0, V.shine, 0.62), stop(1, V.shine, 0)]), 'fill-rule': ev, class: 'wm-s' }])
  out.push(['path', { d: `M${f(BX0 + BW / 2)} ${f(BY - BW / 2 + 0.5)}H${f(BX1 - BW / 2 - 0.4)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-s' }])
  return [['defs', {}, defs], ...out]
}
