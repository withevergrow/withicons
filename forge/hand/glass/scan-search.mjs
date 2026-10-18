// forge/hand/glass/scan-search.mjs — four chunky indigo glass scan corners around a smaller accent magnifier.
// The generated corners were faint white on lavender, so only the lens registered. Here the brackets are thicker and
// carry the deep body colour (a clear step darker than the lens), and the magnifier is smaller with an accent ring,
// a clear glass lens with a glint and a round handle, so it sits well inside the frame.
// Roles: back/shadow + c1 brackets, pane/frost lens, accent ring + handle, shine rim. Motion: brackets wm-k, magnifier wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { setD, circle, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'scan-search'
const f = v => +v.toFixed(2)
const D = (set, t = 0.04) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.05), t)
const disc = (x, y, r) => setOf([circle(x, y, r)])
const ring = (x, y, r) => `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x - r)} ${f(y)}Z`
const arc = (x, y, r, a0, a1) => {
  const p = a => [f(x + r * Math.cos(a * Math.PI / 180)), f(y + r * Math.sin(a * Math.PI / 180))]
  const [sx, sy] = p(a0), [ex, ey] = p(a1)
  return `M${sx} ${sy}A${f(r)} ${f(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${ex} ${ey}`
}
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

// one scan corner as a polyline with a rounded bend
const bend = (cx, cy, sx, sy, leg, r) => {
  // corner at (cx,cy); legs run toward the inside along x (sx) and y (sy)
  const pts = [[cx + sx * leg, cy]]
  for (let i = 0; i <= 8; i++) {
    const a = (Math.PI / 2) * (i / 8)
    pts.push([cx + sx * r - sx * r * Math.sin(a), cy + sy * r - sy * r * Math.cos(a)])
  }
  pts.push([cx, cy + sy * leg])
  return pts
}

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const ev = 'evenodd'
  const W = 2.6, LEG = 5.2, R = 2.2
  // corner centre-lines inset by W/2
  const a = 3 + W / 2 - 0.2, b = 21 - W / 2 + 0.2
  const corners = unionSets([
    roundStrokeSet(bend(a, a, 1, 1, LEG, R), W),
    roundStrokeSet(bend(b, a, -1, 1, LEG, R), W),
    roundStrokeSet(bend(a, b, 1, -1, LEG, R), W),
    roundStrokeSet(bend(b, b, -1, -1, LEG, R), W),
  ])
  const back = translateSet(corners, 0.7, 0.7)
  const out = []
  out.push(['path', { d: D(translateSet(back, 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', 'fill-rule': ev, class: 'wm-shadow' }])
  out.push(['path', { d: D(back), fill: grad('linearGradient', { x1: 3, y1: 3, x2: 22, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)]), 'fill-rule': ev, class: 'wm-k' }])
  // the brackets: indigo glass, a clearly deeper tint than the lens
  out.push(['path', {
    d: D(corners), fill: grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 21 }, [stop(0, V.frost, 0.42), stop(0.35, V.c1, 0.82), stop(1, V.c1, 0.95)]),
    stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, 'stroke-linejoin': 'round', 'fill-rule': ev, class: 'wm-k',
  }])
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }
  out.push(['path', { d: 'M3.9 8.8V6.1A2.2 2.2 0 0 1 6.1 3.9H8.8', ...rim }])
  out.push(['path', { d: 'M15.2 3.9H17.7', ...rim }])
  out.push(['path', { d: 'M3.9 15.2V17.7', ...rim }])
  out.push(['path', { d: 'M20.1 15.2V17.7', ...rim, 'stroke-opacity': 0.5 }])

  // the magnifier: accent ring + handle around a clear glass lens
  const GX = 11, GY = 11, RO = 3.2, RI = 1.8
  const k = Math.SQRT1_2
  const handle = roundStrokeSet([[GX + (RO - 0.35) * k, GY + (RO - 0.35) * k], [15.6, 15.6]], 2.2)
  const mag = unionSets([differenceSets(disc(GX, GY, RO), disc(GX, GY, RI)), handle])
  const md = D(mag, 0.02)
  out.push(['path', { d: ring(GX, GY, RI + 0.1), fill: grad('linearGradient', { x1: GX - RI, y1: GY - RI, x2: GX + RI, y2: GY + RI }, [stop(0, V.frost, 0.9), stop(1, V.tint, 0.6)]), class: 'wm-a' }])
  out.push(['path', { d: D(translateSet(mag, 0.35, 0.5), 0.02), fill: V.shadow, 'fill-opacity': 0.55, 'fill-rule': ev, class: 'wm-a' }])
  out.push(['path', { d: md, fill: V.accent, 'fill-rule': ev, stroke: 'currentColor', 'stroke-opacity': 0.16, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: md, fill: grad('linearGradient', { x1: GX - RO, y1: GY - RO, x2: GX + 1, y2: GY + 3 }, [stop(0, V.shine, 0.62), stop(1, V.shine, 0)]), 'fill-rule': ev, class: 'wm-a' }])
  const lip = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-a' }
  out.push(['path', { d: arc(GX, GY, RO - 0.35, 170, 270), ...lip }])
  out.push(['path', { d: arc(GX, GY, RI - 0.6, 190, 255), ...lip, 'stroke-width': 0.55 }])
  return [['defs', {}, defs], ...out]
}
