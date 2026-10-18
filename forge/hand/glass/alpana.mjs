// forge/hand/glass/alpana.mjs - the Line design in glass: five curling spiral arms (round frosted glass rods that start at the
// core and wind into a spiral hook, turning like a pinwheel) round a luminous pink core, with five pink beads in the gaps
// between the curls. The earlier drawing was eight plain petals; this keeps the arms and the outer dots. Roles: back/shadow
// body, pane/frost rods, accent core + beads, shine rim. Motion: arms wm-k, core wm-a, beads wm-deco.
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, roundStrokeSet, setOf } from '../../kernel/bool.mjs'

const S = 0.94
const f2 = v => +v.toFixed(2)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.03, true)).filter(r => r.length > 2)
const P = ([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5]
const D = (s, t = 0.09) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

// one arm in local coordinates (centre at 0,0; the arm climbs the -y axis): a stem, then a clockwise spiral hook
function arm() {
  const pts = []
  for (let i = 0; i <= 6; i++) pts.push([-0.15 * i / 6, -2.4 - 3.6 * i / 6])
  const cx = 2.1, cy = -6.0, n = 30, turns = 1.12
  for (let i = 1; i <= n; i++) {
    const t = i / n, a = Math.PI + t * turns * 2 * Math.PI, r = 2.25 - 0.85 * t
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
  }
  return pts
}
const rot = (pts, k) => { const a = k * 2 * Math.PI / 5, c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [12 + x * c - y * s, 12 + x * s + y * c]) }

export default function render(icon) {
  const name = (icon && icon.name) || 'alpana'
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBack = grad('linearGradient', { x1: 2, y1: 2, x2: 22, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 15, cy: 15, r: 8 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 2, y1: 2, x2: 22, y2: 22 }, [stop(0, V.frost, 0.78), stop(0.45, V.tint, 0.66), stop(1, V.tint, 0.52)])

  const arms = unionSets([0, 1, 2, 3, 4].map(k => setOf(roundStrokeSet(rot(arm(), k).map(P), 1.95)))).map(r => r)
  const coreC = P([12, 12])
  const core = setOf([circle(coreC[0], coreC[1], 3.3 * S, 0.1)])
  const armsFront = tidy(arms)
  const beads = [0, 1, 2, 3, 4].map(k => {
    const a = (k * 72 + 36 - 90) * Math.PI / 180, c = P([12 + Math.cos(a) * 10.3, 12 + Math.sin(a) * 10.3])
    return [c[0], c[1], 0.95 * S]
  })
  const body = tidy(unionSets([arms, core]))
  const back = tidy(translateSet(tidy(erode(body, 0.2)), 0.7, 0.7))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(back, 0.9), 0, 0.5), 0.3), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(back, 0.35), 0, 0.5), 0.25), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const bd = D(back, 0.12)
  out.push(['path', { d: bd, fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: bd, fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(armsFront), fill: gPane, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(armsFront)), fill: V.shine, 'fill-opacity': 0.88, class: 'wm-shine' }])
  // the core: a luminous accent bead set on the arms
  out.push(['circle', { cx: f2(coreC[0]), cy: f2(coreC[1]), r: f2(2.4 * S), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.14, 'stroke-width': 0.4, class: 'wm-a' }])
  out.push(['circle', { cx: f2(coreC[0] - 0.35), cy: f2(coreC[1] - 0.45), r: f2(1.4 * S), fill: V.shine, 'fill-opacity': 0.5, class: 'wm-a' }])
  // the outer beads
  for (const [x, y, r] of beads) {
    out.push(['circle', { cx: f2(x), cy: f2(y), r: f2(r), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }])
    out.push(['circle', { cx: f2(x - 0.2), cy: f2(y - 0.25), r: f2(r * 0.45), fill: V.shine, 'fill-opacity': 0.7, class: 'wm-deco' }])
  }
  return [['defs', {}, defs], ...out]
}
