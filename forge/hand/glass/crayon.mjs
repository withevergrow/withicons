// forge/hand/glass/crayon.mjs — Glass crayon, hand-drawn: the generated crayon frosted tip and body into one pale
// lozenge with two faint etched lines, so it read as a generic pencil or a bullet. Here the paper wrapper is the frosted
// glass body (with two etched wrapper bands) and the wax shows as deep accent-tinted glass at both ends: a short
// collar of exposed wax, a short blunt cone with a rounded nose at the tip, and a flat squared wax end at the back as wide
// as the wrapper (no rounded cap, so it never reads as a pencil with an eraser). The nose sits on the motion pivot.
// Roles: back/shadow body, pane/frost glass, accent wax, shine rim, etch bands. Motion: wrapper wm-k, wax wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'crayon'
const f2 = v => +v.toFixed(2)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

// local frame along the crayon: s runs from the tip (bottom-left) to the back (top-right), t across; centre 12,12
const R = Math.SQRT1_2
const P = (s, t) => [12 + (s + t) * R, 12 + (t - s) * R]
const local = d => unionSets(parsePath(d, 0.12).map(sub => setOf([sub.pts.map(([s, t]) => P(s, t))])))
const seg = (s, h) => { const p = P(s, -h), q = P(s, h); return `M${f2(p[0])} ${f2(p[1])}L${f2(q[0])} ${f2(q[1])}` }

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  // wrapper: the paper sleeve, 10.75 long and 6.6 across; wax: a short full-width collar then a blunt 3u cone with a
  // rounded nose (tip at ~6.5,17.5, the sway pivot), and a flat squared wax end behind, the wrapper's full width
  const wrap = tidy(local('M-3.5 -2.7 A0.6 0.6 0 0 1 -2.9 -3.3 H6.65 A0.6 0.6 0 0 1 7.25 -2.7 V2.7 A0.6 0.6 0 0 1 6.65 3.3 H-2.9 A0.6 0.6 0 0 1 -3.5 2.7 Z'))
  const tip = tidy(local('M-3 -3.1 H-4.75 L-7.05 -1.3 C-8.05 -1.1 -8.05 1.1 -7.05 1.3 L-4.75 3.1 H-3 Z'))
  const cap = tidy(local('M6.65 -3.3 H8.4 A0.6 0.6 0 0 1 9 -2.7 V2.7 A0.6 0.6 0 0 1 8.4 3.3 H6.65 Z'))
  const wax = tidy(unionSets([tip, cap]))
  const wrapB = translateSet(tidy(erode(wrap, 0.3)), 0.7, 0.7)
  const waxB = translateSet(tidy(erode(wax, 0.2)), 0.55, 0.55)
  const all = tidy(unionSets([wrapB, waxB]))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const [a, b, c, d] = box(all)
  const gBack = grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [stop(0, V.c1), stop(1, V.shadow)])

  // wax ends: an accent-to-shadow colour body under a thin frost, so the wax reads as coloured glass
  const gWax = grad('linearGradient', { x1: 5, y1: 13, x2: 10, y2: 20 }, [stop(0, V.accent), stop(1, V.shadow)])
  out.push(['path', { d: D(waxB), fill: gWax, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(wax), fill: grad('linearGradient', { x1: 4, y1: 4, x2: 20, y2: 20 }, [stop(0, V.frost, 0.5), stop(0.45, V.tint, 0.26), stop(1, V.tint, 0.16)]), ...EDGE, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(wax)), fill: V.shine, 'fill-opacity': 0.8, class: 'wm-shine' }])

  // the paper wrapper: colour body, accent glow, frosted pane, two etched bands, lit rim
  const [x0, y0, x1, y1] = box(wrap)
  out.push(['path', { d: D(wrapB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(wrapB), fill: grad('radialGradient', { cx: 15, cy: 14.4, r: 6.5 }, [stop(0, V.accent, 0.55), stop(0.5, V.accent, 0.2), stop(1, V.accent, 0)]), 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(wrap), fill: grad('linearGradient', { x1: f2(x0), y1: f2(y0), x2: f2(x1), y2: f2(y1) }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]), ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: seg(-1.2, 2.2) + seg(4.9, 2.2), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.6, 'stroke-width': 0.75, 'stroke-linecap': 'round', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(wrap)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
