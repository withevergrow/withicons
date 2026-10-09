// GLASS hand-drawn piggy bank (forge/icons/piggy-bank.json stays the base; this replaces only Glass's drawing).
// Frosted glass the Glass way: a pink colour body glows behind, offset down-right; in front, a chubby frosted piggy
// in 3/4 view facing right with a bright rim. The features are solid so the face reads at 16px: a deeper-pink glass
// snout with two etch nostrils, a perky near ear (pink glass inside) and a far ear peeking behind, a glossy etch eye,
// a rosy cheek, a curly tail, four stubby legs, an etched coin slot and a gold glass coin dropping in.
// Roles: body --with-glass-c1, snout + inner ear --with-glass-c2, coin --with-glass-c3, eye/nostrils etch (ink).
// Motion: body wm-k, snout/ears/eye wm-a, coin wm-s.
import { V } from './_glass-soft.mjs'

const f = v => +v.toFixed(2)
const oval = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

const BACK = 'var(--with-glass-c1, #F07CA2)'
const SNOUT = 'var(--with-glass-c2, #E2577F)'
const GOLD = 'var(--with-glass-c3, #F5B82E)'

const BODY = 'M3.6 13.6C3.6 9.9 7 8 11.2 8C15.1 8 17.6 9.6 18.6 11.8C19.2 13.2 19.1 15.4 18.2 16.8C16.8 18.9 14.2 19.6 11 19.6C6.7 19.6 3.6 17.5 3.6 13.6Z'
const EAR_FAR = 'M12.6 9.2C12.4 7.6 12.9 6.3 13.6 5.9C14.5 6.4 15.2 7.7 15.1 9.1Z'
const EAR = 'M14.3 9.6C14.4 7.8 15.3 6.3 16.3 5.8C17.2 6.6 17.6 8.4 17.2 10.3Z'
const EAR_IN = 'M15.1 9.6C15.2 8.4 15.7 7.4 16.3 7C16.8 7.6 17 8.7 16.7 9.9Z'
const LEGS_FAR = 'M6 16.6h1.9v2.9a.95 .95 0 0 1-1.9 0Z M13.2 17h1.9v2.6a.95 .95 0 0 1-1.9 0Z'
const LEGS = 'M7.6 17.4h2.2v3a1.1 1.1 0 0 1-2.2 0Z M15 17.1h2.2v3a1.1 1.1 0 0 1-2.2 0Z'
const TAIL = 'M3.8 13.4C2.6 13.6 1.9 12.6 2.5 11.8C3.1 11.1 4 11.6 3.6 12.3C3.3 12.8 2.6 12.5 2.6 11.9C2.6 11.1 3.2 10.6 3.8 10.6'

export function glassPiggy() {
  let n = 0
  const id = () => `wg-glass-piggy-bank-${n++}`, url = g => `url(#${g[1].id})`
  const defs = [], out = []
  const add = g => { defs.push(g); return url(g) }
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.45 }
  out.push(['path', { d: oval(11.8, 21.2, 8, 1.1), fill: V.shadow, 'fill-opacity': 0.12, class: 'wm-shadow' }])
  // far ear, far legs and the tail (behind the glass)
  out.push(['path', { d: EAR_FAR + LEGS_FAR, fill: BACK, 'fill-opacity': 0.75, ...edge, class: 'wm-a' }])
  out.push(['path', { d: TAIL, fill: 'none', stroke: SNOUT, 'stroke-width': 0.95, 'stroke-linecap': 'round', class: 'wm-k' }])
  // back: the colour body glowing behind, offset down-right
  const g0 = add(lin(id(), 5, 8, 18, 20, [stop(0, BACK), stop(1, SNOUT)]))
  out.push(['path', { d: BODY, fill: g0, transform: 'translate(.7 .6)', class: 'wm-k' }])
  out.push(['path', { d: LEGS, fill: g0, transform: 'translate(.4 .2)', class: 'wm-k' }])
  // front: frosted glass body and legs
  const g1 = add(lin(id(), 5, 8, 17, 20, [stop(0, V.frost, 0.8), stop(0.45, V.tint, 0.6), stop(1, V.tint, 0.42)]))
  out.push(['path', { d: LEGS, fill: g1, ...edge, class: 'wm-k' }])
  out.push(['path', { d: BODY, fill: g1, ...edge, class: 'wm-k' }])
  const g4 = add(lin(id(), 5, 8, 17, 20, [stop(0, BACK, 0.15), stop(1, BACK, 0.45)]))
  out.push(['path', { d: BODY + LEGS, fill: g4, class: 'wm-k' }])
  // bright rim light
  out.push(['path', { d: 'M4.4 12.4C5 10.2 7.4 8.8 10.4 8.65M15.6 9.3C16.6 9.8 17.4 10.5 17.9 11.3', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.95, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  // coin slot
  out.push(['path', { d: 'M8.1 9.4Q9.6 8.7 11.2 8.8', fill: 'none', stroke: V.etch, 'stroke-width': 0.75, 'stroke-linecap': 'round', class: 'wm-k' }])
  // near ear: frosted with a pink glass inside
  out.push(['path', { d: EAR, fill: g1, ...edge, class: 'wm-a' }])
  out.push(['path', { d: EAR_IN, fill: SNOUT, 'fill-opacity': 0.9, class: 'wm-a' }])
  // cheek
  out.push(['path', { d: oval(15.6, 14.6, 1.05, 0.65), fill: V.accent, 'fill-opacity': 0.55 }])
  // snout: solid deeper-pink glass, a light top edge, two etch nostrils
  const g2 = add(lin(id(), 18, 11.4, 20, 15.4, [stop(0, SNOUT), stop(1, V.shadow, 0.9)]))
  out.push(['path', { d: oval(19.1, 13.4, 1.55, 1.95), fill: SNOUT, class: 'wm-a' }])
  out.push(['path', { d: oval(19.1, 13.4, 1.55, 1.95), fill: g2, 'fill-opacity': 0.4, stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 0.4, class: 'wm-a' }])
  out.push(['path', { d: oval(18.55, 13.5, 0.36, 0.62) + oval(19.65, 13.5, 0.36, 0.62), fill: V.etch, class: 'wm-a' }])
  out.push(['path', { d: 'M18.2 12C18.6 11.65 19.3 11.6 19.8 11.85', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-shine' }])
  // glossy etch eye
  out.push(['path', { d: oval(15.5, 11.6, 0.68, 0.82), fill: V.etch, class: 'wm-a' }])
  out.push(['path', { d: oval(15.3, 11.3, 0.25, 0.25), fill: V.shine, class: 'wm-shine' }])
  // gold glass coin dropping in
  const g3 = add(lin(id(), 8, 3.2, 11.4, 7.2, [stop(0, V.shine, 0.7), stop(0.5, GOLD, 0), stop(1, V.shadow, 0.35)]))
  out.push(['path', { d: oval(9.6, 5.2, 1.75, 2.05), fill: GOLD, class: 'wm-s' }])
  out.push(['path', { d: oval(9.6, 5.2, 1.75, 2.05), fill: g3, stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 0.4, class: 'wm-s' }])
  out.push(['path', { d: oval(9.6, 5.2, 1.05, 1.27), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.4, class: 'wm-s' }])
  return [['defs', {}, defs], ...out]
}
