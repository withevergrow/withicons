// forge/hand/glass/gingerbread-man.mjs — Glass gingerbread man, hand-drawn: the generated cookie fused its arms into the
// torso (the armpits were shallow notches that closed at 16px) and its face, buttons and icing were faint etch marks on
// a pale lump. Here the cookie is built from round limbs: a round head on a short neck, arms lifted a little so a clear
// gap opens under each, splayed legs with a wide crotch, all softened into one frosted pane over the violet body. Two
// accent gumdrop buttons and a smiling etched face give it character at a glance.
// Roles: back/shadow body, pane/frost glass, accent buttons + orb, etch face and icing, shine rim.
// Motion: the whole cookie rocks (wm-k); buttons are plate A (wm-a).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, circle } from '../../kernel/geom.mjs'
import { roundStrokeSet, unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'gingerbread-man'
const K = 0.94
const pt = (x, y, d) => [12 + (x - 12) * K + d, 12 + (y - 12) * K + d]
const place = (set, d) => set.map(r => r.map(([x, y]) => pt(x, y, d)))
const area = d => unionSets(parsePath(d, 0.25).map(s => setOf([s.pts])))
const tube = (d, w) => unionSets(parsePath(d, 0.25).map(s => roundStrokeSet(s.pts, w, s.closed)))
const D = set => setD(set.filter(r => Math.abs(ringArea(r)) > 0.4), 0.07)
const ringArea = r => { let a = 0; for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1] } return a / 2 }
const f = v => +v.toFixed(2)
// bake the pane placement into an absolute M/L/Q/C path written in skeleton coordinates
const onPane = (d, dd = -0.45) => { let i = 0, x = 0; return d.replace(/-?\d*\.?\d+/g, v => { if (i++ % 2 === 0) { x = +v; return String(f(12 + (x - 12) * K + dd)) } return String(f(12 + (+v - 12) * K + dd)) }) }
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, w = 0.45) => { const e = erode(F, 0.08); return differenceSets(e, translateSet(e, w * 0.66, w)) }

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }

  // head, torso, two lifted arms and two splayed legs, as round tubes merged into one cookie
  const cookie = unionSets([
    setOf([circle(12, 5.3, 3.45, 0.25)]),
    area('M10.8 8 H13.2 C14.6 8 15.4 8.8 15.4 10.2 V14.3 C15.4 15.6 14.6 16.4 13.3 16.4 H10.7 C9.4 16.4 8.6 15.6 8.6 14.3 V10.2 C8.6 8.8 9.4 8 10.8 8 Z'),
    tube('M10 10.9 L5.85 10.05', 4),
    tube('M14 10.9 L18.15 10.05', 4),
    tube('M10.5 15.2 L7.9 19.6', 4),
    tube('M13.5 15.2 L16.1 19.6', 4),
    // fillets where the head meets the shoulders and the arms meet the torso
    area('M8.9 9.1Q10 8.75 10.25 7.5H13.75Q14 8.75 15.1 9.1V10H8.9Z'),
    area('M8.4 12.6Q8.9 12.6 9.05 13.6H9.6V12.4Z'),
    area('M15.6 12.6Q15.1 12.6 14.95 13.6H14.4V12.4Z'),
  ])
  const F = place(cookie, -0.45)
  const B = translateSet(place(erode(cookie, 0.35), 0), 0.55, 0.5)
  const out = []
  const h = translateSet(B, 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35)), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  const body = grad('linearGradient', { x1: 4, y1: 2.5, x2: 20.5, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])
  const bd = D(B)
  out.push(['path', { d: bd, fill: body, class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 15.8, cy: 16.5, r: 7 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  // the frosted cookie pane, firm hairline
  out.push(['path', {
    d: D(F), fill: grad('linearGradient', { x1: 3.5, y1: 2, x2: 19, y2: 21 }, [stop(0, V.frost, 0.58), stop(0.4, V.tint, 0.46), stop(1, V.tint, 0.32)]),
    stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k',
  }])
  // face: two etched eyes and a smile; icing zigzags across the wrists and ankles
  const etch = { fill: 'none', stroke: V.etch, 'stroke-opacity': 0.7, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }
  for (const x of [10.8, 13.2]) { const [cx, cy] = pt(x, 4.55, -0.45); out.push(['circle', { cx: f(cx), cy: f(cy), r: 0.56, fill: V.etch, 'fill-opacity': 0.8, class: 'wm-k' }]) }
  out.push(['path', { d: onPane('M10.55 6.1Q12 7.35 13.45 6.1'), ...etch }])
  out.push(['path', { d: onPane('M6.15 8.65Q7.2 10.2 6.6 11.95M17.85 8.65Q16.8 10.2 17.4 11.95M6.45 18.35Q7.9 19.45 9.4 18.9M17.55 18.35Q16.1 19.45 14.6 18.9'), ...etch, 'stroke-opacity': 0.55, 'stroke-width': 0.6 }])
  // two accent gumdrop buttons with a specular dot
  const btn = place(setOf([circle(12, 10.75, 1.05, 0.15), circle(12, 14, 1.05, 0.15)]), -0.45)
  out.push(['path', { d: D(btn), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 0.35, class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(btn, 0.35)), fill: V.shine, 'fill-opacity': 0.8, class: 'wm-a wm-shine' }])
  // lit rim along the upper-left edges
  out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
