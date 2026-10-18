// forge/hand/coquette/cat.mjs — a blush kitten with tall rose-lined ears, almond ink eyes, a little heart nose with a
// cat's split mouth and fine whiskers reaching past the cheeks, and a bow on one ear; the generated face (a pink round
// head, a wide triangle nose, no whiskers) read as a piglet.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const HEAD = 'M12 20.5 C7 20.5 3.5 18 3.5 13.75 C3.5 11.75 3.9 10.25 4.5 9 V3.6 L9.5 6.5 C10.25 6.25 11.25 6 12 6 C12.75 6 13.75 6.25 14.5 6.5 L19.5 3.6 V9 C20.1 10.25 20.5 11.75 20.5 13.75 C20.5 18 17 20.5 12 20.5 Z'

export default function render() {
  return paint([[
    k.body(k.path(HEAD)),
    k.rose(k.union(k.poly([[5.9, 5.9], [5.9, 9.6], [8.6, 7.4]], 0.45), k.poly([[18.1, 5.9], [18.1, 9.6], [15.4, 7.4]], 0.45)), { plate: 'K', ow: 0 }),
    k.fill(k.union(k.ellipse(8.6, 12.4, 0.95, 1.35), k.ellipse(15.4, 12.4, 0.95, 1.35)), 'ink', { plate: 'A' }),
    k.ink('M8.2 15.4 L1.6 14.6 M8.2 16.6 L1.9 17.8 M15.8 15.4 L22.4 14.6 M15.8 16.6 L22.1 17.8', 0.75, { plate: 'A' }),
    k.ink('M12 16.2 V17.2 M10.6 17.5 Q11.3 18.2 12 17.2 Q12.7 18.2 13.4 17.5', 0.75, { plate: 'A' }),
    k.heart(12, 15.6, 2.6, 0, { plate: 'A', ow: 0.4 }),
    k.bow(17.9, 4.4, 0.55, 20),
  ]].flat(Infinity).filter(Boolean))
}
