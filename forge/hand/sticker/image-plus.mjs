// forge/hand/sticker/image-plus.mjs — a whole lilac photo with a mint hill and a lemon sun, and a bigger sky plus
// badge with a bolder plus, stuck on the corner with its own paper rim; replaces the generated drawing, whose frame
// was notched around a small badge with a thin plus that blurred at 16px and whose sun was only an ink ring.
import { build } from '../../styles/_sticker-core.mjs'
import { VAR, EDGE, INK } from '../../styles/_sticker-tune.mjs'

const S = 0.84, OX = -0.25, OY = -0.35
const f = v => +v.toFixed(2)
const P = (x, y) => `${f(12 + (x - 12) * S + OX)} ${f(12 + (y - 12) * S + OY)}`
const r_ = r => f(r * S)
const ring = (x, y, r) => `M${P(x + r, y)}A${r_(r)} ${r_(r)} 0 1 1 ${P(x - r, y)}A${r_(r)} ${r_(r)} 0 1 1 ${P(x + r, y)}Z`

const FRAME = `M${P(4, 4)}H${P(20, 4).split(' ')[0]}A${r_(2)} ${r_(2)} 0 0 1 ${P(22, 6)}V${P(22, 18).split(' ')[1]}`
  + `A${r_(2)} ${r_(2)} 0 0 1 ${P(20, 20)}H${P(4, 20).split(' ')[0]}A${r_(2)} ${r_(2)} 0 0 1 ${P(2, 18)}`
  + `V${P(2, 6).split(' ')[1]}A${r_(2)} ${r_(2)} 0 0 1 ${P(4, 4)}Z`
const HILL = `M${P(2, 16.5)}L${P(7, 11.5)}A${r_(1.41)} ${r_(1.41)} 0 0 1 ${P(9, 11.5)}L${P(16, 18.5)}V${P(16, 20).split(' ')[1]}`
  + `H${P(4, 20).split(' ')[0]}A${r_(2)} ${r_(2)} 0 0 1 ${P(2, 18)}Z`
const RIDGE = `M${P(2, 16.5)}L${P(7, 11.5)}A${r_(1.41)} ${r_(1.41)} 0 0 1 ${P(9, 11.5)}L${P(14, 16.5)}`
const BX = 17.5, BY = 17.25, BR = 4, ARM = 2

export default function render(icon) {
  const gen = build(icon)
  const shadow = gen.find(n => n[1].class === 'wm-shadow')
  const edge = gen.find(n => n[1].fill === EDGE && !n[1].class)
  const shine = gen.find(n => n[1].class === 'wm-shine')
  const decos = gen.filter(n => n[1].class === 'wm-deco')
  const out = [shadow, edge]
  out.push(['path', { d: FRAME, fill: VAR('grape') }])
  out.push(['path', { d: HILL, fill: VAR('mint'), class: 'wm-a' }])
  out.push(['path', { d: ring(12.75, 8.75, 1.6), fill: VAR('lemon'), class: 'wm-a' }])
  out.push(['path', { d: FRAME, stroke: INK, 'stroke-width': 1.5 }])
  out.push(['path', { d: RIDGE + ring(12.75, 8.75, 1.6), stroke: INK, 'stroke-width': 1.5, class: 'wm-a' }])
  if (shine) out.push(shine)
  // the plus badge: paper rim, sky disc, bold ink plus
  out.push(['path', { d: ring(BX, BY, BR), fill: EDGE, stroke: EDGE, 'stroke-width': 3, class: 'wm-s' }])
  out.push(['path', { d: ring(BX, BY, BR), fill: VAR('sky'), stroke: INK, 'stroke-width': 1.5, class: 'wm-s' }])
  out.push(['path', { d: `M${P(BX, BY - ARM)}V${P(BX, BY + ARM).split(' ')[1]}M${P(BX - ARM, BY)}H${P(BX + ARM, BY).split(' ')[0]}`, stroke: INK, 'stroke-width': 1.7, class: 'wm-s' }])
  out.push(...decos)
  return out.filter(Boolean)
}
