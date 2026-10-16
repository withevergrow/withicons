// A battery charging: a bolt pulses in the empty battery, then zaps itself into it, and the charge runs in as four
// cells pop on, left to right. Full, the battery crouches and hops for joy; the cells drain and the bolt is back.
import { rr, line, stroke, merge, E } from './_kit.mjs'
import { bolt } from './_creative-b.mjs'

const BODY = rr(2, 7, 19.25, 17, 2.4)
const HOLLOW = rr(3.6, 8.6, 17.65, 15.4, 1)
const battery = merge({ paths: [{ d: BODY, plate: 'K' }], fills: [BODY], cutouts: [HOLLOW] }, stroke(line(21.6, 10.5, 21.6, 13.5), 'A'))
// four cells: a bar (line styles draw its centreline, filled styles its block), evenly across the hollow
const CELL_X = [5.8, 9, 12.2, 15.4], CY0 = 10.75, CY1 = 13.25
const cell = x => ({ paths: [{ d: line(x, CY0, x, CY1), plate: 'A' }], fills: [rr(x - 1.1, CY0 - 0.85, x + 1.1, CY1 + 0.85, 0.6)], cutouts: [] })
const BOLT = [10.625, 12]
// the happy hop when full, shared by every part (y only): crouch, jump, land, a little rebound
const HOP = [[0.6, { y: 0, e: E.out }], [0.64, { y: 0.55, e: E.lift }], [0.7, { y: -2.1, e: E.gravity }], [0.755, { y: 0, e: E.out }],
  [0.785, { y: -0.45, e: E.gravity }], [0.815, { y: 0 }]]
const LIT = [0.3, 0.37, 0.44, 0.51]                      // the charge runs in, left to right
function cellKeys(i) {
  const off = { sx: 0.4, sy: 0.4, o: 0, y: 0 }
  const out = 0.85 + (3 - i) * 0.022                     // drains right to left
  return [
    [0, { ...off }], [LIT[i], { ...off, e: E.spring }], [LIT[i] + 0.06, { sx: 1, sy: 1, o: 1 }],
    ...HOP,
    [out, { y: 0, sx: 1, sy: 1, o: 1, e: E.in }], [out + 0.045, { ...off }], [1, { ...off }],
  ]
}
// the bolt pulses twice, swells, then zaps into the battery (spinning down to nothing); it springs back at the end
const boltKeys = [
  [0, { s: 1, o: 1, r: 0, e: E.ease }], [0.07, { s: 1.12, e: E.ease }], [0.14, { s: 0.94, e: E.ease }], [0.21, { s: 1.14, e: E.ease }],
  [0.25, { s: 1.22, e: E.expoIn }], [0.3, { s: 0.05, o: 0, r: 180 }],
  [0.93, { s: 0.2, o: 0, r: -90, e: E.spring }], [1, { s: 1, o: 1, r: 0 }],
]
export default {
  name: 'battery-charge', title: 'Battery charge', group: 'creative',
  description: 'A bolt pulses, zaps into an empty battery and four cells pop on; when full it hops for joy, then drains.',
  intent: 'charging up, powering on, filling to full',
  aliases: ['charging-battery', 'battery-filling', 'power-up-loader', 'battery-level-loader', 'charging-indicator'],
  tags: ['loading', 'battery', 'charging', 'power', 'energy'],
  synonyms: ['charging', 'powering up', 'energy', 'filling', 'recharge', 'power'],
  duration: 3.6,
  parts: [
    { skel: battery, motion: { origin: [12, 17], keys: [[0, { y: 0 }], ...HOP, [1, { y: 0 }]] } },
    ...CELL_X.map((x, i) => ({ skel: cell(x), motion: { origin: [x, CY1 + 0.85], keys: cellKeys(i) } })),
    { skel: { paths: [{ d: bolt(BOLT[0], BOLT[1], 7.2), plate: 'S' }], fills: [bolt(BOLT[0], BOLT[1], 7.2)], cutouts: [] }, motion: { origin: BOLT, keys: boltKeys } },
  ],
}
