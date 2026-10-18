// forge/hand/gothic/disc.mjs: a compact disc: a limestone-silver platter with a bright edge ring, two engraved track
// grooves, a ruby label ring round a see-through spindle hole and two candle-lit sheen wedges; the old blue face with a
// white hub read as an eyeball.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  return paint([
    g.iron(g.rim(g.circle(12, 12, 9.8), 1.1)),
    g.stone(g.circle(12, 12, 8.7)),
    g.iron(g.ring(12, 12, 6.9, 0.45)),
    g.iron(g.ring(12, 12, 5.4, 0.45)),
    g.glass(g.ring(12, 12, 3.7, 1.8), 'c1', { outline: 0.2, tracery: 'none', glint: false, dark: 0.2, glow: 0.3 }),
    g.shine(g.arc(12, 12, 8.0, 195, 250, 1.1), { op: 0.9 }),
    g.shine(g.arc(12, 12, 8.0, 15, 60, 0.9), { op: 0.55 }),
    g.cut(g.circle(12, 12, 1.5)),
    g.iron(g.rim(g.circle(12, 12, 1.5), 0.45)),
  ])
}
