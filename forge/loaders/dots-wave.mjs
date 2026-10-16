// Five dots ride a sine wave that travels left to right: each dot rises and falls on a smooth sine, a fifth of the
// way behind its neighbour, and swells and brightens on the crest, shrinks and dims in the trough, so the wave has
// depth as well as height.
import { circle, solid } from './_kit.mjs'
import { sampled } from './_common-a.mjs'

const R = 0.9, GAP = 4.1, AMP = 3, N = 5, LAG = 0.18
const keys = sampled(16, t => {
  const w = Math.sin(2 * Math.PI * t)
  return { y: -AMP * w, s: 0.92 + 0.16 * w, o: 0.72 + 0.28 * w }
})
export default {
  name: 'dots-wave', title: 'Dot wave', group: 'common',
  description: 'Five dots ride a travelling sine wave, swelling and brightening on the crest and dimming in the trough.',
  intent: 'a steady flow: data streaming, a signal coming through',
  aliases: ['wave-dots', 'sine-dots', 'flowing-dots', 'dot-wave-loader', 'wavy-dots'],
  tags: ['loading', 'dots', 'wave', 'flow'], synonyms: ['loading', 'streaming', 'flowing', 'signal', 'please wait'],
  duration: 1.3,
  parts: [{
    skel: solid(circle(12, 12, R)),
    motion: { origin: [12, 12], keys },
    copies: Array.from({ length: N }, (_, i) => ({ x: (i - (N - 1) / 2) * GAP, y: 0, lag: i * LAG })),
  }],
}
