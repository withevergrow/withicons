// forge/hand/coquette/layout-dashboard.mjs — the new layout-dashboard skeleton: a tall blush hero tile with a heart,
// a small rose tile top-right, a tall blush tile bottom-right and a short rose bar bottom-left, so the unequal panels
// read apart from layout-grid; the generated drawing was the old bespoke layout that ignored the redesign.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([[
    k.body(k.rr(3, 3, 12, 13, 1.8)),
    k.body(k.rr(16, 11.5, 21, 21, 1.6)),
    k.rose(k.rr(16, 3, 21, 7.5, 1.5), { plate: 'K' }),
    k.rose(k.rr(3, 17, 12, 21, 1.5), { plate: 'K' }),
    k.heart(7.5, 8.2, 4, 0),
  ]].flat(Infinity).filter(Boolean))
}
