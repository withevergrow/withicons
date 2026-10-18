// forge/hand/glass/party-popper.mjs — Glass party popper, hand-drawn: the generated drawing frosted every streamer and
// fleck into its own pale blob, so the burst became a cluster of beans beside the cone and nothing read at 16px. Here
// the cone is a full frosted pane (tip low-left, a rounded tip) with an open elliptical mouth in deep violet glass, so
// it reads as a hollow cone, and the burst is cut to three glass ribbons (two waves and a straight ray, each with the
// same back/pane/edge/rim stack as the cone) plus two luminous confetti beads, all clear of each other by 2u.
// Roles: back/shadow body + mouth, pane/frost glass, accent stripe + bead, shine rim. Motion: cone wm-k,
// streamers wm-a (pop, origin 11,13), confetti wm-s (twinkle, origin 19,5).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, intersectSets, erode, dilate, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'party-popper'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
// tidy rings (round, drop near-duplicate points) so the boolean ops stay robust
const tidy = (set, t = 0.01) => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), t, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const pts = d => parsePath(d, 0.15).map(s => s.pts)
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
// ring area, the largest ring of a set (drops slivers an offset pass can leave) and a fleck filter
const ar = r => { let s = 0; for (let i = 0; i < r.length; i++) { const [a, b] = r[i], [c, d] = r[(i + 1) % r.length]; s += a * d - b * c } return Math.abs(s / 2) }
const big = s => [s.reduce((m, r) => (ar(r) > ar(m) ? r : m))]
const noFleck = s => s.filter(r => ar(r) > 0.12)
const rimOf = F => { const e = tidy(erode(F, 0.1)); return noFleck(differenceSets(e, translateSet(e, 0.3, 0.45))) }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
const bead = (x, y, r) => `M${X(x)} ${X(y - r)}A${f2(r * S)} ${f2(r * S)} 0 1 1 ${X(x)} ${X(y + r)}A${f2(r * S)} ${f2(r * S)} 0 1 1 ${X(x)} ${X(y - r)}Z`
// an ellipse on the mouth line: centre, unit axis u, semi-axes a (along u) and b (across)
const ellipse = (cx, cy, ux, uy, a, b) => Array.from({ length: 56 }, (_, i) => {
  const t = i * Math.PI / 28, ca = a * Math.cos(t), sb = b * Math.sin(t)
  return [cx + ca * ux + sb * uy, cy + ca * uy - sb * ux]
})

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  // skeleton coords: cone tip (2.8,21.2), mouth (6.5,8)-(16,17.5) on the line x - y = -1.5; the mouth is an ellipse
  const U = Math.SQRT1_2
  const tri = big(tidy(dilate(big(tidy(erode(setOf([[[2.8, 21.2], [6.5, 8], [16, 17.5]]]), 0.9), 0.02)), 0.9), 0.02))
  const mouthS = setOf([ellipse(11.25, 12.75, U, U, 6.72, 1.6)])
  const cone = place(big(tidy(unionSets([tri, mouthS]), 0.02)))
  const mouth = place(mouthS)
  const hole = place(setOf([ellipse(11.4, 12.6, U, U, 5.6, 0.95)]))
  const stripe = intersectSets(tidy(erode(cone, 0.35)), place(roundStrokeSet([[1.5, 12.5], [12.5, 23.5]], 1.6)))
  const coneB = translateSet(big(tidy(erode(cone, 0.3), 0.02)), 0.5, 0.5)

  // three streamers as filled glass ribbons fanning from the mouth (two waves and a straight ray)
  const ribbons = [
    'M10.7 6.3 C12.5 5.1 10.2 3.6 12 2.1',
    'M14.6 9.4 L16.9 7.1',
    'M17.8 13.2 C19 11.6 20.4 13.8 22 12.2',
  ].map(d => place(roundStrokeSet(pts(d)[0], 2.2)))
  const streams = tidy(unionSets(ribbons))
  const streamsB = translateSet(tidy(unionSets(ribbons.map(r => tidy(erode(r, 0.25))))), 0.45, 0.45)
  const all = tidy(unionSets([coneB, streamsB]))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const gBack = grad('linearGradient', { x1: 2.5, y1: 4, x2: 22, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 8, cy: 17, r: 8 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])

  // cone: colour body, glow, clear frosted pane, accent stripe, lit rim
  out.push(['path', { d: D(coneB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(coneB), fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(cone), fill: grad('linearGradient', { x1: 2.5, y1: 8, x2: 15, y2: 21 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]), ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(stripe), fill: V.accent, 'fill-opacity': 0.7, class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(cone)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the open mouth: a frosted lip ellipse with the deep violet hollow inside it
  out.push(['path', { d: D(mouth), fill: V.frost, 'fill-opacity': 0.55, ...EDGE, class: 'wm-k' }])
  out.push(['path', { d: D(hole), fill: gBack, 'fill-opacity': 0.9, class: 'wm-k' }])

  // streamers: deep violet body, thin frost pane, edge, lit rim
  out.push(['path', { d: D(streamsB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(streams), fill: grad('linearGradient', { x1: 10, y1: 2, x2: 22, y2: 14 }, [stop(0, V.frost, 0.5), stop(0.5, V.tint, 0.32), stop(1, V.tint, 0.22)]), ...EDGE, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(streams)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // confetti: two luminous beads (accent and violet) with specular points
  out.push(['path', { d: bead(16.2, 2.6, 1.1), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 0.4, class: 'wm-s' }])
  out.push(['path', { d: bead(21.3, 7.8, 1.05), fill: gBack, stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 0.4, class: 'wm-s' }])
  out.push(['path', { d: `M${X(15.8)} ${X(2.2)}L${X(15.85)} ${X(2.15)}M${X(20.9)} ${X(7.4)}L${X(20.95)} ${X(7.35)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.95, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-s' }])
  return [['defs', {}, defs], ...out]
}
