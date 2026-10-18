// forge/hand/glass/volume-off.mjs — the muted speaker: a large violet glass speaker (box and flared cone split by an etched line) and one bold crisp accent X of even stroke. The generated speaker was small and the X smudgy. Motion: speaker wm-k, X wm-s.
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const SPK = [['M', 2.5, 9.2], ['Q', 2.5, 8.4, 3.3, 8.4], ['L', 6.6, 8.4], ['L', 10.7, 4.6], ['Q', 12, 3.5, 12, 5.1], ['L', 12, 18.9], ['Q', 12, 20.5, 10.7, 19.4], ['L', 6.6, 15.6], ['L', 3.3, 15.6], ['Q', 2.5, 15.6, 2.5, 14.8]]
const sp = (dx = 0, dy = 0) => SPK.map(([c, ...a]) => c + a.map((v, i) => f(v + (i % 2 ? dy : dx))).join(' ')).join('') + 'Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'volume-off'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }
  const id = () => `wg-glass-${name}-${n++}`
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
  const back = add(lin(id(), 3, 3.5, 13, 21, [stop(0, V.c1), stop(1, V.shadow)]))
  const glow = add(rad(id(), 10, 17, 6.5, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]))
  const pane = add(lin(id(), 2, 3, 12, 19, [stop(0, V.frost, 0.78), stop(0.4, V.tint, 0.7), stop(1, V.tint, 0.58)]))
  const X = 'M15.7 8.9L21.1 15.1M21.1 8.9L15.7 15.1'
  const XS = 'M16 9.5L21.4 15.7M21.4 9.5L16 15.7'
  return [['defs', {}, defs],
    ['path', { d: sp(1.1, 1.1), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['path', { d: sp(0.8, 0.8), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: sp(0.8, 0.8), fill: back, class: 'wm-k' }],
    ['path', { d: sp(0.8, 0.8), fill: glow, class: 'wm-k' }],
    ['path', { d: sp(), fill: pane, ...edge, class: 'wm-k' }],
    ['path', { d: 'M6.7 9V15', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.6, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M2.95 13V9.4Q2.95 8.85 3.5 8.85H6.7L10.9 5.05', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['path', { d: XS, fill: 'none', stroke: V.shadow, 'stroke-opacity': 0.3, 'stroke-width': 2.4, 'stroke-linecap': 'round', class: 'wm-shadow' }],
    ['path', { d: X, fill: 'none', stroke: V.accent, 'stroke-width': 2.4, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M15.5 8.5L17.6 10.9M21.3 8.7L20.4 9.7', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.75, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
