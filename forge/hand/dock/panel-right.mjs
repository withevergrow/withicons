// forge/hand/dock/panel-right.mjs — the line design on the tile: a light window with a distinct narrow right panel (deep tone, light item rows) split from the wide main pane (title bar in the accent and body lines). The earlier drawing was a single small inner rectangle.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'panel-right'
const S = 0.67, CY = D.CY
const r2 = n => +n.toFixed(2)
const fx = x => r2(12 + (x - 12) * S)
const fy = (y, dy = 0) => r2(CY + (y - 12) * S + dy)
// map absolute path data drawn on the 24 grid onto the tile (uniform scale, so arcs keep their shape)
function M(d, dy = 0) {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+/g)
  let out = '', i = 0, c = ''
  const n = () => +t[i++]
  const pt = () => `${fx(n())} ${fy(n(), dy)} `
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) { c = t[i++]; out += c; if (c === 'Z') continue }
    if (c === 'M' || c === 'L') out += pt()
    else if (c === 'H') out += fx(n()) + ' '
    else if (c === 'V') out += fy(n(), dy) + ' '
    else if (c === 'Q') out += pt() + pt()
    else if (c === 'C') out += pt() + pt() + pt()
    else if (c === 'A') out += `${r2(n() * S)} ${r2(n() * S)} ${n()} ${n()} ${n()} ` + pt()
    else i++
  }
  return out.replace(/ ([A-Z])/g, '$1').trim()
}
// rounded rectangle on the 24 grid
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`

const BODY = 'M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z'
const PANEL = 'M15 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H15Z'
const L = D.LIP / S
const LIP = `M3 ${19 - L}V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V${19 - L}A2 2 0 0 1 19 ${21 - L}H5A2 2 0 0 1 3 ${19 - L}Z`
// light rows inside the narrow panel
const ITEMS = 'M15.9 6.2H19.1M15.9 9.2H19.1M15.9 12.2H19.1'
// the main pane: a title bar and two body lines
const TITLE = 'M6 6.2H12.2A0.9 0.9 0 0 1 13.1 7.1000000000000005V7.1A0.9 0.9 0 0 1 12.2 8H6A0.9 0.9 0 0 1 5.1 7.1V7.1000000000000005A0.9 0.9 0 0 1 6 6.2Z'
const LINES = 'M5.1 11.4H13.1M5.1 14.4H13.1M5.1 17.4H9.899999999999999'

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
  return [
    ['defs', {}, [
      lin(0, 12, 3, 12, 33, [stop(0, 'c1'), stop(1, 'shadow')]),
      ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
      lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.55)]),
      lin(3, 12, fy(3), 12, fy(21), [stop(0, 'shine'), stop(1, 'tint')]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: sh, 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    ['path', { d: M(BODY, D.DROP), fill: sh, 'fill-opacity': 0.4, stroke: sh, 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: M(BODY), fill: url(3), class: 'wm-k' }],
    ['path', { d: M(LIP), fill: sh, 'fill-opacity': 0.22, class: 'wm-k' }],
    ['path', { d: M(PANEL), fill: sh, class: 'wm-k' }],
    ['path', { d: M(ITEMS), stroke: v('shine'), 'stroke-opacity': 0.8, 'stroke-width': 1.0, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: M(TITLE), fill: v('accent'), class: 'wm-a' }],
    ['path', { d: M(LINES), stroke: sh, 'stroke-opacity': 0.55, 'stroke-width': 0.95, 'stroke-linecap': 'round', class: 'wm-k' }],
  ]
}
