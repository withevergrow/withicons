// forge/hand/coquette/user-circle.mjs — the new skeleton's avatar dressed as a portrait medallion: a cream disc in a rose
// frame, a blush bust cut by the frame and a blush head clear of it, a pearl necklace and a small hair bow; the generated
// drawing still showed the old low-headed bust that ran into the rim at 16px.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  const inner = k.disc(12, 12, 8.7)
  return paint([[
    k.cream(inner, { ow: 0 }),
    k.body(k.inter(k.path('M4.4 23 C4.4 18 7 15.6 9.6 15.6 H14.4 C17 15.6 19.6 18 19.6 23 Z'), inner), { ow: 0.55 }),
    k.pearls('M9.6 16.9 Q12 18.5 14.4 16.9', 0.6),
    k.body(k.disc(12, 9.1, 3.4)),
    k.rose(k.ring(12, 12, 9.25, 1.3)),
    k.bow(14.8, 6.3, 0.48, 22),
  ]].flat(Infinity).filter(Boolean))
}
