// Three dots hop in turn, ba-da-dum, then all rest a beat. Each hop is a little piece of physics: a crouch (squash),
// a launch that stretches the dot, a rise that slows to the apex, a fall that speeds up, a stretched contact, a squash
// on landing and a small spring back to round. Scale pivots on the dot's foot, so it squashes into the floor.
import { circle, solid, E } from './_kit.mjs'

const R = 1, H = 7, HOP = 0.62, LAG = 0.15, DY = 3   // dot radius, hop height, hop length, stagger, rest below centre (R is small so the line stroke closes it into a disc)
// keys of one hop, in hop time 0..1, scaled into the first HOP of the cycle
const hop = [
  [0, { y: 0, s: 1, e: E.ease }],
  [0.1, { y: 0, sx: 1.18, sy: 0.8, e: E.linear }],                // crouch
  [0.21, { y: -H * 0.54, sx: 0.88, sy: 1.14, e: E.lift }],         // launched, stretched
  [0.44, { y: -H, sx: 1, sy: 1, e: E.gravity }],                   // apex
  [0.67, { y: -H * 0.54, sx: 0.9, sy: 1.12, e: E.linear }],        // falling, stretched
  [0.78, { y: 0, sx: 0.94, sy: 1.08, e: E.out }],                  // contact
  [0.86, { y: 0, sx: 1.2, sy: 0.78, e: E.ease }],                  // squash
  [0.94, { y: 0, sx: 0.97, sy: 1.04, e: E.ease }],                 // spring back
  [1, { y: 0, sx: 1, sy: 1 }],
]
const keys = [...hop.map(([t, k]) => [Math.round(t * HOP * 10000) / 10000, k]), [1, { y: 0, sx: 1, sy: 1 }]]
export default {
  name: 'dots-bounce', title: 'Bouncing dots', group: 'common',
  description: 'Three dots hop in turn with a crouch, a stretch in the air and a squash on landing, then rest a beat together.',
  intent: 'cheerful, springy waiting: almost there',
  aliases: ['bouncing-dots', 'hopping-dots', 'jumping-dots', 'bounce-loader', 'three-dots-bounce'],
  tags: ['loading', 'dots', 'bounce', 'playful'], synonyms: ['loading', 'please wait', 'hold on', 'working', 'bouncy'],
  duration: 1.4,
  parts: [{
    // drawn on the centre, placed by copies (styles that centre what they draw still place it right)
    skel: solid(circle(12, 12, R)),
    motion: { origin: [12, 12 + R + 1], keys },
    copies: [-6, 0, 6].map((x, i) => ({ x, y: DY, lag: i * LAG })),
  }],
}
