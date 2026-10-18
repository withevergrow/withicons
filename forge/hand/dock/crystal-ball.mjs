// forge/hand/dock/crystal-ball.mjs — a softly lit glass orb with a misty c1 glow in its lower part and a field of
// sparkles (a long thin-waisted star up and left, a companion up right, a tiny one low right), seated INSIDE a warm cradle:
// a cup lip drawn in front of the orb's lower edge, a short neck and a wide foot. The earlier opaque orb with one centred
// sparkle on a detached wedge read as a webcam at 16-24px. Drawn on the 24 grid, placed with the house scale, tile and lips.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'crystal-ball'
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

// the drawing, on the 24 grid
const OX = 12, OY = 9.25, OR = 7                                   // the orb
const ORB = `M${OX - OR} ${OY}A${OR} ${OR} 0 1 1 ${OX + OR} ${OY}A${OR} ${OR} 0 1 1 ${OX - OR} ${OY}Z`
// the cradle: a cupped lip drawn IN FRONT of the orb (it overlaps the orb's lower edge ~1.2u, so the orb sits inside it)
const CUP = 'M7.3 14.5Q12 15.7 16.7 14.5C16.75 16.45 14.75 17.45 12 17.45C9.25 17.45 7.25 16.45 7.3 14.5Z'
const CUP_LIP = 'M7.55 15.85C8.3 16.95 9.9 17.45 12 17.45C14.1 17.45 15.7 16.95 16.45 15.85C15.5 16.6 14 16.95 12 16.95C10 16.95 8.5 16.6 7.55 15.85Z'
// below it a short narrow neck and a wide foot (two tiers)
const STAND = 'M9.6 17H14.4L15.4 19.4H16.6Q17.65 19.4 18.1 20.35L18.45 21Q18.65 21.5 18 21.5H6Q5.35 21.5 5.55 21L5.9 20.35Q6.35 19.4 7.4 19.4H8.6Z'
const NECK_SHADE = 'M9.6 17H14.4L14.75 17.85H9.25Z'
const STAND_LIP = 'M5.5 20.85Q5.35 21.5 6 21.5H18Q18.65 21.5 18.5 20.85Q18.35 20.98 17.95 20.98H6.05Q5.65 20.98 5.5 20.85Z'
// the vision: a long, thin-waisted four-point sparkle up and left of centre, a companion up right, a tiny one low right
const STAR = 'M11.25 5C11.45 7.95 11.6 8.32 14.75 8.5C11.6 8.68 11.45 9.05 11.25 12C11.05 9.05 10.9 8.68 7.75 8.5C10.9 8.32 11.05 7.95 11.25 5Z'
const SPARK = 'M15.4 4.25C15.56 5.2 15.7 5.34 16.65 5.5C15.7 5.66 15.56 5.8 15.4 6.75C15.24 5.8 15.1 5.66 14.15 5.5C15.1 5.34 15.24 5.2 15.4 4.25Z'
const SPARK2 = 'M15.1 11.35C15.22 12.05 15.33 12.16 16.05 12.3C15.33 12.44 15.22 12.55 15.1 13.25C14.98 12.55 14.87 12.44 14.15 12.3C14.87 12.16 14.98 12.05 15.1 11.35Z'
const GLINT = 'M7.45 7.75A4.85 4.85 0 0 1 10 4.85'

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'halloween' })
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
      // 3 the orb: lit glass, brightest up and to the left, a tint toward its rim
      ['radialGradient', { id: id(3), cx: fx(9.75), cy: fy(6.5), r: r2(OR * S * 1.55), gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine'), stop(0.4, 'shine'), stop(1, 'tint')]],
      // 4 the sparkles: the tile colour deepening to its shadow, gems inside the glass
      lin(4, 12, fy(5), 12, fy(12), [stop(0, 'c1'), stop(1, 'shadow')]),
      // 5 the cup's lit rim
      lin(5, 12, fy(14.5), 12, fy(17.45), [stop(0, 'shine', 0.65), stop(0.45, 'shine', 0.12), stop(1, 'shine', 0)]),
      // 6 the orb's misty interior: its lower 40% deepens into a c1 glow
      ['radialGradient', { id: id(6), cx: fx(12), cy: fy(5), r: r2(11.5 * S), gradientUnits: 'userSpaceOnUse' }, [stop(0, 'c1', 0), stop(0.5, 'c1', 0), stop(1, 'c1', 0.5)]],
      // 7 the neck and foot: lit from above
      lin(7, 12, fy(17), 12, fy(21.5), [stop(0, 'shine', 0.3), stop(1, 'shine', 0)]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: v('shadow'), 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    // one soft shadow of the whole object on the tile
    ['path', { d: M(ORB, D.DROP) + M(STAND, D.DROP) + M(CUP, D.DROP), fill: v('shadow'), 'fill-opacity': 0.4, stroke: v('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    // the neck and foot: the warm second material, a darker foot lip, shaded under the cup
    ['path', { d: M(STAND), fill: v('c2'), class: 'wm-a' }],
    ['path', { d: M(STAND), fill: url(7), class: 'wm-shine' }],
    ['path', { d: M(NECK_SHADE), fill: v('shadow'), 'fill-opacity': 0.35, class: 'wm-a' }],
    ['path', { d: M(STAND_LIP), fill: v('shadow'), 'fill-opacity': 0.3, class: 'wm-a' }],
    // the orb: glass with a misty, deepening interior and a reflection arc
    ['path', { d: M(ORB), fill: url(3), class: 'wm-k' }],
    ['path', { d: M(ORB), fill: url(6), class: 'wm-k' }],
    ['path', { d: M(GLINT), stroke: v('c1'), 'stroke-opacity': 0.5, 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // the vision: a field of sparkles
    ['path', { d: M(STAR), fill: url(4), class: 'wm-s' }],
    ['path', { d: M(SPARK), fill: v('c1'), class: 'wm-deco' }],
    ['path', { d: M(SPARK2), fill: v('c1'), 'fill-opacity': 0.85, class: 'wm-deco' }],
    // the cradle's cup lip, in front of the orb, with its lit rim and a darker underside
    ['path', { d: M(CUP), fill: v('c2'), class: 'wm-a' }],
    ['path', { d: M(CUP), fill: url(5), class: 'wm-shine' }],
    ['path', { d: M(CUP_LIP), fill: v('shadow'), 'fill-opacity': 0.3, class: 'wm-a' }],
  ]
}
