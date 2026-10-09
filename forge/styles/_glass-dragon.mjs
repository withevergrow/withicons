// GLASS hand-drawn dragon head (forge/icons/dragon-head.json stays the base; this replaces only Glass's drawing).
// Frosted glass the Glass way: a red glass back glows behind, offset down-right; in front, the frosted dragon head
// with a hairline edge and a rim light, gold glass antlers and long curling whiskers, frosted cream tufts, brows
// and beard, an orange glass pearl, a big nose with etched nostrils, an etched mouth with frosted teeth.
// Roles: back (c1, red), antlers/whiskers --with-glass-c2 (gold), pearl --with-glass-c4.
import { V } from './_glass-soft.mjs'
import { G, disc, oval } from './_sticker-dragon.mjs'

const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const shift = (d, dx, dy) => d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)
const RED = 'var(--with-glass-back, #F0444F)'
const GOLD = 'var(--with-glass-c2, #F5B93A)'
const PEARL = 'var(--with-glass-c4, #FF8A3D)'

export function glassDragon() {
  let n = 0
  const id = () => `wg-glass-dragon-head-${n++}`
  const defs = [], out = []
  const add = g => { defs.push(g); return `url(#${g[1].id})` }
  const round = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  out.push(['path', { d: oval(12.5, 22.4, 6, 0.9), fill: V.shadow, 'fill-opacity': 0.12, class: 'wm-shadow' }])
  // gold antlers and whiskers
  out.push(['path', { d: G.antlers + G.whiskers, fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-width': 1.9, ...round, class: 'wm-a' }])
  out.push(['path', { d: G.antlers + G.whiskers, fill: 'none', stroke: GOLD, 'stroke-width': 1.3, ...round, class: 'wm-a' }])
  // back: the red colour body, offset down-right
  const g0 = add(lin(id(), 6, 6, 18, 21, [stop(0, RED), stop(1, V.shadow)]))
  out.push(['path', { d: shift(G.head, 0.7, 0.7), fill: g0 }])
  // beard and tufts, frosted
  out.push(['path', { d: G.beard + G.tufts, fill: V.frost, 'fill-opacity': 0.9, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.45 }])
  // front: red glass head
  const g1 = add(lin(id(), 7, 5.5, 17, 20.5, [stop(0, RED, 0.85), stop(1, RED, 0.6)]))
  out.push(['path', { d: G.head, fill: g1, stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 0.5, class: 'wm-k' }])
  const g2 = add(lin(id(), 7, 5.5, 14, 14, [stop(0, V.frost, 0.55), stop(1, V.frost, 0)]))
  out.push(['path', { d: G.head, fill: g2 }])
  out.push(['path', { d: 'M6.4 10Q6.7 7.6 9.2 6.5', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  // brows, eyes, pearl
  out.push(['path', { d: G.brows, fill: V.frost, 'fill-opacity': 0.95, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.35, class: 'wm-a' }])
  out.push(['path', { d: disc(...G.eyes[0], 0.8) + disc(...G.eyes[1], 0.8), fill: V.etch }])
  out.push(['path', { d: disc(G.eyes[0][0] - 0.25, G.eyes[0][1] - 0.25, 0.27) + disc(G.eyes[1][0] - 0.25, G.eyes[1][1] - 0.25, 0.27), fill: V.shine, class: 'wm-shine' }])
  out.push(['path', { d: disc(...G.pearl), fill: PEARL, stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 0.4, class: 'wm-s' }])
  out.push(['path', { d: disc(G.pearl[0] - 0.4, G.pearl[1] - 0.4, 0.3), fill: V.shine, class: 'wm-shine' }])
  // nose, nostrils, mouth, teeth
  out.push(['path', { d: G.nose, fill: RED, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.45 }])
  out.push(['path', { d: G.nostrils + G.mouth, fill: V.etch }])
  out.push(['path', { d: G.teeth, fill: V.frost, class: 'wm-s' }])
  return [['defs', {}, defs], ...out]
}
