// forge/hand/coquette/package-open.mjs — the common isometric open box: cream flaps folded out and up, a rose diamond
// opening, blush front faces split by the centre edge, with one small red heart on the left face as the accent.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([[
    k.cream(k.poly([[4, 11], [2, 6.5], [10, 2.5], [12, 7]], 0.5), { plate: 'A', ow: 0.6 }),
    k.cream(k.poly([[12, 7], [14, 2.5], [22, 6.5], [20, 11]], 0.5), { plate: 'A', ow: 0.6 }),
    k.rose(k.poly([[4, 11], [12, 7], [20, 11], [12, 15]], 0.5), { plate: 'K', ow: 0.6 }),
    k.body(k.poly([[4, 11], [12, 15], [20, 11], [20, 17.5], [12, 21.5], [4, 17.5]], 0.5)),
    k.ink('M12 15 V21.3', 0.8),
    k.heart(8, 16.6, 3.2, 0, { plate: 'K' }),
  ]].flat(Infinity).filter(Boolean))
}
