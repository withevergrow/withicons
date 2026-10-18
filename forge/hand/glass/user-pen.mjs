// forge/hand/glass/user-pen.mjs — a frosted glass person with a small diagonal accent pencil offset to the bottom right.
// The generated pen was an oversized blob that covered the shoulder. Here the pencil is real geometry: a pointed wood cone
// with a dark lead tip, a lit accent barrel, a pale glass ferrule band and a rounded eraser, and the shoulders are
// trimmed in a clean gap around it so the badge reads as "edit" at 16px.
// Roles: back/shadow body, pane/frost glass, accent pencil, shine rim, etch lead. Motion: person wm-k, pencil wm-s.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, circle, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, dilate, erode, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'user-pen'
const HX = 8.4, HY = 7.6, HR = 4.4
const TORSO = 'M3 21.9 A1.5 1.5 0 0 1 1.5 20.4 V18.6 A5.4 5.4 0 0 1 6.9 13.2 H10.1 A5.4 5.4 0 0 1 15.5 18.6 V20.4 A1.5 1.5 0 0 1 14 21.9 Z'

// pencil in axis coordinates: u runs from the tip (0) to the eraser end (L), v across (negative = lit upper-left side)
const TIP = [14.9, 21.5], A = [Math.SQRT1_2, -Math.SQRT1_2], N = [Math.SQRT1_2, Math.SQRT1_2]
const L = 10, HW = 2.05, CONE = 3.2, FER0 = 7.3, FER1 = 8.4
const P = (u, v) => [TIP[0] + A[0] * u + N[0] * v, TIP[1] + A[1] * u + N[1] * v]

const f = v => +v.toFixed(2)
const area = d => unionSets(parsePath(d).map(s => setOf([s.pts])))
const poly = pts => setOf([pts])
const ring = (x, y, r) => `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x - r)} ${f(y)}Z`
const arc = (x, y, r, a0, a1) => {
  const p = a => [f(x + r * Math.cos(a * Math.PI / 180)), f(y + r * Math.sin(a * Math.PI / 180))]
  const [sx, sy] = p(a0), [ex, ey] = p(a1)
  return `M${sx} ${sy}A${f(r)} ${f(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${ex} ${ey}`
}
const D = (set, t = 0.04) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.04), t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const round = (set, r) => dilate(erode(set, r), r)

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const ev = 'evenodd'

  // pencil geometry
  const sil = round(poly([P(0, 0), P(CONE, -HW), P(L, -HW), P(L, HW), P(CONE, HW)]), 0.45)
  const cone = poly([P(-0.2, 0), P(CONE, -HW - 0.2), P(CONE, HW + 0.2)])
  const coneSet = round(cone, 0.1)
  const ferrule = poly([P(FER0, -HW - 0.3), P(FER1, -HW - 0.3), P(FER1, HW + 0.3), P(FER0, HW + 0.3)])
  const eraser = poly([P(FER1, -HW - 0.3), P(L + 0.3, -HW - 0.3), P(L + 0.3, HW + 0.3), P(FER1, HW + 0.3)])
  const lead = poly([P(-0.1, 0), P(0.95, -0.42), P(0.95, 0.42)])
  const inside = s => differenceSets(s, differenceSets(poly([P(-5, -9), P(30, -9), P(30, 9), P(-5, 9)]), sil))

  // shoulders trimmed around the pencil
  const torso = differenceSets(area(TORSO), dilate(sil, 1.25))
  const front = ring(HX - 0.3, HY - 0.3, HR) + D(translateSet(torso, -0.3, -0.3))
  const backT = differenceSets(translateSet(area(TORSO), 0.75, 0.75), dilate(sil, 0.95))
  const back = ring(HX + 0.75, HY + 0.75, HR) + D(backT)
  const out = []
  const drop = ring(HX + 0.75, HY + 1.25, HR) + D(translateSet(backT, 0, 0.5))
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: back, fill: grad('linearGradient', { x1: 3, y1: 4, x2: 15, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: back, fill: grad('radialGradient', { cx: 9.5, cy: 18.8, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', {
    d: front, fill: grad('linearGradient', { x1: 2, y1: 3, x2: 14, y2: 21.5 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]),
    stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, 'stroke-linejoin': 'round', 'fill-rule': ev, class: 'wm-k',
  }])
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }
  out.push(['path', { d: arc(HX - 0.3, HY - 0.3, HR - 0.5, 160, 280), ...rim }])
  out.push(['path', { d: 'M2.3 18.8A4.5 4.5 0 0 1 6.8 14H8.6', ...rim }])

  // the pencil: shadow edge, accent barrel, wood cone, lead, ferrule, eraser, lit rim
  out.push(['path', { d: D(translateSet(sil, 0.3, 0.5), 0.02), fill: V.shadow, 'fill-opacity': 0.5, 'fill-rule': ev, class: 'wm-s' }])
  out.push(['path', { d: D(sil, 0.02), fill: V.accent, 'fill-rule': ev, stroke: 'currentColor', 'stroke-opacity': 0.16, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-s' }])
  out.push(['path', { d: D(inside(eraser), 0.02), fill: V.shadow, 'fill-opacity': 0.3, 'fill-rule': ev, class: 'wm-s' }])
  out.push(['path', { d: D(inside(ferrule), 0.02), fill: grad('linearGradient', { x1: 15, y1: 15, x2: 21, y2: 21 }, [stop(0, V.frost, 0.95), stop(1, V.tint, 0.75)]), 'fill-rule': ev, class: 'wm-s' }])
  out.push(['path', { d: D(inside(coneSet), 0.02), fill: grad('linearGradient', { x1: 14, y1: 20, x2: 18, y2: 17, }, [stop(0, V.frost, 0.95), stop(1, V.tint, 0.8)]), 'fill-rule': ev, class: 'wm-s' }])
  out.push(['path', { d: D(lead, 0.02), fill: V.etch, 'fill-opacity': 0.85, 'fill-rule': ev, class: 'wm-s' }])
  out.push(['path', { d: D(sil, 0.02), fill: grad('linearGradient', { x1: 14, y1: 13, x2: 21, y2: 21 }, [stop(0, V.shine, 0.55), stop(1, V.shine, 0)]), 'fill-rule': ev, class: 'wm-s' }])
  const lip = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-s' }
  const l0 = P(CONE + 0.2, -HW + 0.5), l1 = P(FER0 - 0.4, -HW + 0.5)
  out.push(['path', { d: `M${f(l0[0])} ${f(l0[1])}L${f(l1[0])} ${f(l1[1])}`, ...lip }])
  const e0 = P(FER1 + 0.35, -HW + 0.5), e1 = P(L - 0.55, -HW + 0.5)
  out.push(['path', { d: `M${f(e0[0])} ${f(e0[1])}L${f(e1[0])} ${f(e1[1])}`, ...lip }])
  return [['defs', {}, defs], ...out]
}
