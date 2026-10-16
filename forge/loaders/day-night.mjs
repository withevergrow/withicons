// A whole day over one horizon: the sun swells up out of the horizon, arcs across the sky and melts back into it;
// then the moon rises along the same arc while three stars twinkle on, and sets before the next dawn.
import { icon, stroke, solid, merge, E } from './_kit.mjs'
import { twinkle } from './_creative-b.mjs'

const H = [12, 18]                                       // the horizon point every body rises from and sets into
// the library sun and moon, scaled into the sky. They draw under the loader's name, not the icons': styles that
// hand-draw sun / moon by name would draw them full size and ignore the scale
const small = (name, t) => ({ ...icon(name, t), name: undefined })
const sun = small('sun', { s: 0.55, y: -0.7 })          // centred on (12, 11.3), rays reach 5.5
const moon = small('moon', { s: 0.56, y: -0.9 })
// a body's half of the day: it swells up out of the horizon at the left, arcs over, and melts down at the right
function sky(a) {
  const k = [...(a > 0 ? [[0, { x: -3.2, y: 0, sx: 1.3, sy: 0.04, o: 0 }]] : []), [a, { x: -3.2, y: 0, sx: 1.3, sy: 0.04, o: 0, e: E.lift }],
    [a + 0.02, { o: 1, e: E.lift }]]
  // the arc: a parabola sampled evenly, so the crossing is steady and the rise / set ease at the ends
  const t0 = a + 0.085, t1 = a + 0.415, N = 8
  for (let i = 0; i <= N; i++) {
    const u = i / N, x = -3.2 + 6.4 * u, y = -1.7 * 4 * u * (1 - u)
    k.push([t0 + (t1 - t0) * u, { x, y, sx: 1, sy: 1, o: 1, e: i === N ? E.in : E.linear }])
  }
  k.push([a + 0.48, { x: 3.2, y: 0, sx: 1.3, sy: 0.04, o: 1 }], [a + 0.495, { o: 0 }])
  if (a + 0.5 < 1) k.push([1, { x: -3.2, y: 0, sx: 1.3, sy: 0.04, o: 0 }])
  return k
}
// a star of the night half: fades on after moonrise, twinkles, fades before dawn
function starKeys(on, tw) {
  return [
    [0, { s: 0.3, o: 0 }], [on, { s: 0.3, o: 0, e: E.spring }], [on + 0.05, { s: 1, o: 1, e: E.ease }],
    [tw, { s: 0.55, o: 0.55, e: E.ease }], [tw + 0.07, { s: 1.05, o: 1, e: E.ease }],
    [0.86, { s: 1, o: 1, e: E.in }], [0.9, { s: 0.3, o: 0 }], [1, { s: 0.3, o: 0 }],
  ]
}
// three stars, one part placed three times: each copy runs a little behind the last, so they twinkle in turn
const STAR = [4.4, 6.6], STARS = [[0, 0, 0], [15.2, -1.8, 0.035], [4.3, -3.4, 0.07]]
export default {
  name: 'day-night', title: 'Day and night', group: 'creative',
  description: 'The sun rises out of the horizon, arcs over and sets; the moon follows the same arc while stars twinkle.',
  intent: 'time passing: a whole day goes by while you wait',
  aliases: ['sun-moon-cycle', 'day-night-cycle', 'sunrise-sunset-loader', 'time-passing-loader'],
  tags: ['loading', 'weather', 'time', 'sun', 'moon', 'sky'],
  synonyms: ['time passing', 'overnight', 'waiting', 'day cycle', 'dawn', 'dusk'],
  duration: 6,
  morph: ['sun', 'moon'],
  parts: [
    { skel: merge(stroke('M2.5 18 H21.5'), stroke('M6.5 21 H10.5 M13.5 21 H17.5', 'A')) },
    { skel: sun, motion: { origin: H, keys: sky(0) } },
    { skel: moon, motion: { origin: H, keys: sky(0.5) } },
    { skel: solid(twinkle(STAR[0], STAR[1], 1.3), 'S'), motion: { origin: STAR, keys: starKeys(0.53, 0.7) },
      copies: STARS.map(([x, y, lag]) => ({ x, y, lag })) },
  ],
}
