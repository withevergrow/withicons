// forge/hand/glass/cpu.mjs — a frosted glass chip: a square body pane over its colour body, two pins per side as their
// own short glass rods set apart by a fine gap, and a large solid colour-glass core in the middle. The generated pins
// fused with the body into a cog-like blob and the core was a small pale etched square that washed out; the core now
// fills half the chip as a vivid tonal tile with a lit rim, and the pins stay countable at 16px.
import { V } from '../../styles/_glass-soft.mjs'
import { setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))
// a soft halo: grow the colour body (piece by piece if the whole outline is too tangled to offset)
const grow = (s, r) => { try { return dilate(s, r) } catch { try { return unionSets(s.map(g => dilate([g], r))) } catch { return s } } }
function rr(x0, y0, x1, y1, r) {
  const pts = [], arc = (cx, cy, a0) => { for (let i = 0; i <= 8; i++) { const a = a0 + Math.PI / 2 * i / 8; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) } }
  arc(x1 - r, y0 + r, -Math.PI / 2); arc(x1 - r, y1 - r, 0); arc(x0 + r, y1 - r, Math.PI / 2); arc(x0 + r, y0 + r, Math.PI)
  return setOf([pts])
}

export default function render(icon) {
  const name = (icon && icon.name) || 'cpu'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => add(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])

  const body = rr(5, 5, 18, 18, 2.4)
  const P = [8.5, 14.5], W = 1.9, E0 = 2.95, E1 = 20.05
  const raw = unionSets(P.flatMap(p => [
    roundStrokeSet([[p, E0], [p, 7]], W), roundStrokeSet([[p, 16], [p, E1]], W),
    roundStrokeSet([[E0, p], [7, p]], W), roundStrokeSet([[16, p], [E1, p]], W),
  ]))
  const pins = differenceSets(raw, dilate(body, 0.5))
  const core = rr(8.2, 8.2, 14.8, 14.8, 1.3)
  const bodyBack = backOf(body, 0.6, 0.9)
  const pinsBack = backOf(differenceSets(raw, dilate(body, 0.15)), 0.3, 0.55)
  const allBack = unionSets([bodyBack, pinsBack])

  const out = []
  out.push(['path', { d: D(translateSet(grow(allBack, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(grow(allBack, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])

  const [a, b, c, d] = box(allBack)
  const gBack = lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)])
  const gPane = lin(2, 2, 21, 21, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5 }

  // pins: short glass rods round the chip
  out.push(['path', { d: D(pinsBack), fill: gBack, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(pins), fill: gPane, ...edge, 'fill-rule': 'evenodd' }])

  // the chip body: colour with a soft orb of accent light behind the frosted pane
  out.push(['path', { d: D(bodyBack), fill: gBack }])
  const gGlow = add(['radialGradient', { id: id(), cx: 15.6, cy: 15.6, r: 6.5, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]])
  out.push(['path', { d: D(bodyBack), fill: gGlow }])
  out.push(['path', { d: D(body), fill: gPane, ...edge }])
  out.push(['path', { d: D(rimOf(unionSets([body, pins]))), fill: V.shine, 'fill-opacity': 0.85, 'fill-rule': 'evenodd', class: 'wm-shine' }])

  // the core: solid tonal colour glass with a deep edge and a lit rim (it glows with work: plate A)
  const gCore = lin(8.2, 8.2, 14.8, 14.8, [stop(0, V.c1), stop(1, V.shadow)])
  out.push(['path', { d: D(core), fill: gCore, stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.5, class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(core)), fill: V.shine, 'fill-opacity': 0.8, class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
