// forge/hand/coquette/clipboard.mjs — the clipboard without its corner bow (it crowded the clip): a blush board, a
// gold clip with a rose slot, cream paper with rose lines and one small ribbon-red heart closing a short last line (1.2u+ clear of it).
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([
    k.body(k.rr(4.4, 4.4, 19.6, 21.6, 2.4)),
    k.cream(k.rr(6.7, 7.9, 17.3, 19.5, 1)),
    k.gold(k.rr(8.2, 2.3, 15.8, 6.8, 1.5), { plate: 'A' }),
    k.fill(k.pill(10.2, 3.7, 13.8, 5), 'c2', { plate: 'A' }),
    k.fill(k.tube('M9.1 11.3 H14.9 M9.1 14.3 H14.9 M9.1 17.2 H10.9', 1.25), 'c2'),
    k.heart(14.7, 17.2, 3.6, 0),
  ])
}
