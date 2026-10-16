// Two curved arrows chasing each other round a circle. Each half turn is one gesture: a small wind-up, a whoosh
// that eases in and out with a hair of overshoot, a settle and a short rest. Two gestures make the full turn.
import { arc, polar, poly, solid, stroke, merge, E } from './_kit.mjs'

const R = 6.75, SPAN = 115, HEAD = 2.6, TIP = 21
const NAME = 'wl-refresh'   // not 'refresh': hand-drawn refresh sprites ignore the geometry
// one arrow: an arc ending at `end` (clock degrees) and a solid head pointing clockwise along the circle
const arrow = end => merge(
  stroke(arc(12, 12, R, end - SPAN, end)),
  solid(poly([polar(12, 12, R + HEAD, end), polar(12, 12, R, end + TIP), polar(12, 12, R - HEAD, end)]), 'A'),
)
// a whoosh: eases in, runs, and lands a few degrees past the mark before settling back onto it
const WHOOSH = 'cubic-bezier(.55,0,.2,1.16)'
const half = (t0, r0) => [
  [t0, { r: r0, s: 1, e: E.ease }],
  [t0 + 0.07, { r: r0 - 10, s: 0.93, e: WHOOSH }],     // wind up
  [t0 + 0.38, { r: r0 + 180, s: 1 }],                   // whoosh + settle
]
export default {
  name: 'refresh', title: 'Refresh', group: 'common',
  description: 'Two curved arrows wind up, whoosh half a turn round the circle, settle with a tiny overshoot and rest.',
  intent: 'reloading, syncing: fresh data on its way',
  aliases: ['refresh-loader', 'reload-spinner', 'sync-arrows', 'refresh-arrows', 'circular-arrows-loader'],
  tags: ['loading', 'refresh', 'sync', 'reload'], synonyms: ['loading', 'refreshing', 'reloading', 'syncing', 'updating'],
  duration: 1.8,
  parts: [{
    name: NAME,
    skel: merge(arrow(355), arrow(175)),
    motion: { origin: [12, 12], keys: [...half(0, 0), ...half(0.5, 180), [1, { r: 360, s: 1 }]] },
  }],
}
