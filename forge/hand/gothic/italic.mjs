// forge/hand/gothic/italic.mjs — a bare slanted capital I in gilded metal, a thread of sapphire enamel down
// the stem and along both serifs (A), no frame; the generated drawing set the letter inside a framed glass card
// and read as a button rather than italic type.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const stem = g.poly([[13.3, 3.6], [16.7, 3.6], [10.7, 20.4], [7.3, 20.4]])
  const serifs = g.union(g.rr(10.8, 2.8, 19.4, 5.2, 0.6), g.rr(4.6, 18.8, 13.2, 21.2, 0.6))
  const parts = [
    g.gilt(stem),
    g.glass(g.seg(14.55, 5.2, 9.45, 18.8, 1.1), 'c2', { outline: 0.2, glint: false, glow: 0.32 }),
    g.gilt(serifs, { plate: 'A' }),
    g.glass(g.union(g.seg(12.2, 4, 18, 4, 1.05), g.seg(6, 20, 11.8, 20, 1.05)), 'c2', { outline: 0.2, glint: false, glow: 0.32, plate: 'A' }),
  ]
  return paint(enamel(parts, icon))
}
