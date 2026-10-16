// Diwali: a clay oil lamp whose flame is alive. The flame sways about the wick and breathes taller and shorter on an
// uneven, candle-like rhythm (seamless), while tiny embers lift off beside it, drift and wink out.
import { dot, stroke, E } from './_kit.mjs'
import { pick } from './_festival.mjs'

const T = { s: 0.9, y: 0.9 }                    // the lamp, a little smaller, to leave air for the flame and embers
const WICK = [12, 11.3]                        // where the flame sits on the lamp (after T)
const EMBER = [12, 7.5]
export default {
  name: 'diya', title: 'Diya', group: 'festival',
  description: 'A Diwali oil lamp: the flame sways and breathes on an uneven candle rhythm while small embers rise and fade.',
  intent: 'a warm, living flame: festive patience',
  aliases: ['diwali-loader', 'oil-lamp-loader', 'deepavali-loader', 'diya-flame', 'lamp-flicker'],
  tags: ['loading', 'festival', 'diwali', 'flame', 'india'], synonyms: ['diwali', 'deepavali', 'diya', 'lamp', 'flame', 'festival of lights'],
  duration: 2.6,
  morph: ['diya'],
  parts: [
    // embers: a rounded stub drawn at half size, so every style shows a small glowing speck
    {
      skel: stroke(dot(EMBER[0], EMBER[1]), 'S'),
      motion: {
        origin: EMBER,
        keys: [[0, { x: 0, y: 1, o: 0, s: 0.3, e: E.out }], [0.12, { x: -0.3, y: 0, o: 1, s: 0.7, e: E.ease }], [0.42, { x: 0.7, y: -2.4, o: 0.95, s: 0.62, e: E.ease }],
          [0.7, { x: -0.5, y: -4, o: 0.45, s: 0.5, e: E.in }], [0.86, { x: 0.1, y: -4.8, o: 0, s: 0.3 }], [1, { x: 0, y: 1, o: 0, s: 0.3 }]],
      },
      copies: [{ x: -4, y: 0.5, lag: 0 }, { x: 4, y: -0.3, lag: 0.34 }, { x: -2.6, y: -1.4, lag: 0.62 }, { x: 2.9, y: 1, lag: 0.84 }],
    },
    // the lamp: the bowl and its rim line
    { skel: pick('diya', [0, 1], { fills: [0], cutouts: [0], t: T }) },
    // the flame: sways about the wick, stretches taller and slimmer, squats shorter and rounder, never in step
    {
      skel: pick('diya', [2], { fills: [1], cutouts: [1], t: T }),
      motion: {
        origin: WICK,
        keys: [
          [0, { r: 0, sx: 1, sy: 1, e: E.ease }],
          [0.12, { r: -12, sx: 0.88, sy: 1.15, e: E.ease }],
          [0.25, { r: 6, sx: 1.08, sy: 0.88, e: E.ease }],
          [0.36, { r: -3, sx: 0.96, sy: 1.05, e: E.ease }],
          [0.54, { r: 13, sx: 0.86, sy: 1.18, e: E.ease }],
          [0.68, { r: -7, sx: 1.1, sy: 0.86, e: E.ease }],
          [0.83, { r: 6, sx: 0.94, sy: 1.08, e: E.ease }],
          [1, { r: 0, sx: 1, sy: 1 }],
        ],
      },
    },
  ],
}
