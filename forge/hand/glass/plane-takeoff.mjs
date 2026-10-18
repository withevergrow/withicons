// forge/hand/glass/plane-takeoff.mjs — Glass plane taking off, hand-drawn: the generated drawing frosted the narrow
// gaps between wings, tailplane and fuselage shut, so the plane fused into a blob over a heavy slab of runway. Here the
// plane is rebuilt along its climb axis from parts (a 2.9u fuselage with a round nose, swept wings with a slim chord,
// a small tailplane set well back) so clear air separates wing from tail even at 16px, and the runway is a thin glass
// rod well below the aircraft. Roles: back/shadow body, pane/frost glass, accent glow, shine rim.
// Motion: plane wm-k (climbs), runway wm-a (streams past, parts.A).
import { V } from '../../styles/_glass-soft.mjs'
import { setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'plane-takeoff'
const S = 0.94
const f2 = v => +v.toFixed(2)
// tidy rings (round, drop near-duplicate points) so the boolean ops stay robust
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

// the climb axis (skeleton coords): origin at the tail root, u along the fuselage to the nose (30 deg up), v across it
const O = [7.28, 12.25], U = [0.866, -0.5], N = [0.5, 0.866]
const L = (s, t) => [O[0] + s * U[0] + t * N[0], O[1] + s * U[1] + t * N[1]]
const poly = ps => setOf([ps.map(([s, t]) => L(s, t))])

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  const fuselage = roundStrokeSet([L(-1.1, 0), L(12.7, 0)], 2.9)
  const wings = unionSets([
    poly([[8.5, 0.9], [4.4, 0.9], [2.3, 8.5], [4.2, 8.5]]),
    poly([[8.5, -0.9], [4.2, -8.5], [2.3, -8.5], [4.4, -0.9]]),
  ])
  const tailplane = unionSets([
    poly([[1.4, 0.9], [-1.1, 0.9], [-2, 4.1], [-0.6, 4.1]]),
    poly([[1.4, -0.9], [-0.6, -4.1], [-2, -4.1], [-1.1, -0.9]]),
  ])
  const plane = place(dilate(tidy(erode(tidy(unionSets([fuselage, wings, tailplane])), 0.35)), 0.35))
  const runway = place(roundStrokeSet([[3, 21.3], [21, 21.3]], 1.5))
  const planeB = translateSet(tidy(erode(plane, 0.25)), 0.8, 0.8)
  const runwayB = translateSet(tidy(erode(runway, 0.15)), 0.4, 0.4)
  const all = tidy(unionSets([planeB, runwayB]))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const gBack = grad('linearGradient', { x1: 3, y1: 2.5, x2: 22, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 15, cy: 14, r: 7 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 3, y1: 2.5, x2: 19.5, y2: 20.5 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.52), stop(1, V.tint, 0.4)])

  // runway: a thin glass rod
  out.push(['path', { d: D(runwayB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(runway), fill: gPane, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-a' }])
  // plane: colour body, glow, frosted pane, lit rim
  out.push(['path', { d: D(planeB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(planeB), fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(plane), fill: gPane, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(plane)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
