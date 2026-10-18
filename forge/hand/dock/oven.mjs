// forge/hand/dock/oven.mjs — the redesigned oven: control strip with a display and two knobs, a window with wavy heat
// lines, a bottom drawer and two feet. Light glyph material on the tile; details painted in the tile's deep shadow tone,
// heat lines in the accent so the window reads at 16px.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'oven'
const S = D.GLYPH, CY = D.CY
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

const BODY = 'M6 3.5H18A2 2 0 0 1 20 5.5V17A2 2 0 0 1 18 19H6A2 2 0 0 1 4 17V5.5A2 2 0 0 1 6 3.5Z'
const FEET = 'M6 18.5H9V20A.75 .75 0 0 1 8.25 20.75H6.75A.75 .75 0 0 1 6 20ZM15 18.5H18V20A.75 .75 0 0 1 17.25 20.75H15.75A.75 .75 0 0 1 15 20Z'
const L = D.LIP / S
const LIP = `M4 ${17 - L}V17A2 2 0 0 0 6 19H18A2 2 0 0 0 20 17V${17 - L}A2 2 0 0 1 18 ${19 - L}H6A2 2 0 0 1 4 ${17 - L}Z`
const DISPLAY = 'M6.5 5H10.5V6.6H6.5Z'
const WINDOW = 'M7 8.5H17A1 1 0 0 1 18 9.5V13A1 1 0 0 1 17 14H7A1 1 0 0 1 6 13V9.5A1 1 0 0 1 7 8.5Z'
const HEAT = 'M8.75 12.7C9.4 12.1 9.4 11.75 8.75 11.15C8.1 10.55 8.1 10.2 8.75 9.6M12 12.7C12.65 12.1 12.65 11.75 12 11.15C11.35 10.55 11.35 10.2 12 9.6M15.25 12.7C15.9 12.1 15.9 11.75 15.25 11.15C14.6 10.55 14.6 10.2 15.25 9.6'
const DRAWER = 'M6 15.25H18M10 16.9H14'

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'food' })
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
      lin(3, 12, fy(3.5), 12, fy(20.75), [stop(0, 'shine'), stop(1, 'tint')]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: sh, 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    ['path', { d: M(BODY + FEET, D.DROP), fill: sh, 'fill-opacity': 0.4, stroke: sh, 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: M(FEET), fill: url(3), class: 'wm-k' }],
    ['path', { d: M(FEET), fill: sh, 'fill-opacity': 0.3, class: 'wm-k' }],
    ['path', { d: M(BODY), fill: url(3), class: 'wm-k' }],
    ['path', { d: M(LIP), fill: sh, 'fill-opacity': 0.22, class: 'wm-k' }],
    ['path', { d: M(DISPLAY), fill: sh, class: 'wm-k' }],
    ['circle', { cx: fx(14.4), cy: fy(5.8), r: r2(0.95 * S), fill: sh, class: 'wm-k' }],
    ['circle', { cx: fx(17.1), cy: fy(5.8), r: r2(0.95 * S), fill: sh, class: 'wm-k' }],
    ['path', { d: M(WINDOW), fill: sh, class: 'wm-k' }],
    ['path', { d: M(HEAT), stroke: v('accent'), 'stroke-width': 0.95, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: M(DRAWER), stroke: sh, 'stroke-width': 0.75, 'stroke-linecap': 'round', class: 'wm-k' }],
  ]
}
