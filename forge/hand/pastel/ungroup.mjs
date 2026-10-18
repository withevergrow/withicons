// forge/hand/pastel/ungroup.mjs — the pastel ungroup: two soft sheets (lavender and sky) pulled apart to opposite
// corners inside the corner brackets of their old group frame, with a short split mark through the gap, so the
// pair reads as "group broken open" at 16px rather than a generic copy/layers pair.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

const INK = 'var(--with-pastel-ink, #6B5A8E)'
const line = (d) => ['path', { d, fill: 'none', stroke: INK, 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-deco' }]

export default function render(icon) {
  const { rr } = Prim
  const body = compose([
    ['lavender@K', rr(4.25, 4.25, 12.5, 11.25, 2.5)],
    ['sky@A', rr(11.5, 12.75, 19.75, 19.75, 2.5)],
  ], icon)
  return [
    ...body,
    line('M1.5 5V2.75A1.25 1.25 0 0 1 2.75 1.5H5'),
    line('M19 1.5H21.25A1.25 1.25 0 0 1 22.5 2.75V5'),
    line('M22.5 19V21.25A1.25 1.25 0 0 1 21.25 22.5H19'),
    line('M5 22.5H2.75A1.25 1.25 0 0 1 1.5 21.25V19'),
    line('M15 7.5L17.5 5M6.5 17.5L9 15'),
  ]
}
