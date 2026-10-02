// Live icon: a calendar tile with a month name on top and a mini month grid under it, one day marked.
import { MONTHS, merge, tile, split, smallText, ink, mark, dot, disc } from './_parts-calendar.mjs'
import { live } from './_font.mjs'

// 3 × 2 grid of day dots, the static calendar-days rhythm stretched to the tile (4.5u columns, 4u rows)
const COLS = [7.5, 12, 16.5], ROWS = [13.5, 17.5]

export default live({
  name: 'calendar-month', title: 'Calendar month', category: 'time',
  description: 'A month calendar: the month name over a small grid of days, with one day marked if you like.',
  aliases: ['month-calendar', 'monthly-view', 'month-name', 'month-grid', 'mini-calendar', 'month-planner', 'month-picker'],
  tags: ['calendar', 'month', 'grid', 'schedule', 'planner', 'live'],
  synonyms: ['monthly', 'month view', 'this month', 'billing month', 'period', 'calendar app'],
  params: {
    month: { type: 'enum', options: MONTHS, default: 'MAR', label: 'Month' },
    marked: { type: 'int', min: 0, max: 6, default: 5, label: 'Highlighted dot in the grid (1-6, 0 = none)' },
    rings: { type: 'bool', default: true, label: 'Binder rings' },
  },
  examples: [
    { month: 'MAR', marked: 5, rings: true },
    { month: 'JAN', marked: 1, rings: true },
    { month: 'MAY', marked: 6, rings: true },
    { month: 'SEP', marked: 0, rings: true },
    { month: 'DEC', marked: 3, rings: false },
  ],
  build({ month, marked, rings }) {
    const { small } = split()
    const cells = []
    ROWS.forEach((y, r) => COLS.forEach((x, c) => {
      const i = r * COLS.length + c + 1
      // the marked day is a bigger disc (an area knock-out in the filled styles)
      cells.push(i === marked ? mark(disc(x, y, 0.75), 'A', disc(x, y, 1.25)) : mark(dot(x, y), 'A'))
    }))
    return merge(tile({ rings }), ink(smallText(month, small)), ...cells)
  },
})
