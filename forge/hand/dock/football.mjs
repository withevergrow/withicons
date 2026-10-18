// forge/hand/dock/football.mjs — a lit white ball with one bold central pentagon and five edge patches in the tile
// colour, joined by fine seams: the classic soccer-ball read. The generated glyph knocked a web of thin orange seams
// through the light disc, so its many white panels read as a flower, star or gear at 16-24px. Drawn on the 24 grid,
// placed with the house glyph scale, tile, drop shadow and bottom lip.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'football'
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

// the drawing, on the 24 grid (the skeleton's ball, its pentagon a touch larger so it holds at 16px)
const R = 9.5
const BALL = `M${12 - R} 12A${R} ${R} 0 1 1 ${12 + R} 12A${R} ${R} 0 1 1 ${12 - R} 12Z`
const L = D.LIP / S
const BALL_LIP = `M${12 - R} 12A${R} ${R} 0 0 0 ${12 + R} 12A${R} ${R - L} 0 0 1 ${12 - R} 12Z`
const pent = (r, a0 = -90) => Array.from({ length: 5 }, (_, k) => {
  const a = (a0 + 72 * k) * Math.PI / 180
  return [12 + r * Math.cos(a), 12 + r * Math.sin(a)]
})
const P = pent(3.9)                  // central pentagon
const Q = pent(6.9)                  // where each seam meets an edge patch
const PENT = 'M' + P.map(p => p.map(r2).join(' ')).join('L') + 'Z'
const SEAMS = P.map((p, k) => `M${r2(p[0])} ${r2(p[1])}L${r2(Q[k][0])} ${r2(Q[k][1])}`).join('')
// five edge patches: each a pentagon centred near the rim, cut by a circle just inside it
const RI = 8.55                      // the patches stop short of the rim: a white band keeps the ball's outline
const polar = (r, deg) => { const a = deg * Math.PI / 180; return `${r2(12 + r * Math.cos(a))} ${r2(12 + r * Math.sin(a))}` }
const EDGE = [-90, -18, 54, 126, 198].map(a =>
  `M${polar(RI, a - 24)}L${polar(8, a - 17)}L${polar(6.9, a)}L${polar(8, a + 17)}L${polar(RI, a + 24)}A${RI} ${RI} 0 0 0 ${polar(RI, a - 24)}Z`).join('')

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'sports' })
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
      // 3 the ball: lit up and to the left, the warm tint toward its far side
      ['radialGradient', { id: id(3), cx: fx(9), cy: fy(7.5), r: r2(R * S * 1.6), gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine'), stop(0.45, 'shine'), stop(1, 'tint')]],
      // 4 the patches: the tile colour deepening to its shadow
      lin(4, 12, fy(2.5), 12, fy(21.5), [stop(0, 'c1'), stop(1, 'shadow')]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    // the ball's soft shadow on the tile
    ['path', { d: M(BALL, D.DROP), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, class: 'wm-shadow' }],
    // the ball: raised light material
    ['path', { d: M(BALL), fill: url(3), class: 'wm-k' }],
    // the seams, then the patches over them
    ['path', { d: M(SEAMS), stroke: v('shadow'), 'stroke-opacity': 0.55, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: M(EDGE), fill: url(4), class: 'wm-a' }],
    ['path', { d: M(PENT), fill: url(4), stroke: url(4), 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }],
    // the darker bottom lip, over the lower patches too
    ['path', { d: M(BALL_LIP), fill: v('shadow'), 'fill-opacity': 0.22, class: 'wm-k' }],
  ]
}
