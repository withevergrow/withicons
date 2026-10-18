// forge/hand/dock/maximize-2.mjs — the line design on the tile: two bold chevron arrows (NW and SE) in white, drawn large across the tile.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'maximize-2'
const Y = 11.9
// shafts and chevron heads, tile coordinates
const SHAFT = `M6.2 ${Y - 5.8}L10.6 ${Y - 1.4}M17.8 ${Y + 5.8}L13.4 ${Y + 1.4}`
const HEADS = `M6.2 ${Y - 1.4}V${Y - 5.8}H10.6M17.8 ${Y + 1.4}V${Y + 5.8}H13.4`

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'layout' })
  const id = n => `wg-dock-${NAME}-${n}`
  const url = n => `url(#${id(n)})`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)
  const sh = v('shadow')
  const dy = D.DROP
  const SH_SHAFT = `M6.2 ${+(Y - 5.8 + dy).toFixed(2)}L10.6 ${+(Y - 1.4 + dy).toFixed(2)}M17.8 ${+(Y + 5.8 + dy).toFixed(2)}L13.4 ${+(Y + 1.4 + dy).toFixed(2)}`
  const SH_HEADS = `M6.2 ${+(Y - 1.4 + dy).toFixed(2)}V${+(Y - 5.8 + dy).toFixed(2)}H10.6M17.8 ${+(Y + 1.4 + dy).toFixed(2)}V${+(Y + 5.8 + dy).toFixed(2)}H13.4`
  const stroke = { 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      lin(0, 12, 3, 12, 33, [stop(0, 'c1'), stop(1, 'shadow')]),
      ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
      lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.55)]),
      lin(3, 12, 5, 12, 19, [stop(0, 'shine'), stop(1, 'tint')]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: sh, 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    ['path', { d: SH_SHAFT, stroke: sh, 'stroke-opacity': 0.4, ...stroke, class: 'wm-shadow' }],
    ['path', { d: SH_HEADS, stroke: sh, 'stroke-opacity': 0.4, ...stroke, class: 'wm-shadow' }],
    ['path', { d: SHAFT, stroke: url(3), ...stroke, class: 'wm-k' }],
    ['path', { d: HEADS, stroke: url(3), ...stroke, class: 'wm-a' }],
  ]
}
