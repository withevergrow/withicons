// Live icon: a calendar tile with a date range: first and last day stacked beside a timeline rail.
import { merge, tile, smallText, bigText, ink, mark, disc, INNER } from './_parts-calendar.mjs'
import { live } from './_font.mjs'

// rail at x 6.25 with start/end nodes level with the two numbers; numbers left-aligned at x 10
const RAIL_X = 6.25
const TOP = { x0: 10, y0: 6, x1: 18.5, y1: 10.5 }, BOT = { x0: 10, y0: 13.5, x1: 18.5, y1: 18 }

export default live({
  name: 'calendar-range', title: 'Calendar range', category: 'time',
  description: 'A date range on a calendar tile: the first and last day on a little timeline, for trips, stays and sprints.',
  aliases: ['date-range', 'day-range', 'from-to-date', 'date-span', 'trip-dates', 'booking-dates', 'stay-dates', 'range-picker'],
  tags: ['calendar', 'range', 'dates', 'period', 'schedule', 'live'],
  synonyms: ['from to', 'start end', 'duration', 'period', 'holiday', 'vacation', 'sprint', 'check in check out', 'date range picker'],
  params: {
    from: { type: 'int', min: 1, max: 31, default: 12, label: 'First day' },
    to: { type: 'int', min: 1, max: 31, default: 18, label: 'Last day' },
    rings: { type: 'bool', default: true, label: 'Binder rings' },
  },
  examples: [
    { from: 12, to: 18, rings: true },
    { from: 1, to: 7, rings: true },
    { from: 24, to: 31, rings: true },
    { from: 28, to: 3, rings: true },
    { from: 10, to: 20, rings: false },
  ],
  build({ from, to, rings }) {
    // the same day twice is just that day
    if (from === to) return merge(tile({ rings }), ink(bigText(String(from), INNER)))
    const yA = (TOP.y0 + TOP.y1) / 2, yB = (BOT.y0 + BOT.y1) / 2
    // both numbers at one size (the smaller of the two fits)
    const opts = { cap: 4.5, minCap: 3.5, align: 'left' }
    let a = smallText(String(from), TOP, opts), b = smallText(String(to), BOT, opts)
    if (a && b && a.cap !== b.cap) {
      const cap = Math.min(a.cap, b.cap)
      a = smallText(String(from), TOP, { ...opts, cap }); b = smallText(String(to), BOT, { ...opts, cap })
    }
    return merge(
      tile({ rings }),
      mark(`M${RAIL_X} ${yA + 1.75} V${yB - 1.75}`, 'A'),
      mark(disc(RAIL_X, yA, 0.75), 'A', disc(RAIL_X, yA, 1.25)),
      mark(disc(RAIL_X, yB, 0.75), 'A', disc(RAIL_X, yB, 1.25)),
      ink(a), ink(b),
    )
  },
})
