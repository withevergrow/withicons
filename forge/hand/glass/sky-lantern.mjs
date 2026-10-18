// forge/hand/glass/sky-lantern.mjs — Glass sky lantern, hand-drawn: the generated drawing fused the three tassels into
// fat frosted fingers hanging off a pale hexagon with a faint edge, so it read as a jellyfish or a window. Here the
// lantern is one faceted glass hexagon with a firm hairline, lit from inside by a warm accent glow, its panels etched
// (centre rib and two bands); it hangs from a short cord, and three thin deep-glass tassels drop clear of each other,
// each ending in a luminous accent bead. Motion: lantern + cord wm-k (sways from 12 2), tassels wm-a (sway about 12 14).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify, circle } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'sky-lantern'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const soften = (set, r) => tidy(dilate(tidy(erode(set, r)), r))
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.36, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  // skeleton coords: a tall faceted hexagon (corners eased), a cord, three tassels with beads
  const lantern = place(soften(area('M12 3 L18.9 7.3 V12.9 L12 17 L5.1 12.9 V7.3 Z'), 0.6))
  const B = translateSet(tidy(erode(lantern, 0.3)), 0.7, 0.7)
  const cord = place(roundStrokeSet([[12, 1.5], [12, 4]], 1.2))
  const rods = place(unionSets([
    roundStrokeSet([[8.9, 15], [8.3, 19.1]], 1.05),
    roundStrokeSet([[12, 16.5], [12, 20.1]], 1.05),
    roundStrokeSet([[15.1, 15], [15.7, 19.1]], 1.05),
  ]))
  const beads = place(unionSets([setOf([circle(8.15, 20.1, 1.25)]), setOf([circle(12, 21.05, 1.25)]), setOf([circle(15.85, 20.1, 1.25)])]))
  const tassels = tidy(unionSets([rods, beads]))

  const out = []
  const all = tidy(unionSets([B, translateSet(tassels, 0.3, 0.3)]))
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const gBack = grad('linearGradient', { x1: 6, y1: 3, x2: 19, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])

  // tassels hang behind the lantern's lower facets: deep glass rods, accent beads with a specular dot
  out.push(['path', { d: D(rods), fill: gBack, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: D(beads), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.4, class: 'wm-a' }])
  out.push(['path', { d: D(beads), fill: grad('radialGradient', { cx: 12, cy: 18.6, r: 4.6 }, [stop(0, V.shine, 0), stop(0.6, V.shine, 0), stop(1, V.shadow, 0.35)]), class: 'wm-a' }])
  for (const [x, y] of [[8.15, 20.1], [12, 21.05], [15.85, 20.1]]) {
    out.push(['circle', { cx: f2(X(x) - 0.4), cy: f2(X(y) - 0.4), r: 0.38, fill: V.shine, 'fill-opacity': 0.9, class: 'wm-a wm-shine' }])
  }

  // the cord: a short deep-glass rod to the hook
  out.push(['path', { d: D(cord), fill: gBack, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.4, class: 'wm-k' }])
  // the lantern: colour body, a warm glow at its heart (it is lit), frosted pane with a firm hairline
  out.push(['path', { d: D(B), fill: gBack, class: 'wm-k' }])
  out.push(['path', { d: D(B), fill: grad('radialGradient', { cx: 12.4, cy: 11.6, r: 5.4 }, [stop(0, V.accent, 0.85), stop(0.5, V.accent, 0.4), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', {
    d: D(lantern), fill: grad('linearGradient', { x1: 5, y1: 3, x2: 17, y2: 16 }, [stop(0, V.frost, 0.58), stop(0.4, V.tint, 0.44), stop(1, V.tint, 0.3)]),
    ...EDGE, class: 'wm-k',
  }])
  // etched panels: the centre rib and the two bands where the facets meet
  out.push(['path', {
    d: `M${X(12)} ${X(4.3)}V${X(15.7)}M${X(6.2)} ${X(7.5)}H${X(17.8)}M${X(6.2)} ${X(12.7)}H${X(17.8)}`,
    fill: 'none', stroke: V.etch, 'stroke-opacity': 0.5, 'stroke-width': 0.65, 'stroke-linecap': 'round', class: 'wm-k',
  }])
  out.push(['path', { d: D(rimOf(lantern)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
