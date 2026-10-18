// forge/hand/glass/alarm-clock.mjs — a frosted glass alarm clock: a round dial pane over its colour body, two domed
// bells set apart from the dial by a clear gap, splayed feet tucked behind, and deep etch-ink hands on a luminous hub.
// The generated drawing etched the hands at a hairline and fused bells, feet and dial into one pale blob, so at 16px it
// read as a plain disc; here the hands carry Glass's live-clock weight and every part keeps its own glass silhouette.
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const disc = (x, y, r) => setOf([circle(x, y, r, 0.3)])
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
// the colour body behind a pane: slimmer and further down-right
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
// the lit-edge rim: a sliver just inside the pane wherever its edge faces the light (top-left)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))
// a soft halo: grow the colour body (piece by piece if the whole outline is too tangled to offset)
const grow = (s, r) => { try { return dilate(s, r) } catch { try { return unionSets(s.map(g => dilate([g], r))) } catch { return s } } }
// a dome: a disc cut by a chord facing (ux, uy), corners eased
function dome(cx, cy, R, t, ux, uy) {
  const a = Math.atan2(uy, ux), h = Math.acos(t / R), pts = []
  for (let i = 0; i <= 48; i++) { const g = a + h + (2 * Math.PI - 2 * h) * i / 48; pts.push([cx + R * Math.cos(g), cy + R * Math.sin(g)]) }
  return dilate(erode(setOf([pts]), 0.3), 0.3)
}

const C = [11.5, 12.1], R = 7.5

export default function render(icon) {
  const name = (icon && icon.name) || 'alarm-clock'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => add(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])

  // front panes (the front frame: drawing scaled 0.94 and lifted 0.5u up-left, as the generator places it)
  const dial = disc(C[0], C[1], R)
  const u = Math.SQRT1_2
  const bells = unionSets([dome(5.1, 5.1, 3.4, 1.3, u, u), dome(17.9, 5.1, 3.4, 1.3, -u, u)])
  const feet = differenceSets(unionSets([roundStrokeSet([[7.6, 16.2], [4.4, 20.2]], 2.2), roundStrokeSet([[15.4, 16.2], [18.6, 20.2]], 2.2)]), dilate(dial, 0.55))
  const parts = unionSets([bells, feet])
  // colour bodies
  const dialBack = backOf(dial, 0.6, 0.9)
  const partsBack = unionSets([backOf(bells, 0.45, 0.65), backOf(differenceSets(unionSets([roundStrokeSet([[7.6, 16.2], [4.4, 20.2]], 2.2), roundStrokeSet([[15.4, 16.2], [18.6, 20.2]], 2.2)]), dilate(dial, 0.2)), 0.35, 0.6)])
  const allBack = unionSets([dialBack, partsBack])

  const out = []
  // soft diffuse shadow under the colour body
  out.push(['path', { d: D(translateSet(grow(allBack, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(grow(allBack, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])

  const [a, b, c, d] = box(allBack)
  const gBack = lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)])
  const [x0, y0, x1, y1] = box(unionSets([dial, parts]))
  const gPane = lin(x0, y0, x1, y1, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5 }

  // bells and feet: their own glass, behind the dial (they ring with the hands: plate A)
  out.push(['path', { d: D(partsBack), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(parts), fill: gPane, ...edge, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(parts), fill: V.frost, 'fill-opacity': 0.3, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(bells)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // the dial: colour body with a soft orb of accent light, the frosted pane in front
  out.push(['path', { d: D(dialBack), fill: gBack, 'fill-rule': 'evenodd' }])
  const gGlow = add(['radialGradient', { id: id(), cx: 15.6, cy: 16.2, r: 6.5, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]])
  out.push(['path', { d: D(dialBack), fill: gGlow, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(dial), fill: gPane, ...edge, 'fill-rule': 'evenodd' }])
  // hour marks at 12, 3, 6 and 9, etched
  out.push(['path', { d: 'M11.5 6.2V7.2M17.4 12.1H16.4M11.5 18V17M5.6 12.1H6.6', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.8, 'stroke-linecap': 'round' }])
  out.push(['path', { d: D(rimOf(dial)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // hands: deep etch ink at the live clock's weight, on a luminous accent hub
  out.push(['path', { d: 'M11.5 7.9V12.1L14.6 14', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.9, 'stroke-width': 1.35, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: 'M12.45 12.1A.95 .95 0 1 0 10.55 12.1A.95 .95 0 1 0 12.45 12.1Z', fill: V.accent, stroke: V.etch, 'stroke-width': 0.5, class: 'wm-a' }])
  out.push(['path', { d: 'M11.47 11.75A.27 .27 0 1 0 10.93 11.75A.27 .27 0 1 0 11.47 11.75Z', fill: V.shine, 'fill-opacity': 0.9, class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
