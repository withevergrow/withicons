// A cozy cup with three wisps of steam. Each wisp curls up out of the cup, sways and turns as it rises (its S-curve
// mirrors through a twist), swells and thins away; the three overlap so there is always steam.
import { icon, stroke, E } from './_kit.mjs'
import { P, named } from './_creative-a.mjs'

// the library cup without its own (still) steam
// (untransformed, so styles that draw the cup from hand-tuned art line up; a few of those keep their own steam)
const CUP = (() => { const c = icon('coffee'); return { ...c, paths: c.paths.filter(p => !/^M\d+(\.\d+)? 6\.5 C/.test(p.d)) } })()
// a wisp: one long S curve 4.6 tall, base at (x, y)
const wisp = (x, y) => `M${P(x, y)} C${P(x - 1.7, y - 1.1)} ${P(x + 1.7, y - 3.1)} ${P(x, y - 4.6)}`
const BASE = 9.2
const rise = (dx) => [
  [0, { x: 0, y: 0.8, sx: 0.7, sy: 0.75, o: 0, e: E.out }],
  [0.22, { x: dx * 0.5, y: -0.6, sx: 1, sy: 0.95, o: 0.95, e: E.ease }],
  [0.5, { x: dx, y: -1.9, sx: -0.35, sy: 1.05, o: 0.85, e: E.ease }],
  [0.78, { x: dx * 0.2, y: -2.3, sx: -1, sy: 1.1, o: 0.4, e: E.ease }],
  [1, { x: -dx * 0.4, y: -2.8, sx: -0.6, sy: 1.14, o: 0 }],
]
const W = [[6.6, 0.55], [9.75, -0.5], [12.9, 0.45]]
export default {
  name: 'coffee', title: 'Coffee', group: 'creative',
  description: 'A cozy cup of coffee: three steam wisps curl up, sway, twist and thin away in turn.',
  intent: 'brewing: sit back, it is nearly ready',
  aliases: ['coffee-loader', 'steaming-cup', 'brewing-loader', 'hot-drink-loader', 'coffee-break-loader'],
  tags: ['loading', 'coffee', 'cozy', 'steam', 'break'],
  synonyms: ['brewing', 'coffee break', 'hang tight', 'cozy', 'hot drink', 'tea'],
  duration: 3,
  morph: ['coffee'],
  parts: [
    ...W.map(([x, dx], i) => ({
      skel: named(stroke(wisp(x, BASE), 'A'), 'wl-coffee'),   // own geometry: a neutral part name
      motion: { origin: [x, BASE - 2.3], keys: rise(dx), lag: [0, 0.36, 0.69][i] },
    })),
    { skel: CUP },
  ],
}
