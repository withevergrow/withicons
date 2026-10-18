// forge/hand/dock/snow-globe.mjs — a lit glass dome with a fir tree in the tile colour standing on a white snow bank,
// a few falling flakes, seated on a warm gold base drawn in front of the dome's lower edge. The generated glyph was a thick
// light ring around a tiny knocked-out tree that read as a pin or keyhole at 16-24px. Drawn on the 24 grid, placed with
// the house glyph scale, tile, drop shadow and bottom lips.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'snow-globe'
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

// the drawing, on the 24 grid (the skeleton's globe: dome, snow bank, fir tree, base)
const GX = 12, GY = 9.75, GR = 7.75
const DOME = `M${GX - GR} ${GY}A${GR} ${GR} 0 1 1 ${GX + GR} ${GY}A${GR} ${GR} 0 1 1 ${GX - GR} ${GY}Z`
// the snow bank: a low mound across the dome's floor, following the glass below
const BANK = 'M5.96 14.6Q12 12.1 18.04 14.6A7.75 7.75 0 0 1 5.96 14.6Z'
// the fir: two tiers and a short trunk planted in the bank
const TREE = 'M12 4.75L14.75 8.4H13.5L15.75 11.75H8.25L10.5 8.4H9.25Z'
const TRUNK = 'M11.2 11.5H12.8V13.6H11.2Z'
// the base: a gold trapezoid in front of the dome's lower edge, with its darker foot lip
const BASE = 'M7.5 16.75H16.5L17.9 20.1A1 1 0 0 1 17 21.5H7A1 1 0 0 1 6.1 20.1Z'
const BASE_LIP = 'M6.02 20.4A1 1 0 0 0 7 21.5H17A1 1 0 0 0 17.98 20.4Q17.7 20.85 17 20.85H7Q6.3 20.85 6.02 20.4Z'
const BASE_TOP = 'M7.5 16.75H16.5L16.85 17.55H7.15Z'
const GLINT = 'M6.6 8.25A5.6 5.6 0 0 1 9.4 4.6'
const FLAKES = [[7.9, 6.9, 0.55], [16.6, 6.4, 0.5], [17.2, 10.4, 0.55], [6.9, 11, 0.5], [15.9, 13.1, 0.4]]

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'christmas' })
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
      // 3 the glass: brightest up and to the left, the tint toward its rim
      ['radialGradient', { id: id(3), cx: fx(9.5), cy: fy(6.5), r: r2(GR * S * 1.6), gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine'), stop(0.4, 'shine'), stop(1, 'tint')]],
      // 4 the glass deepens into a c1 glow toward its floor, so the white bank stands out
      lin(4, 12, fy(6), 12, fy(17.5), [stop(0, 'c1', 0), stop(0.45, 'c1', 0.12), stop(1, 'c1', 0.55)]),
      // 5 the tree: the tile colour deepening to its shadow
      lin(5, 12, fy(4.75), 12, fy(13.6), [stop(0, 'c1'), stop(1, 'shadow')]),
      // 6 the base: lit from above
      lin(6, 12, fy(16.75), 12, fy(21.5), [stop(0, 'shine', 0.4), stop(1, 'shine', 0)]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    // one soft shadow of the whole object on the tile
    ['path', { d: M(DOME, D.DROP) + M(BASE, D.DROP), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    // the glass dome, lit, deepening toward its floor, with a reflection arc
    ['path', { d: M(DOME), fill: url(3), class: 'wm-k' }],
    ['path', { d: M(DOME), fill: url(4), class: 'wm-k' }],
    ['path', { d: M(GLINT), stroke: v('c1'), 'stroke-opacity': 0.45, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // the snow bank
    ['path', { d: M(BANK), fill: v('shine'), class: 'wm-k' }],
    // the fir tree on its trunk
    ['path', { d: M(TRUNK), fill: v('shadow'), class: 'wm-a' }],
    ['path', { d: M(TREE), fill: url(5), stroke: url(5), 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-a' }],
    // falling snow
    ...FLAKES.map(([x, y, r]) => ['circle', { cx: fx(x), cy: fy(y), r: r2(r * S), fill: v('c1'), 'fill-opacity': 0.8, class: 'wm-deco' }]),
    // the gold base in front of the dome, its shaded top under the glass and its darker foot lip
    ['path', { d: M(BASE), fill: v('c2'), class: 'wm-k' }],
    ['path', { d: M(BASE), fill: url(6), class: 'wm-shine' }],
    ['path', { d: M(BASE_TOP), fill: v('shadow'), 'fill-opacity': 0.25, class: 'wm-k' }],
    ['path', { d: M(BASE_LIP), fill: v('shadow'), 'fill-opacity': 0.3, class: 'wm-k' }],
  ]
}
