// forge/hand/coquette/chopsticks.mjs — a blush rice bowl with a rose rim and a red heart on its front, and two
// tapered rose lacquer chopsticks held clear above the rim; the generated drawing tied a bow over the bowl and drew
// hairline gold sticks that vanished at 16px.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([[
    k.rose(k.union(
      k.poly([[15.75, 1.25], [17.25, 2.75], [7.92, 11.42], [7.08, 10.58]], 0.45),
      k.poly([[20.75, 2.15], [22.25, 3.65], [14.92, 10.92], [14.08, 10.08]], 0.45),
    ), { plate: 'A', ow: 0.5 }),
    k.body(k.path('M3 14 H21 C21 17.25 18.5 19.5 15 20 L15.5 21.5 H8.5 L9 20 C5.5 19.5 3 17.25 3 14 Z')),
    k.rose(k.pill(2.4, 13, 21.6, 15.2), { plate: 'K', ow: 0.55 }),
    k.heart(12, 17.4, 3.6, 0),
  ]].flat(Infinity).filter(Boolean))
}
