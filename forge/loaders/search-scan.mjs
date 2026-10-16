// A magnifying glass scanning: it glides along a lazy figure-eight, leaning into each turn like a hand moving a
// lens across a page, never stopping, never hurrying.
import { icon } from './_kit.mjs'
import { sampled } from './_common-b.mjs'

const S = 0.72                                   // the library magnifier, scaled about the centre
const LENS = [12 + (10.5 - 12) * S, 12 + (10.5 - 12) * S]
const AX = 2.9, AY = 1.7, TILT = 9               // figure-eight half-width / half-height, lean in degrees
// the library search glass, without its icon name: styles with a hand-drawn 'search' sprite would ignore the
// scale (the sprite is drawn full size whatever the geometry)
const { name: _n, ...glass } = icon('search', { s: S })
export default {
  name: 'search-scan', title: 'Scanning search', group: 'common',
  description: 'A magnifying glass glides along a lazy figure-eight, leaning into each turn as if scanning a page.',
  intent: 'looking through everything to find it',
  aliases: ['magnifier-scan', 'search-loader', 'scanning-magnifier', 'lens-sweep', 'search-spinner'],
  tags: ['loading', 'search', 'scan', 'find'], synonyms: ['searching', 'looking', 'scanning', 'finding', 'lookup'],
  duration: 2.4,
  parts: [{
    skel: glass,
    motion: {
      origin: LENS,
      // x: one swing left-right per cycle, y: two (a figure-eight); the lean follows the sideways speed
      keys: sampled(t => {
        const a = t * Math.PI * 2
        return { x: AX * Math.sin(a), y: -AY * Math.sin(2 * a), r: TILT * Math.cos(a) }
      }, 24),
    },
  }],
}
