// forge/hand/dock/bread.mjs — a domed loaf in the light glyph material with three bold score cuts painted in the tile's
// deep shadow tone; the generated glyph knocked the cuts out as thin slivers of the orange tile that vanished into the
// loaf at 24 and 16px. Drawn on the 24 grid, placed with the house glyph scale, tile, drop shadow and bottom lip.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'bread'
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

// the drawing, on the 24 grid (the skeleton's loaf)
const LOAF = 'M4.5 20H19.5A2 2 0 0 0 21.5 18V13.5C21.5 8 17.5 4.5 12 4.5C6.5 4.5 2.5 8 2.5 13.5V18A2 2 0 0 0 4.5 20Z'
const L = D.LIP / S                                                   // lip depth on the grid
const LOAF_LIP = `M2.5 ${18 - L}V18A2 2 0 0 0 4.5 20H19.5A2 2 0 0 0 21.5 18V${18 - L}A2 2 0 0 1 19.5 ${20 - L}H4.5A2 2 0 0 1 2.5 ${18 - L}Z`
// three score cuts, a touch longer and bolder than the skeleton's so they hold at 16px
const CUTS = 'M6.5 14.25L8.75 10.25M10.88 13.75L13.13 9.75M15.25 14.25L17.5 10.25'
const CUT_W = 1.3                                                     // final units (2u on the grid)

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'food' })
  const id = n => `wg-dock-${NAME}-${n}`
  const url = n => `url(#${id(n)})`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)

  return [
    ['defs', {}, [
      lin(0, 12, 3, 12, 33, [stop(0, 'c1'), stop(1, 'shadow')]),
      ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
      lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.55)]),
      // 3 the glyph material: bright on top, the warm tint at the bottom
      lin(3, 12, fy(4.5), 12, fy(20), [stop(0, 'shine'), stop(1, 'tint')]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    // the loaf's soft shadow on the tile
    ['path', { d: M(LOAF, D.DROP), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    // the loaf: raised light material with its darker bottom lip
    ['path', { d: M(LOAF), fill: url(3), class: 'wm-k' }],
    ['path', { d: M(LOAF_LIP), fill: v('shadow'), 'fill-opacity': 0.22, class: 'wm-k' }],
    // the score cuts, in the deep shadow tone
    ['path', { d: M(CUTS), stroke: v('shadow'), 'stroke-width': CUT_W, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
}
