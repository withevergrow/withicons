// A 3 x 3 grid of small, quiet squares; a wave of light runs through it corner to corner: each square springs up
// full and bright as the wave reaches its diagonal, then settles back small and pale.
import { rr, solid, E } from './_kit.mjs'

const STEP = 6.25, HALF = 2.1, C = 12 - STEP           // cell centres 5.75, 12, 18.25; squares 4.2 wide at full size
const LAG = 0.1                                        // lag per diagonal (i + j)
export default {
  name: 'grid-pulse', title: 'Grid pulse', group: 'common',
  description: 'A grid of nine small squares: a wave runs corner to corner, each square springing up bright, then settling back.',
  intent: 'lots of small pieces being processed in order',
  aliases: ['pulsing-grid', 'grid-wave', 'nine-squares-loader', 'tile-wave-loader'],
  tags: ['loading', 'grid', 'squares', 'wave'], synonyms: ['loading', 'processing', 'grid', 'tiles', 'blocks'],
  duration: 1.5,
  parts: [{
    skel: solid(rr(C - HALF, C - HALF, C + HALF, C + HALF, 1.25)),
    motion: {
      origin: [C, C],
      keys: [
        [0, { s: 0.55, o: 0.32, e: E.spring }],          // the wave arrives: spring up
        [0.2, { s: 1, o: 1, e: E.ease }],
        [0.56, { s: 0.55, o: 0.32 }],                    // and settle back while the wave moves on
        [1, { s: 0.55, o: 0.32 }],
      ],
    },
    copies: Array.from({ length: 9 }, (_, k) => {
      const i = k % 3, j = Math.floor(k / 3)
      return { x: i * STEP, y: j * STEP, lag: (i + j) * LAG }
    }),
  }],
}
