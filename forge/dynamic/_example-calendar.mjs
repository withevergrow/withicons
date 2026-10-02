// TEST generator (underscore = not shipped): a calendar page with a day number. Proves the font + tools.
import { fitText, asCutouts, live } from './_font.mjs'

const BODY = 'M5 5 H19 A2 2 0 0 1 21 7 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V7 A2 2 0 0 1 5 5 Z'

export default live({
  name: 'example-calendar', title: 'Calendar day (example)', category: 'time',
  description: 'Test generator: a calendar page with the day of the month you choose.',
  aliases: ['example-date', 'example-day', 'example-calendar-day'], tags: ['calendar', 'date'],
  synonyms: ['today'],
  params: {
    day: { type: 'int', min: 1, max: 31, default: 17, label: 'Day of the month' },
  },
  examples: [{ day: 1 }, { day: 8 }, { day: 17 }, { day: 24 }, { day: 31 }],
  build({ day }) {
    // the header sits a little higher than the static calendar's (y 9 vs 10) so a cap-7 number fits below it
    const t = fitText(String(day), { x0: 6, y0: 11.5, x1: 18, y1: 18.5 }, { prefer: 'large', minCap: 5 })
    const text = t ? t.paths : []
    return {
      paths: [
        { d: BODY, plate: 'K' },
        { d: 'M3 9 H21', plate: 'K' },
        { d: 'M8 3 V6.5', plate: 'A' },
        { d: 'M16 3 V6.5', plate: 'A' },
        ...text.map(d => ({ d, plate: 'A' })),
      ],
      fills: [BODY],
      cutouts: ['M5 9 H19', ...asCutouts(text)],
    }
  },
})
