// forge/hand/glass/webcam.mjs — a frosted glass webcam: a round head pane over its colour body, a deep etched lens with
// a glowing iris, and a separate neck and wide foot set apart from the head by a clear gap. The generated drawing
// washed the lens out and fused head, neck and base into one pale blob; here the lens carries the contrast and the
// stand reads as its own glass piece.
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const disc = (x, y, r) => setOf([circle(x, y, r, 0.3)])
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))
const grow = (s, r) => { try { return dilate(s, r) } catch { try { return unionSets(s.map(g => dilate([g], r))) } catch { return s } } }

const C = [11.5, 9.3], R = 7.3

export default function render(icon) {
  const name = (icon && icon.name) || 'webcam'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => add(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])
  const rad = (cx, cy, r, stops) => add(['radialGradient', { id: id(), cx: f2(cx), cy: f2(cy), r: f2(r), gradientUnits: 'userSpaceOnUse' }, stops])

  const head = disc(C[0], C[1], R)
  const standRaw = unionSets([roundStrokeSet([[11.5, 14.5], [11.5, 19.6]], 2.8), roundStrokeSet([[6.6, 20.4], [16.4, 20.4]], 2.8)])
  const stand = differenceSets(standRaw, dilate(head, 0.55))
  const standBack = backOf(stand, 0.3, 0.55)
  const headBack = backOf(head, 0.6, 0.9)
  const allBack = unionSets([headBack, standBack])

  const out = []
  out.push(['path', { d: D(translateSet(grow(allBack, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(grow(allBack, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])

  const [a, b, c, d] = box(allBack)
  const gBack = lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)])
  const [x0, y0, x1, y1] = box(unionSets([head, stand]))
  const gPane = lin(x0, y0, x1, y1, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5 }

  // neck and foot: their own glass, behind the head
  out.push(['path', { d: D(standBack), fill: gBack, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(stand), fill: gPane, ...edge, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(stand), fill: V.frost, 'fill-opacity': 0.3, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(rimOf(stand)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // head: colour body with a soft orb of accent light, the frosted pane in front
  out.push(['path', { d: D(headBack), fill: gBack, 'fill-rule': 'evenodd' }])
  const gGlow = rad(15.4, 13.4, 7, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  out.push(['path', { d: D(headBack), fill: gGlow, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(head), fill: gPane, ...edge, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(rimOf(head)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // lens: deep etched disc, glowing iris, dark pupil, catch-light
  const lens = disc(C[0], C[1], 4.3)
  out.push(['path', { d: D(lens), fill: V.etch, 'fill-opacity': 0.88, stroke: V.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.5, 'fill-rule': 'evenodd' }])
  const gIris = rad(C[0] - 0.6, C[1] - 0.8, 3, [stop(0, V.frost), stop(0.55, V.accent), stop(1, V.back)])
  out.push(['path', { d: D(disc(C[0], C[1], 2.6)), fill: gIris, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(disc(C[0], C[1], 1.1)), fill: V.etch, 'fill-opacity': 0.9, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(disc(C[0] - 1.6, C[1] - 1.7, 0.7)), fill: V.shine, 'fill-opacity': 0.95, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
