// Live icon: a tear-off desk calendar: a binder strip on top, a big day on the page, a torn bottom edge.
import { merge, bigText, ink } from './_parts-calendar.mjs'
import { live } from './_font.mjs'

// page outline on the static calendar keyline (x 3..21): rounded top, sides down to y 19.5, then a torn edge of
// four 4.5u teeth (1.5u deep) back to the left side. The straight variant ends at y 21 with the static corners.
const TORN = 'M3 19.5 V5 A2 2 0 0 1 5 3 H19 A2 2 0 0 1 21 5 V19.5 L18.75 21 L16.5 19.5 L14.25 21 L12 19.5 L9.75 21 L7.5 19.5 L5.25 21 Z'
const FLAT = 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z'

export default live({
  name: 'calendar-tear', title: 'Tear-off calendar', category: 'time',
  description: 'A tear-off desk calendar page with the day you choose and a torn bottom edge.',
  aliases: ['tear-off-calendar', 'daily-calendar', 'desk-calendar', 'day-page', 'page-a-day', 'calendar-pad', 'tear-off', 'day-counter'],
  tags: ['calendar', 'day', 'date', 'daily', 'countdown', 'live'],
  synonyms: ['daily', 'day by day', 'countdown', 'advent', 'streak', 'desk pad', 'block calendar', 'today'],
  params: {
    day: { type: 'int', min: 1, max: 31, default: 17, label: 'Day of the month' },
    torn: { type: 'bool', default: true, label: 'Torn bottom edge' },
  },
  examples: [
    { day: 17, torn: true },
    { day: 1, torn: true },
    { day: 31, torn: true },
    { day: 8, torn: true },
    { day: 25, torn: false },
  ],
  build({ day, torn }) {
    const page = torn ? TORN : FLAT
    // binder strip y 3..7, page below; the day sits 1u clear of the strip line and of the teeth
    const t = bigText(String(day), { x0: 6, y0: 10, x1: 18, y1: torn ? 16.5 : 18 })
    return merge(
      {
        paths: [
          { d: page, plate: 'K' },
          { d: 'M3 7 H21', plate: 'K' },
          { d: 'M8 2 V4.5', plate: 'A' },
          { d: 'M16 2 V4.5', plate: 'A' },
        ],
        fills: [page],
        cutouts: ['M5 7 H19'],
      },
      ink(t),
    )
  },
})
