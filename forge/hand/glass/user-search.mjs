// forge/hand/glass/user-cog.mjs — a frosted glass person with a crisp six-tooth accent cog as the badge: the generated
// drawing melted the gear's teeth into soft petals (it read as a flower, not settings). Here the cog is real geometry
// with square-shouldered teeth and a clean axle hole, a lit top-left lip and a darker lower edge, and the person's
// shoulders are trimmed in a clean arc around it so the badge stays dominant at 16px.
// Roles: back/shadow body, pane/frost glass, accent cog, shine rim. Motion: person wm-k, cog wm-s (spins about 17.5 16.5).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, circle, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'user-search'
const GX = 16.3, GY = 15.8, RO = 3.85, RI = 2.15
const HX = 8.1, HY = 7.1, HR = 3.85
const TORSO = 'M3 21.5 A1 1 0 0 1 2 20.5 V19.25 A5.25 5.25 0 0 1 7.25 14 H8.95 A5.25 5.25 0 0 1 14.2 19.25 V20.5 A1 1 0 0 1 13.2 21.5 Z'

const f = v => +v.toFixed(2)
const area = d => unionSets(parsePath(d).map(s => setOf([s.pts])))
const disc = (x, y, r) => setOf([circle(x, y, r)])
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

  // the shoulders, trimmed in an arc around the badge (a small extra bite blunts the tip)
  const torso = differenceSets(area(TORSO), unionSets([disc(GX, GY, RO + 1.35), disc(11.75, 14.05, 0.85)]))
  const Ft = translateSet(torso, -0.3, -0.3)
  const Bt = differenceSets(translateSet(torso, 0.75, 0.75), disc(GX, GY, RO + 0.8))
  const front = ring(HX - 0.3, HY - 0.3, HR) + D(Ft)
  const back = ring(HX + 0.75, HY + 0.75, HR) + D(Bt)
  const out = []
  // soft diffuse shadow (a wide, faint outline of the colour body, dropped a touch)
  const drop = ring(HX + 0.75, HY + 1.25, HR) + D(translateSet(Bt, 0, 0.5))
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  // colour body behind, with an accent orb low in the torso
  out.push(['path', { d: back, fill: grad('linearGradient', { x1: 3, y1: 4, x2: 15, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: back, fill: grad('radialGradient', { cx: 11.5, cy: 18.5, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  // frosted pane in front, with a currentColor hairline
  out.push(['path', {
    d: front, fill: grad('linearGradient', { x1: 2, y1: 3, x2: 14, y2: 21.5 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]),
    stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, 'stroke-linejoin': 'round', 'fill-rule': ev, class: 'wm-k',
  }])
  // lit rims along the top-left edges
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }
  out.push(['path', { d: arc(HX - 0.3, HY - 0.3, HR - 0.5, 160, 280), ...rim }])
  out.push(['path', { d: 'M2.2 19.6V18.95A4.75 4.75 0 0 1 6.95 14.2H8.4', ...rim }])

  // the magnifier badge: an open accent ring, a clear glass lens with a glint, a long round handle
  const k = Math.SQRT1_2
  const handle = roundStrokeSet([[GX + (RO - 0.4) * k, GY + (RO - 0.4) * k], [21, 20.5]], 2.3)
  const mag = unionSets([differenceSets(disc(GX, GY, RO), disc(GX, GY, RI)), handle])
  const md = D(mag, 0.02)
  out.push(['path', { d: ring(GX, GY, RI + 0.1), fill: grad('linearGradient', { x1: GX - RI, y1: GY - RI, x2: GX + RI, y2: GY + RI }, [stop(0, V.frost, 0.85), stop(1, V.tint, 0.5)]), class: 'wm-s' }])
  out.push(['path', { d: D(translateSet(mag, 0.35, 0.5), 0.02), fill: V.shadow, 'fill-opacity': 0.55, 'fill-rule': ev, class: 'wm-s' }])
  out.push(['path', { d: md, fill: V.accent, 'fill-rule': ev, stroke: 'currentColor', 'stroke-opacity': 0.16, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-s' }])
  out.push(['path', { d: md, fill: grad('linearGradient', { x1: GX - RO, y1: GY - RO, x2: GX + 1, y2: GY + 3 }, [stop(0, V.shine, 0.62), stop(1, V.shine, 0)]), 'fill-rule': ev, class: 'wm-s' }])
  // lit lips: the ring's upper-left edge, and a glint across the lens
  const lip = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-s' }
  out.push(['path', { d: arc(GX, GY, RO - 0.35, 170, 270), ...lip }])
  out.push(['path', { d: arc(GX, GY, RI - 0.65, 190, 255), ...lip, 'stroke-width': 0.55 }])
  return [['defs', {}, defs], ...out]
}
