// A clock running fast: the minute hand sweeps a steady turn, and each time it passes twelve the hour hand clicks
// on by one hour with a tiny spring. Twelve minute turns make one hour turn, so the loop is seamless.
import { circle, line, solid, stroke, merge, spin, E } from './_kit.mjs'

const HOURS = 12
const NAME = 'wl-clock'   // a part name no style has a hand-drawn 'clock' sprite for (those ignore the geometry)
// the hour hand rests, then springs on by 30 degrees as the minute hand reaches twelve
const hourKeys = () => {
  const ks = []
  for (let k = 0; k < HOURS; k++) {
    const a = k / HOURS, w = 1 / HOURS
    ks.push([a, { r: k * 30 }], [a + w * 0.78, { r: k * 30, e: E.spring }])
  }
  ks.push([1, { r: 360 }])
  return ks.map(([t, k]) => [Math.round(t * 10000) / 10000, k])
}
export default {
  name: 'clock', title: 'Clock', group: 'common',
  description: 'A clock in fast-forward: the minute hand sweeps round and the hour hand clicks on an hour each turn.',
  intent: 'time is passing, it will not be long',
  aliases: ['clock-loader', 'time-lapse-clock', 'clock-spinner', 'ticking-clock', 'wait-clock'],
  tags: ['loading', 'clock', 'time', 'wait'], synonyms: ['loading', 'please wait', 'time', 'pending', 'hourglass'],
  duration: 8,
  parts: [
    // face, the twelve o'clock tick and the hub (under the hands, so ornament styles never cover them)
    { name: NAME, skel: merge(stroke(circle(12, 12, 9)), stroke(line(12, 3, 12, 5.25), 'A'), solid(circle(12, 12, 1.15))) },
    // hour hand: short, clicks forward once per minute turn
    { name: NAME, skel: stroke(line(12, 12, 12, 8.25)), motion: { origin: [12, 12], keys: hourKeys() } },
    // minute hand: long, steady sweep, twelve turns per cycle
    { name: NAME, skel: stroke(line(12, 12, 12, 6), 'A'), motion: { origin: [12, 12], keys: spin(), rep: HOURS } },
  ],
}
