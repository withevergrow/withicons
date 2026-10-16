// A rounded card that flips over and over: across, then up, quarter-turning as it goes. Each flip falls edge-on,
// turns the card to its other face (a punched back) and snaps flat with a tiny overshoot; then a beat of rest.
import { rr, circle, solid, E } from './_kit.mjs'

const FLIPS = 4, W = 1 / FLIPS
const EDGE = 0.1, LAND = 0.19                         // fractions of the cycle: edge-on, flat again (then rest)
const FALL = 'cubic-bezier(.5,0,.85,.4)'              // flat -> edge-on, gathering speed
const SNAP = 'cubic-bezier(.2,.65,.35,1.18)'           // edge-on -> flat, a hair past flat and back
// flip k turns about the card's vertical axis (sx) on even flips, its horizontal axis (sy) on odd ones, a quarter
// turn each; the face swaps in the instant the card is edge-on, so the swap never shows
const r4 = t => Math.round(t * 10000) / 10000
const flipKeys = front => {
  const ks = []
  for (let k = 0; k < FLIPS; k++) {
    const a = k * W, ax = k % 2 ? 'sy' : 'sx'
    const before = (k % 2 === 0) === front ? 1 : 0, after = 1 - before
    const edge = { r: k * 90 + 45, sx: 1, sy: 1, [ax]: 0.02 }
    ks.push([a, { r: k * 90, sx: 1, sy: 1, o: before, e: FALL }], [a + EDGE, { ...edge, o: before }],
      [a + EDGE + 0.0002, { ...edge, o: after, e: SNAP }], [a + LAND, { r: k * 90 + 90, sx: 1, sy: 1, o: after }])
  }
  ks.push([1, { r: 360, sx: 1, sy: 1, o: front ? 1 : 0 }])
  return ks.map(([t, k]) => [r4(t), k])
}
const card = rr(6, 6, 18, 18, 3)
export default {
  name: 'square-flip', title: 'Flipping square', group: 'common',
  description: 'A rounded card flips over, across then up, a quarter turn each time, and snaps flat with a tiny overshoot.',
  intent: 'steady, crisp work: turning things over one by one',
  aliases: ['flip-square', 'flipping-card', 'card-flip-loader', 'square-flip-spinner'],
  tags: ['loading', 'square', 'flip', 'card'], synonyms: ['loading', 'processing', 'flip', 'card'],
  duration: 3.2,
  parts: [
    { skel: solid(card), motion: { origin: [12, 12], keys: flipKeys(true) } },
    { skel: { paths: [{ d: card, plate: 'A' }, { d: circle(12, 12, 2.25), plate: 'A' }], fills: [card], cutouts: [circle(12, 12, 2.25)] }, motion: { origin: [12, 12], keys: flipKeys(false) } },
  ],
}
