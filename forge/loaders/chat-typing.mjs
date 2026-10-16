// Someone is typing: a speech bubble breathes ever so slightly while three dots inside it rise and settle in turn,
// lifting light and falling soft, a little ripple left to right.
import { circle, solid, E } from './_kit.mjs'

// a rounded bubble (3.5..20.5 x 4..17) with a tail at the lower left
const BUBBLE = 'M8 4 H16 A4.5 4.5 0 0 1 20.5 8.5 V12.5 A4.5 4.5 0 0 1 16 17 H11.5 L7.25 20.5 L8 17 A4.5 4.5 0 0 1 3.5 12.5 V8.5 A4.5 4.5 0 0 1 8 4 Z'
const DOT_Y = 10.75, GAP = 4.5, DOT = 0.7
export default {
  name: 'chat-typing', title: 'Typing', group: 'common',
  description: 'A speech bubble with three dots that rise and settle in turn, the bubble breathing gently: someone is typing.',
  intent: 'a reply is being written',
  aliases: ['typing-indicator', 'typing-bubble', 'chat-dots-loader', 'someone-is-typing', 'message-typing'],
  tags: ['loading', 'chat', 'typing', 'message'], synonyms: ['typing', 'writing', 'replying', 'thinking', 'chat'],
  duration: 1.4,
  parts: [
    {
      // outline only: the dots sit inside it and must read in filled styles too
      skel: { paths: [{ d: BUBBLE, plate: 'K' }], fills: [], cutouts: [] },
      motion: { origin: [12, 12], keys: [[0, { s: 1, e: E.ease }], [0.5, { s: 1.025, e: E.ease }], [1, { s: 1 }]] },
    },
    {
      skel: solid(circle(12 - GAP, DOT_Y, DOT), 'A'),
      motion: {
        origin: [12 - GAP, DOT_Y],
        keys: [
          [0, { y: 0, s: 1, o: 0.45, e: E.lift }],
          [0.2, { y: -1.75, s: 1.1, o: 1, e: E.gravity }],    // rises, brightening
          [0.4, { y: 0, s: 1, o: 0.45 }],                     // and settles
          [1, { y: 0, s: 1, o: 0.45 }],
        ],
      },
      copies: [0, 1, 2].map(i => ({ x: i * GAP, y: 0, lag: i * 0.15 })),
    },
  ],
}
