// forge/hand/dock/file-archive.mjs — the line design on the tile: a light page with a folded corner and a zipper column of
// alternating teeth running down its centre, ending in a slider and an oval pull tab with a hole. Details in the tile's deep
// shadow tone, the pull tab in the accent so it reads at 16px. The earlier drawing was a few loose blobs.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'file-archive'
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
// rounded rectangle on the 24 grid
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`

// the page with its dog-ear
const PAGE = 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z'
const L = D.LIP / S
const LIP = `M5 ${18 - L}V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V${18 - L}A2 2 0 0 1 17 ${20 - L}H7A2 2 0 0 1 5 ${18 - L}Z`
const FOLD = 'M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19Z'
// zipper teeth: left and right in turn down the centre line (x = 12)
const TEETH_L = [3.9, 6.7, 9.5].map(y => rr(10.2, y, 1.8, 1.4, 0.3)).join('')
const TEETH_R = [5.3, 8.1, 10.9].map(y => rr(12, y, 1.8, 1.4, 0.3)).join('')
const SLIDER = rr(10.3, 12.4, 3.4, 2.1, 0.8)
const PULL = rr(10.5, 14.7, 3, 5, 1.5)
const HOLE = rr(11.4, 16.1, 1.2, 2.2, 0.6)

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'files' })
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
      lin(3, 12, fy(2.5), 12, fy(21.5), [stop(0, 'shine'), stop(1, 'tint')]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: sh, 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    ['path', { d: M(PAGE, D.DROP), fill: sh, 'fill-opacity': 0.4, stroke: sh, 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: M(PAGE), fill: url(3), class: 'wm-k' }],
    ['path', { d: M(LIP), fill: sh, 'fill-opacity': 0.22, class: 'wm-k' }],
    ['path', { d: M(FOLD), fill: sh, 'fill-opacity': 0.3, class: 'wm-k' }],
    ['path', { d: M(TEETH_L + TEETH_R), fill: sh, class: 'wm-k' }],
    ['path', { d: M(SLIDER), fill: sh, class: 'wm-k' }],
    ['path', { d: M(PULL), fill: v('accent'), class: 'wm-a' }],
    ['path', { d: M(HOLE), fill: v('tint'), class: 'wm-a' }],
  ]
}
