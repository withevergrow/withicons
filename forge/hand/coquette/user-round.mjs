// forge/hand/coquette/user-round.mjs — the people build on round shoulders: a blush dome with a pearl necklace, a blush
// head clear of it, a small hair bow; the generated drawing crowned the head with an oversized bow and pressed the head
// onto a flat mound, so head and shoulders ran together at 16px.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([[
    k.body(k.path('M4 21 A8 6.6 0 0 1 20 21 Z')),
    k.pearls('M8.3 16.1 Q12 19.4 15.7 16.1', 0.78),
    k.body(k.disc(12, 7.5, 4.2)),
    k.bow(15.5, 4, 0.58, 22),
  ]].flat(Infinity).filter(Boolean))
}
