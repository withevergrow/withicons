// forge/hand/glass/microscope.mjs — Glass microscope, hand-drawn: the generated drawing frosted the tilted tube into a
// pale blob, kept the arm a thin sliver and let the stage melt into the arm, so at 16px it read as a squiggle on a
// slab. Here the arm, stage and base are one sturdy glass frame (2.2-2.6u rods) and the eyepiece tube is
// its own deeper glass barrel with an objective nub, laid over the top of the arm so head and stand stay joined.
// Roles: back/shadow body, pane/frost glass, accent glow, shine rim, etch band. Motion: frame wm-k, tube wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'microscope'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
// tidy rings (round, drop near-duplicate points) so the boolean ops stay robust
const tidy = (set, t = 0.01) => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), t, true)).filter(r => r.length > 2)
// ring area, the largest ring of a set (drops the slivers an offset pass can leave), and a fleck filter
const ar = r => { let s = 0; for (let i = 0; i < r.length; i++) { const [a, b] = r[i], [c, d] = r[(i + 1) % r.length]; s += a * d - b * c } return Math.abs(s / 2) }
const big = s => [s.reduce((m, r) => (ar(r) > ar(m) ? r : m))]
const noFleck = s => s.filter(r => ar(r) > 0.12)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const pts = d => parsePath(d, 0.15)[0].pts
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return noFleck(differenceSets(e, translateSet(e, 0.3, 0.45))) }
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  // skeleton coords: the stand (arm + stage + base, joints filleted) and the tilted tube with its objective
  const arm = roundStrokeSet(pts('M11.4 5.6 C16.4 6 19 9.5 19 13.25 C19 16.6 16.6 17.6 16.6 21'), 2.6)
  const stage = roundStrokeSet([[9.6, 15.2], [17.8, 15.2]], 1.6)
  const base = roundStrokeSet([[5.3, 21], [18.7, 21]], 2.6)
  // fillets: each concave join (stage-arm above and below, arm-base both sides) takes a real radius, built as a
  // corner wedge minus the fillet disc (an offset closing pass leaves kinks on these slanted joins)
  const disc = (cx, cy, r) => setOf([Array.from({ length: 48 }, (_, i) => [cx + r * Math.cos(i * Math.PI / 24), cy + r * Math.sin(i * Math.PI / 24)])])
  const fillet = (wedge, cx, cy, r) => differenceSets(setOf([wedge]), disc(cx, cy, r))
  const fillets = [
    fillet([[16.8, 14.5], [16.8, 13.6], [17.75, 13.6], [17.7, 14.5]], 16.8, 13.6, 0.8),
    fillet([[15.59, 15.9], [17.1, 15.9], [16.35, 17.3]], 15.59, 16.8, 0.8),
    fillet([[14.4, 19.8], [15.75, 19.8], [15.68, 18.85]], 14.61, 18.7, 1),
    fillet([[18, 19.85], [19, 19.8], [18.3, 18.75]], 18.92, 19.1, 0.6),
  ]
  const stand = place(big(tidy(unionSets([arm, stage, base, ...fillets]), 0.02)))
  const tube = place(unionSets([
    area('M5.3 5.53 L8.3 10.72 A1 1 0 0 0 9.67 11.09 L11.83 9.84 A1 1 0 0 0 12.2 8.47 L9.2 3.28 A1 1 0 0 0 7.83 2.91 L5.67 4.16 A1 1 0 0 0 5.3 5.53 Z'),
    roundStrokeSet([[10.75, 10.6], [11.75, 12.35]], 1.9),
  ]))
  const standB = translateSet(big(tidy(erode(stand, 0.3), 0.03)), 0.75, 0.75)
  const tubeB = translateSet(tidy(erode(tube, 0.3)), 0.8, 0.8)
  const all = tidy(unionSets([standB, tubeB]))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const [a, b, c, d] = box(all)
  const gBack = grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 16, cy: 17.5, r: 7 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const [x0, y0, x1, y1] = box(unionSets([stand, tube]))
  const gPane = grad('linearGradient', { x1: f2(x0), y1: f2(y0), x2: f2(x1), y2: f2(y1) }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.5), stop(1, V.tint, 0.38)])

  // the stand: colour body, accent glow, frosted pane, lit rim
  out.push(['path', { d: D(standB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(standB), fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(stand), fill: gPane, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(stand)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the tube: a deeper glass barrel laid over the top of the arm (thinner frost so the violet reads)
  out.push(['path', { d: D(tubeB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(tube), fill: grad('linearGradient', { x1: 4.5, y1: 2, x2: 12, y2: 12 }, [stop(0, V.frost, 0.55), stop(0.45, V.tint, 0.36), stop(1, V.tint, 0.24)]), ...EDGE, 'fill-rule': 'evenodd', class: 'wm-a' }])
  // eyepiece band etched across the barrel
  out.push(['path', { d: `M${X(6.55)} ${X(6.05)}L${X(8.95)} ${X(4.65)}`, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(tube)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
