// Eid and Ramadan: a crescent moon rocks gently like a cradle while three stars in its curve twinkle in turn, each
// swelling with a little twist and settling back to a soft glow.
// The moon is the whole library icon, sized and placed by the motion, so every style draws its own moon.
import { icon, solid, star, E } from './_kit.mjs'

const S = 0.74, M = [12, 12], AT = [-1.6, 1.3]       // the moon: size, its middle (as drawn), where it sits on stage
const m = (r, e = E.ease) => ({ x: AT[0], y: AT[1], s: S, r, e })
const ST = [16.2, 6.4]                                // a star as drawn (copies place it), drawn 1/0.6 size
const STARS = [[0, 0, 0], [4.1, 4.9, 0.33], [-3.9, -3.2, 0.66]]
export default {
  name: 'crescent', title: 'Crescent moon', group: 'festival',
  description: 'A crescent moon rocks gently like a cradle while three stars in its curve twinkle one after another.',
  intent: 'a calm, blessed night: peaceful patience for Eid and Ramadan',
  aliases: ['eid-loader', 'ramadan-loader', 'crescent-moon-loader', 'moon-and-stars', 'eid-mubarak-loader'],
  tags: ['loading', 'festival', 'eid', 'ramadan', 'moon'], synonyms: ['eid', 'ramadan', 'ramadan kareem', 'eid mubarak', 'crescent', 'moon', 'stars', 'night'],
  duration: 3,
  morph: ['moon'],
  parts: [
    // stars, twinkling in turn
    {
      skel: solid(star(ST[0], ST[1], 3.4, 0.46), 'A'),
      motion: { origin: ST, keys: [[0, { s: 0.36, o: 0.45, r: 0, e: E.spring }], [0.12, { s: 0.68, o: 1, r: 18, e: E.ease }], [0.42, { s: 0.36, o: 0.45, r: 0 }], [1, { s: 0.36, o: 0.45, r: 0 }]] },
      copies: STARS.map(([x, y, lag]) => ({ x, y, lag })),
    },
    // the moon, rocking about its middle
    { skel: icon('moon'), motion: { origin: M, keys: [[0, m(-11)], [0.5, m(9)], [1, m(-11)]] } },
  ],
}
