// forge/hand/glass/battery.mjs — a frosted glass battery: a rounded case pane with its colour body glowing through the
// walls, a clear hollow, a separate terminal nub, and two solid colour-glass charge cells standing in the hollow.
// The generated cells were hairline etch outlines on a pale case, so on white the charge vanished at 16px; the cells are
// now vivid tonal glass blocks with a lit rim, and the case wall carries a firmer edge.
import { V } from '../../styles/_glass-soft.mjs'
import { setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))
// a soft halo: grow the colour body (piece by piece if the whole outline is too tangled to offset)
const grow = (s, r) => { try { return dilate(s, r) } catch { try { return unionSets(s.map(g => dilate([g], r))) } catch { return s } } }
// rounded rectangle as a region set
function rr(x0, y0, x1, y1, r) {
  const pts = [], arc = (cx, cy, a0) => { for (let i = 0; i <= 8; i++) { const a = a0 + Math.PI / 2 * i / 8; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) } }
  arc(x1 - r, y0 + r, -Math.PI / 2); arc(x1 - r, y1 - r, 0); arc(x0 + r, y1 - r, Math.PI / 2); arc(x0 + r, y0 + r, Math.PI)
  return setOf([pts])
}

export default function render(icon) {
  const name = (icon && icon.name) || 'battery'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => add(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])

  // case: a wall 2u thick round a clear hollow (through both panes, so it reads empty)
  const outer = rr(1.5, 6.6, 18.1, 16.4, 2.5)
  const hollow = rr(3.5, 8.6, 16.1, 14.4, 1)
  const kase = differenceSets(outer, hollow)
  const nub = rr(19.3, 9.4, 21.1, 13.6, 0.9)
  const cells = unionSets([rr(4.6, 9.7, 7.3, 13.3, 0.7), rr(8.5, 9.7, 11.2, 13.3, 0.7)])
  const kaseBack = translateSet(differenceSets(erode(outer, 0.45), dilate(hollow, 0.45)), 0.75, 0.75)
  const nubBack = backOf(nub, 0.3, 0.6)
  const allBack = unionSets([kaseBack, nubBack])

  const out = []
  out.push(['path', { d: D(translateSet(grow(allBack, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(grow(allBack, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])

  const [a, b, c, d] = box(allBack)
  const gBack = lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)])
  const gPane = lin(1.5, 6.6, 21.1, 16.4, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.28, 'stroke-width': 0.5 }

  // the terminal nub (plate A)
  out.push(['path', { d: D(nubBack), fill: gBack, class: 'wm-a' }])
  out.push(['path', { d: D(nub), fill: gPane, ...edge, class: 'wm-a' }])
  out.push(['path', { d: D(nub), fill: V.frost, 'fill-opacity': 0.3, class: 'wm-a' }])

  // the case: colour body with a soft orb of accent light, frosted wall in front
  out.push(['path', { d: D(kaseBack), fill: gBack, 'fill-rule': 'evenodd' }])
  const gGlow = add(['radialGradient', { id: id(), cx: 15.5, cy: 15, r: 7.5, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]])
  out.push(['path', { d: D(kaseBack), fill: gGlow, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(kase), fill: gPane, ...edge, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(rimOf(unionSets([kase, nub]))), fill: V.shine, 'fill-opacity': 0.85, 'fill-rule': 'evenodd', class: 'wm-shine' }])

  // the charge: solid tonal colour glass, a deep edge and a lit rim (they refill: plate A)
  const gCell = lin(4.6, 9.7, 11.2, 13.3, [stop(0, V.c1), stop(1, V.shadow)])
  out.push(['path', { d: D(cells), fill: gCell, stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.45, class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(cells)), fill: V.shine, 'fill-opacity': 0.75, class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
