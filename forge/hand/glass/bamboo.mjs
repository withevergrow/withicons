// forge/hand/glass/bamboo.mjs — Glass bamboo, hand-drawn: the generated drawing fused the leaves into the stalks with
// lumpy joins and marked the nodes with faint dashes, so it read as a cactus or a cross. Here the two stalks are clean
// frosted glass columns with node collars that stand proud of the stalk (etched ring across each), and the two leaves
// are their own slender glass blades with an etched midrib, set just off the stalk, so "bamboo" reads at 16px.
// Roles: back/shadow body, pane/frost glass, accent glow, etch nodes + midribs, shine rim. Motion: all wm-k (sway).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'bamboo'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2 && Math.abs(ringArea(r)) > 0.15)
const place = set => tidy(set.map(r => r.map(([x, y]) => [X(x), X(y)])))
const area = d => unionSets(parsePath(d, 0.25).map(s => setOf([s.pts])))
const D = (s, t = 0.07) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const round = (set, r) => tidy(dilate(tidy(erode(set, r)), r))
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
const tf = d => d.replace(/([MLHVCQZ])([^MLHVCQZ]*)/g, (m, c, a) => c + (a.match(/-?\d*\.?\d+/g) || []).map(n => X(+n)).join(' '))
const ETCH = (w, op) => ({ fill: 'none', stroke: V.etch, 'stroke-opacity': op, 'stroke-width': w, 'stroke-linecap': 'round', class: 'wm-k' })

// rounded rect, and a stalk: a straight rounded column with node collars that stand proud of it
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0} H${x1 - r} Q${x1} ${y0} ${x1} ${y0 + r} V${y1 - r} Q${x1} ${y1} ${x1 - r} ${y1} H${x0 + r} Q${x0} ${y1} ${x0} ${y1 - r} V${y0 + r} Q${x0} ${y0} ${x0 + r} ${y0} Z`
const stalk = (x0, x1, y0, y1, nodes) => unionSets([area(rr(x0, y0, x1, y1, 1)), ...nodes.map(y => area(rr(x0 - 0.45, y - 0.55, x1 + 0.45, y + 0.55, 0.5)))])

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  // skeleton coords: tall stalk 7.5-12.5 (nodes 8.75, 15.25), short stalk 15.75-20 (node 16.25), a leaf off each side
  const stalks = [stalk(7.5, 12.5, 2.25, 21.75, [8.75, 15.25]), stalk(15.75, 20, 10.75, 21.75, [16.25])].map(F => tidy(place(F)))
  const leafA = round(place(area('M13.4 8.1 Q15.4 3.6 21 2.6 Q19.9 8.1 13.4 8.1 Z')), 0.15)
  const leafB = round(place(area('M6.6 13.8 Q5.3 9.3 1.4 8.6 Q1.9 13.7 6.6 13.8 Z')), 0.15)

  const backOf = (F, e, s) => translateSet(tidy(erode(F, e)), s, s)
  const pieces = [
    ...stalks.map(F => ({ F, B: backOf(F, 0.3, 0.8) })),
    { F: leafA, B: backOf(leafA, 0.12, 0.45) },
    { F: leafB, B: backOf(leafB, 0.12, 0.45) },
  ]
  const B = tidy(unionSets(pieces.map(p => p.B)))
  const F = tidy(unionSets(pieces.map(p => p.F)))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(B, 0.9), 0, 0.5), 0.25), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(B, 0.35), 0, 0.5), 0.2), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const gBack = grad('linearGradient', { x1: 2, y1: 2, x2: 22, y2: 22.5 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 17.5, cy: 18, r: 8 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 2, y1: 2, x2: 20, y2: 21 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])

  out.push(['path', { d: D(B), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(B), fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(F), fill: gPane, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(tidy(unionSets(pieces.map(p => rimOf(p.F))))), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // leaf midribs, then an etched ring across each node collar
  out.push(['path', { d: tf('M14.3 7.5 Q16.8 5.2 20 3.6 M5.9 13.1 Q4.5 10.9 2.3 9.5'), ...ETCH(0.6, 0.6) }])
  out.push(['path', { d: tf('M8.2 8.75 H11.8 M8.2 15.25 H11.8 M16.4 16.25 H19.35'), ...ETCH(0.7, 0.6) }])
  return [['defs', {}, defs], ...out]
}
