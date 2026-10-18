// forge/hand/glass/lasso.mjs — an open lasso rope in frosted glass: a wide loop whose tail crosses back through it,
// with the accent pointer arrow at lower right dragging the free end (the arrow cuts a clear gap in the rope).
// The generated drawing added a pink knot ring and no pointer; the loop-with-tail composition is kept from the line icon.
import { V } from '../../styles/_glass-soft.mjs'
import { setD, parsePath, simplify } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const grow = (s, r) => { for (const q of [r, r + 0.03, r - 0.03, r + 0.06]) { try { return dilate(s, q) } catch {} } return s }
// a polygon with its corners eased (quadratic bends of radius r), as a region set
const soft = (P, r) => {
  const pts = []
  P.forEach((p, i) => {
    const a = P[(i + P.length - 1) % P.length], b = P[(i + 1) % P.length]
    const ua = Math.hypot(a[0] - p[0], a[1] - p[1]), ub = Math.hypot(b[0] - p[0], b[1] - p[1])
    const A = [p[0] + (a[0] - p[0]) * r / ua, p[1] + (a[1] - p[1]) * r / ua], B = [p[0] + (b[0] - p[0]) * r / ub, p[1] + (b[1] - p[1]) * r / ub]
    for (let k = 0; k <= 8; k++) { const t = k / 8, m = 1 - t; pts.push([m * m * A[0] + 2 * m * t * p[0] + t * t * B[0], m * m * A[1] + 2 * m * t * p[1] + t * t * B[1]]) }
  })
  return setOf([pts])
}
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))

export default function render(icon) {
  const name = (icon && icon.name) || 'lasso'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  // the rope's centreline: the line icon's loop, eased in so the thick rope stays inside the grid
  const path = 'M12 15.5C10 15.5 8.25 13 7 11.5C5.75 10 3.5 9.25 3.5 7C3.5 4.5 7.5 2.5 12 2.5C16.5 2.5 20.5 4.5 20.5 7C20.5 9.5 16.5 11 12 11C9.5 11 8.25 11 7 11.5L5 12.5'
  const sub = parsePath(path, 0.15)[0].pts.map(([x, y]) => [12 + (x - 12) * 0.9, 3.5 + (y - 2.5) * 0.98])
  const ropeFull = roundStrokeSet(sub, 2.5)
  // pointer arrow (accent), tip up-left
  const arrow = soft([[13.2, 13.4], [21.3, 17.3], [17.8, 18.5], [16.2, 22.2]], 1.0)
  const rope = differenceSets(ropeFull, dilate(arrow, 0.9))
  const ropeBack = differenceSets(backOf(ropeFull, 0.2, 0.9), dilate(arrow, 0.5))

  const out = []
  out.push(['path', { d: D(translateSet(grow(unionSets([ropeBack, backOf(arrow, 0.2, 0.6)]), 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(grow(unionSets([ropeBack, backOf(arrow, 0.2, 0.6)]), 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const [a, b, c, d] = box(ropeFull)
  const gBack = add(['linearGradient', { id: id(), x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2), gradientUnits: 'userSpaceOnUse' }, [stop(0, V.c1), stop(1, V.shadow)]])
  const gPane = add(['linearGradient', { id: id(), x1: f2(a), y1: f2(b), x2: f2(c), y2: f2(d), gradientUnits: 'userSpaceOnUse' }, [stop(0, V.frost, 0.55), stop(0.4, V.tint, 0.45), stop(1, V.tint, 0.32)]])
  const gArrow = add(['linearGradient', { id: id(), x1: 13.4, y1: 13.6, x2: 21.4, y2: 22, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent), stop(0.5, V.accent), stop(1, V.shadow)]])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5 }

  out.push(['path', { d: D(ropeBack), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rope), fill: gPane, ...edge, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rope), fill: V.frost, 'fill-opacity': 0.12, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(rope)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // the pointer: a glossy accent bead
  out.push(['path', { d: D(arrow), fill: gArrow, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.45, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(arrow)), fill: V.shine, 'fill-opacity': 0.8, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
