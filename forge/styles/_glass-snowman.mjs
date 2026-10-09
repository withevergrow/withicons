// GLASS hand-drawn snowman (forge/icons/snowman.json stays the base; this replaces only Glass's drawing).
// Frosted glass the Glass way: an icy colour body glows behind, offset down-right; in front, two chubby frosted
// snowballs with a hairline edge and a light rim. A red glass Santa hat flops to the right over a frosted fur band
// and pompom, a striped glass scarf hangs down with an etched fringe, big glossy etch eyes, rosy accent cheeks,
// a carrot nose, a little smile, two coal buttons and etched twig arms.
// Roles: back (c1, the snow's colour), hat --with-glass-c2, scarf --with-glass-c3, nose --with-glass-c4, cheeks accent.
import { V } from './_glass-soft.mjs'

const f = v => +v.toFixed(2)
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x - r)} ${f(y)}Z`
const oval = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

const HAT = 'var(--with-glass-c2, #F0506E)'
const SCARF = 'var(--with-glass-c3, #FFA94D)'
const NOSE = 'var(--with-glass-c4, #FF8A3D)'

// geometry (24 grid): body ball, head ball
const BODY = [12, 16.4, 5.3], HEAD = [12, 9.5, 3.85]
const balls = (dx = 0, dy = 0) => disc(BODY[0] + dx, BODY[1] + dy, BODY[2]) + disc(HEAD[0] + dx, HEAD[1] + dy, HEAD[2])
const HAT_D = 'M8.3 7.6C8.2 4.2 10.6 2.2 13.6 2.3C16.3 2.4 18.3 4.3 18.9 6.9L16.3 7.6Z'
const FUR_D = 'M8.1 6.6H15.9A1 1 0 0 1 15.9 8.6H8.1A1 1 0 0 1 8.1 6.6Z'
const SCARF_D = 'M8 12.5Q12 14.5 16 12.5L16.4 14.2Q12 16.6 7.6 14.2Z' +
  'M13.3 14.9L15.6 14.4L16.4 18.6L14.1 19Z'

export function glassSnowman() {
  let n = 0
  const id = () => `wg-glass-snowman-${n++}`, url = g => `url(#${g[1].id})`
  const defs = [], out = []
  const add = g => { defs.push(g); return url(g) }
  // soft ground shadow
  out.push(['path', { d: oval(12.6, 22.1, 7, 1.15), fill: V.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }])
  out.push(['path', { d: oval(12.6, 22.1, 5, 0.75), fill: V.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }])
  // twig arms, behind everything (currentColor, so they read on white and on dark)
  out.push(['path', { d: 'M7.4 14.6L3.6 11.9M4.9 12.8L4.6 10.6M3.6 11.9L2.1 11.8M16.6 14.6L20.4 11.9M19.1 12.8L19.4 10.6M20.4 11.9L21.9 11.8',
    fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.7, 'stroke-width': 1.05, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }])
  // back: the icy colour body, offset down-right, with an accent orb inside
  const g0 = add(lin(id(), 6, 6, 19, 22.5, [stop(0, V.c1), stop(1, V.shadow)]))
  out.push(['path', { d: balls(0.7, 0.7), fill: g0 }])
  const g1 = add(rad(id(), 15.2, 18.6, 5.5, [stop(0, V.accent, 0.5), stop(0.5, V.accent, 0.18), stop(1, V.accent, 0)]))
  out.push(['path', { d: balls(0.7, 0.7), fill: g1 }])
  // front: frosted snowballs
  const g2 = add(lin(id(), 7, 5.5, 17, 21.5, [stop(0, V.frost, 0.78), stop(0.45, V.tint, 0.62), stop(1, V.tint, 0.46)]))
  out.push(['path', { d: balls(), fill: g2, stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5 }])
  // rim light along the lit top-left edges
  out.push(['path', { d: 'M7.4 14.2A5.3 5.3 0 0 1 9.6 11.7M8.75 8.1A3.85 3.85 0 0 1 10.1 6.3', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  // scarf: warm glass with frosted stripes and an etched fringe
  const g3 = add(lin(id(), 8, 12, 16, 19, [stop(0, SCARF), stop(1, V.shadow, 0.9)]))
  out.push(['path', { d: SCARF_D, fill: SCARF, 'fill-opacity': 0.9, class: 'wm-a' }])
  out.push(['path', { d: SCARF_D, fill: g3, 'fill-opacity': 0.35, stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.4, class: 'wm-a' }])
  out.push(['path', { d: 'M10.3 13.5L10.1 15.2M12.6 13.7L12.6 15.5M13.9 16L15.9 15.6M14.3 17.3L16.2 16.9', fill: 'none', stroke: V.frost, 'stroke-opacity': 0.8, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-a' }])
  out.push(['path', { d: 'M14.4 19L14.3 20M15.3 18.85L15.3 19.85M16.2 18.7L16.3 19.6', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.6, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-a' }])
  // Santa hat: red glass flopping right, frosted fur band and pompom
  const g4 = add(lin(id(), 9, 2.5, 17, 8.5, [stop(0, HAT), stop(1, V.shadow, 0.9)]))
  out.push(['path', { d: HAT_D, fill: HAT, class: 'wm-a' }])
  out.push(['path', { d: HAT_D, fill: g4, 'fill-opacity': 0.45, stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.4, class: 'wm-a' }])
  out.push(['path', { d: 'M10.1 5.2C10.6 3.9 11.7 3.1 13 2.95', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.75, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a' }])
  const fur = FUR_D + disc(19, 7.4, 1.3)
  const g5 = add(lin(id(), 8, 6.3, 16, 9, [stop(0, V.frost, 0.98), stop(1, V.tint, 0.9)]))
  out.push(['path', { d: fur, fill: g5, stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 0.45, class: 'wm-a' }])
  // face: glossy etch eyes with a catch-light, rosy cheeks, carrot nose, a small smile
  out.push(['path', { d: oval(10.5, 10, 0.62, 0.78) + oval(13.5, 10, 0.62, 0.78), fill: V.etch }])
  out.push(['path', { d: disc(10.32, 9.72, 0.24) + disc(13.32, 9.72, 0.24), fill: V.shine, class: 'wm-shine' }])
  out.push(['path', { d: oval(9.4, 11.5, 0.75, 0.45) + oval(14.6, 11.5, 0.75, 0.45), fill: V.accent, 'fill-opacity': 0.55 }])
  out.push(['path', { d: 'M11.8 10.9L14.9 11.65L11.85 12.1Z', fill: NOSE, stroke: NOSE, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }])
  out.push(['path', { d: 'M11 12.55Q12 13.2 13 12.55', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.85, 'stroke-width': 0.55, 'stroke-linecap': 'round' }])
  // two coal buttons with a glint
  out.push(['path', { d: disc(11.4, 17, 0.7) + disc(11.4, 19.3, 0.7), fill: V.etch, 'fill-opacity': 0.9 }])
  out.push(['path', { d: disc(11.2, 16.8, 0.22) + disc(11.2, 19.1, 0.22), fill: V.shine, 'fill-opacity': 0.9, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
