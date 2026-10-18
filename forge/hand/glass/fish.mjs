// forge/hand/glass/fish.mjs — Glass fish, hand-drawn: the generated drawing frosted the tail into the body with only a
// shallow notch and etched a faint ring eye, so the fish read as a bean or a bulb. Here the tail is its own deeper
// violet glass fin with a deep fork (2u notch) tucked behind a clear frosted body, the eye is a solid etch-ink dot with
// a specular point and the gill is a firm etched arc, so the silhouette says "fish" at 16px.
// Roles: back/shadow body, pane/frost glass, accent glow, etch eye + gill, shine rim. Motion: all wm-k (sway).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'fish'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
// tidy rings (round, drop near-duplicate points) so the boolean ops stay robust
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
// skeleton-coord path (absolute M L H V C Q Z) -> glass front frame
const tf = d => d.replace(/([MLHVCQZ])([^MLHVCQZ]*)/g, (m, c, a) => {
  const v = (a.match(/-?\d*\.?\d+/g) || []).map(Number)
  return c + v.map(n => X(n)).join(' ')
})

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  // skeleton coords: a plump body with a rounded snout, and a forked tail fin whose lobes flare well past the notch
  const body = place(area('M7.2 12 C9.2 8.3 12.1 6.5 15.1 6.5 C18.6 6.5 21.2 8.9 21.6 12 C21.2 15.1 18.6 17.5 15.1 17.5 C12.1 17.5 9.2 15.7 7.2 12 Z'))
  const tailRaw = place(area('M9.2 12 L4.1 6.9 C3.4 6.3 2.2 6.6 2.3 7.7 L4.5 12 L2.3 16.3 C2.2 17.4 3.4 17.7 4.1 17.1 Z'))
  const tail = tidy(dilate(tidy(erode(tailRaw, 0.3)), 0.3))
  const bodyB = translateSet(tidy(erode(body, 0.3)), 0.8, 0.8)
  const tailB = translateSet(tidy(erode(tail, 0.2)), 0.6, 0.6)
  const all = tidy(unionSets([bodyB, tailB]))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const [a, b, c, d] = box(all)
  const gBack = grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 17.5, cy: 15.5, r: 7 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])

  // tail: a deeper violet glass fin behind the body (thin frost so the fork reads against the clear body)
  out.push(['path', { d: D(tailB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(tail), fill: grad('linearGradient', { x1: 2.5, y1: 6.5, x2: 8.5, y2: 16.5 }, [stop(0, V.frost, 0.45), stop(0.5, V.tint, 0.26), stop(1, V.tint, 0.16)]), ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(tail)), fill: V.shine, 'fill-opacity': 0.8, class: 'wm-shine' }])
  // body: colour body, accent glow, clear frosted pane, lit rim
  out.push(['path', { d: D(bodyB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(bodyB), fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(body), fill: grad('linearGradient', { x1: 6.5, y1: 5.5, x2: 20, y2: 17 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]), ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(body)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // gill arc and a solid etch eye with a specular point
  out.push(['path', { d: tf('M12.2 9.4 C13.1 11.1 13.1 12.9 12.2 14.6'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.7, 'stroke-width': 0.85, 'stroke-linecap': 'round', class: 'wm-k' }])
  out.push(['path', { d: tf('M17.1 9.5 C17.8 9.5 18.3 10.05 18.3 10.7 C18.3 11.35 17.8 11.9 17.1 11.9 C16.4 11.9 15.9 11.35 15.9 10.7 C15.9 10.05 16.4 9.5 17.1 9.5 Z'), fill: V.etch, 'fill-opacity': 0.92, class: 'wm-k' }])
  out.push(['path', { d: tf('M16.75 10.25 L16.8 10.2'), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.95, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
