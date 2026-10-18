// forge/hand/glass/paisley.mjs — Glass paisley (boteh), hand-drawn: the earlier drawing bolted an even tube and a knob onto
// a round bulb, so it read as a gourd with a handle. Here the whole motif is ONE swept outline: a leaning bulb low left
// whose flank draws in along a diagonal neck that narrows from about 4u to 1.8u, rolls over at the top and hooks down to
// a soft taper, with a clear gap under the hook. The frost, rim and hairline run around the curl as the same glass. The
// inner motif is the bulb's own teardrop echoed as an accent band with a frost seed. Motion: body wm-k (sways from
// 10 21.5), inner teardrop wm-a (breathes), seed wm-s.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify, circle, resample } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'paisley'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.02, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const D = (s, t = 0.04) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const soften = (set, r) => tidy(dilate(tidy(erode(set, r)), r))
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.34, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

// the spine: from the bulb's heart up the diagonal neck, over the roll and down into the hook
const SPINE = 'M9.3 15.2C11 12.4 13.4 9 15 6.2C15.9 4.6 17 3 18.7 2.9C20.4 2.9 21.3 4.4 21.1 6.2C21 7.1 20.8 7.8 20.4 8.5'
// the swept radius falls smoothly from the bulb (6.2) to the soft taper (0.95): one teardrop, no joints
const R = u => 0.95 + 5.25 * Math.pow(1 - u, 2.3)

// sweep a disc along the spine with radius r(u); stops where the radius runs out, so inner echoes end in a point
function sweep(r) {
  const pts = parsePath(SPINE, 0.05)[0].pts
  let discs = resample(pts, 0.3).filter(({ u }) => r(u) > 0.12).map(({ p, u }) => setOf([circle(p[0], p[1], r(u), 0.3)]))
  while (discs.length > 1) { const next = []; for (let i = 0; i < discs.length; i += 2) next.push(i + 1 < discs.length ? unionSets([discs[i], discs[i + 1]]) : discs[i]); discs = next }
  return tidy(discs[0])
}

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  const raw = soften(sweep(R), 0.3)
  const F = place(raw)
  const B = translateSet(place(sweep(u => R(u) - 0.32)), 0.7, 0.7)
  // inner teardrop: the same sweep held 2.4u inside the outline, so it echoes the body and ends in a point up the neck
  const I = place(sweep(u => R(u) - 2.4))
  const hole = place(sweep(u => R(u) - 3.45))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(B, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(B, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  out.push(['path', { d: D(B), fill: grad('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 22.5 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: D(B), fill: grad('radialGradient', { cx: 14.5, cy: 17.5, r: 7 }, [stop(0, V.accent, 0.5), stop(0.5, V.accent, 0.18), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', {
    d: D(F), fill: grad('linearGradient', { x1: 3, y1: 2, x2: 19, y2: 21 }, [stop(0, V.frost, 0.58), stop(0.4, V.tint, 0.44), stop(1, V.tint, 0.3)]),
    ...EDGE, class: 'wm-k',
  }])
  // inner teardrop: a luminous accent band, its centre left clear frost
  out.push(['path', { d: D(I), fill: V.frost, 'fill-opacity': 0.45, class: 'wm-a' }])
  out.push(['path', { d: D(differenceSets(I, hole)), fill: V.accent, 'fill-opacity': 0.9, stroke: 'currentColor', 'stroke-opacity': 0.18, 'stroke-width': 0.3, 'stroke-linejoin': 'round', 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: `M${X(6.4)} ${X(16.2)}C${X(6.2)} ${X(14)} ${X(7.4)} ${X(12)} ${X(9.4)} ${X(11.2)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-a wm-shine' }])
  out.push(['circle', { cx: X(9.6), cy: X(15.4), r: f2(1.3 * S), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.35, class: 'wm-s' }])
  out.push(['circle', { cx: f2(X(9.6) - 0.45), cy: f2(X(15.4) - 0.45), r: 0.35, fill: V.shine, 'fill-opacity': 0.9, class: 'wm-s wm-shine' }])
  out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
