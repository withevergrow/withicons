// Lunar New Year: a red lantern sways from its hook like a pendulum, and its tassel swings a beat behind it,
// flicking further at each turn (overlap). The tassel's keys pin its knot to the lantern's base at every moment.
// The lantern is shown at 0.9 by the motion (not by editing its drawing), so hand-drawn styles size it the same.
import { stroke, solid, merge, rr, E } from './_kit.mjs'
import { pick, sampled } from './_festival.mjs'

const HOOK = [12, 2.5]                 // the pendulum's pivot, at the lantern's cap
const KNOT = [12, 19]                  // where the tassel hangs from the lantern (as drawn)
const S = 0.9, A = 10                  // size on stage, swing in degrees
const swing = t => A * Math.cos(2 * Math.PI * t)
const tassel = sampled(t => {
  const a = swing(t) * Math.PI / 180, L = (KNOT[1] - HOOK[1]) * S
  // the knot rides the lantern's swing; the tassel trails it by a beat and swings wider
  return { x: HOOK[0] - L * Math.sin(a) - KNOT[0], y: HOOK[1] + L * Math.cos(a) - KNOT[1], r: 1.8 * A * Math.cos(2 * Math.PI * (t - 0.12)), s: S }
}, 24)
export default {
  name: 'lantern', title: 'Red lantern', group: 'festival',
  description: 'A red Lunar New Year lantern sways from its hook while its tassel swings a beat behind, flicking at each turn.',
  intent: 'a festive, unhurried sway: good fortune is on its way',
  aliases: ['lunar-new-year-loader', 'red-lantern-loader', 'chinese-new-year-loader', 'swinging-lantern', 'spring-festival-loader'],
  tags: ['loading', 'festival', 'lunar new year', 'lantern', 'swing'], synonyms: ['lunar new year', 'chinese new year', 'spring festival', 'tet', 'seollal', 'lantern', 'good luck'],
  duration: 2.6,
  morph: ['red-lantern'],
  parts: [
    // the tassel: a short cord and a tassel head (behind the lantern's base)
    { skel: merge(stroke('M12 19 V20.6', 'A'), solid(rr(11, 20.6, 13, 23.4, 1), 'A')), motion: { origin: KNOT, keys: tassel } },
    // the lantern: caps, body and ribs; a pendulum about the hook
    {
      skel: pick('red-lantern', [0, 1, 2, 3, 4], { fills: [0, 1, 2], cutouts: [0, 1] }),
      motion: { origin: HOOK, keys: [[0, { r: A, s: S, e: E.ease }], [0.5, { r: -A, s: S, e: E.ease }], [1, { r: A, s: S }]] },
    },
  ],
}
