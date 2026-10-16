// Halloween: a little ghost floats and sways, bobbing twice, then squashes down, shoots up and swells with a
// wiggle (BOO!) while four surprise marks flash round its head, and settles back to floating.
// The ghost is the whole library icon, sized by the motion rather than by editing its drawing, so every style, hand
// drawn ones included, shows its own ghost.
import { icon, stroke, E } from './_kit.mjs'
import { rays } from './_festival.mjs'

const S = 0.74                             // the ghost's size on stage
const P = [12, 16]                         // pivot low in the body: sways from the hips, squashes onto its hem
const g = (y, r, sx = S, sy = sx, e = E.ease) => ({ y, r, sx, sy, e })
const ghost = [
  [0, g(0, -3)], [0.14, g(-1.7, 4)], [0.28, g(0, -4)], [0.42, g(-1.5, 3)],
  [0.55, g(0.6, 0, S * 1.08, S * 0.86, E.out)],          // squash: about to jump
  [0.62, g(-1.6, 0, S * 0.94, S * 1.06, E.spring)],       // up and stretched
  [0.7, g(-1.2, -7, S * 1.08, S * 1.08, E.ease)],         // BOO: swells, wiggles
  [0.75, g(-1.2, 6, S * 1.07, S * 1.07, E.ease)],
  [0.8, g(-1.1, -3, S * 1.04, S * 1.04, E.ease)],
  [0.88, g(-0.6, 1, S, S, E.ease)],
  [1, g(0, -3)],
]
const HEAD = [12, 10.1]                    // the head's centre on the BOO; marks drawn 1/0.7 size, shown at 0.7
export default {
  name: 'ghost', title: 'Ghost', group: 'festival',
  description: 'A little ghost floats and sways, then squashes, jumps and swells with a wiggle (boo!) before floating on.',
  intent: 'spooky-cute Halloween waiting: boo, almost there',
  aliases: ['ghost-loader', 'halloween-loader', 'floating-ghost', 'boo-loader', 'spooky-loader'],
  tags: ['loading', 'festival', 'halloween', 'ghost', 'spooky'], synonyms: ['halloween', 'ghost', 'boo', 'spooky', 'haunted', 'peekaboo'],
  duration: 3.2,
  morph: ['ghost'],
  parts: [
    // surprise marks: four short strokes that burst out round the head on the BOO
    {
      skel: stroke([-80, -45, 45, 80].map(a => rays(HEAD[0], HEAD[1], 11.7, 13.4, 1, a)).join(' '), 'S'),
      motion: { origin: HEAD, keys: [[0, { s: 0.5, o: 0 }], [0.67, { s: 0.5, o: 0, e: E.expoOut }], [0.72, { s: 0.7, o: 1, y: -0.6, e: E.ease }], [0.84, { s: 0.74, o: 0, y: -0.8 }], [1, { s: 0.5, o: 0 }]] },
    },
    { skel: icon('ghost'), motion: { origin: P, keys: ghost } },
  ],
}
