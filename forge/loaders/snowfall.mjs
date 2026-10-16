// Snowfall: a big snowflake turns slowly in the middle while small flakes drift down past it, each swaying on the
// air and turning as it falls, fading in at the top and out at the bottom.
import { icon, stroke, E } from './_kit.mjs'
import { rays, sampled } from './_festival.mjs'

const F = [12, 11]                       // a small flake as drawn (copies place it); drawn twice size, shown at half
const flake = stroke(rays(F[0], F[1], 0, 2.6, 6), 'A')
const fall = sampled(u => ({
  x: 1.1 * Math.sin(u * Math.PI * 3),
  y: -9 + 18.5 * u,
  r: 140 * u,
  s: 0.5,
  o: u < 0.12 ? u / 0.12 : u > 0.85 ? Math.max(0, (1 - u) / 0.15) : 1,
}), 16)
const FLAKES = [[-8.2, 0, 0], [-4.5, 0, 0.5], [4.5, 0, 0.25], [8.2, 0, 0.75]]
export default {
  name: 'snowfall', title: 'Snowfall', group: 'festival',
  description: 'A big snowflake turns slowly while small flakes drift down past it, swaying and spinning as they fall.',
  intent: 'quiet winter calm: settle in, it is on its way',
  aliases: ['snow-loader', 'snowflake-loader', 'falling-snow', 'winter-loader', 'snowflake-spin'],
  tags: ['loading', 'festival', 'winter', 'christmas', 'snow'], synonyms: ['snow', 'snowflake', 'winter', 'christmas', 'cold', 'frost'],
  duration: 6,
  morph: ['snowflake'],
  parts: [
    // small flakes, behind the big one: fall twice per cycle, each on its own beat
    {
      skel: flake,
      motion: { origin: F, keys: fall, rep: 2 },
      copies: FLAKES.map(([x, y, lag]) => ({ x, y, lag })),
    },
    // the big flake: one slow turn per cycle
    { skel: icon('snowflake', { s: 0.76 }), motion: { origin: [12, 12], keys: [[0, { r: 0, e: E.linear }], [1, { r: 360 }]] } },
  ],
}
