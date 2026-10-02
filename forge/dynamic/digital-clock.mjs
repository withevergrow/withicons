// Live icon: a digital clock — hours stacked over minutes, lock-screen style, on a portrait display
// (forge/DYNAMIC.md).
//
// Why stacked: "09:41" in one row is 18–20u wide even at cap 4, so no framed display on the 24 grid can hold it
// legibly. Two rows of two digits fit a portrait display (the CONTRACT portrait keyline 4..20 x 2..22) at cap
// 4.75 with 1.5u of white between the rows, and frameless at a bold cap 7.
import { text, measure, asCutouts, live } from './_font.mjs'
import { rr } from './_layout.mjs'
import { clockDigits } from './_parts-time.mjs'

const DISPLAY = rr(4, 2, 20, 22, 3)
// centreline boxes for the two rows inside the display (wall 1u ink + 1.5u white + 1u text ink = 3.5u inset)
const ROWS = [{ x0: 7.5, y0: 5.5, x1: 16.5, y1: 10.25 }, { x0: 7.5, y0: 13.75, x1: 16.5, y1: 18.5 }]

// one cap for both rows: the largest (<= row height, >= 4) at which both strings fit the row width
function rowCap(strs, w, hMax) {
  for (let cap = hMax; cap >= 4; cap -= 0.25) if (strs.every(s => measure(s, { size: cap }).width <= w)) return cap
  return 4
}

export default live({
  name: 'digital-clock', title: 'Digital clock', category: 'time',
  description: 'A digital clock with the hours stacked over the minutes, in 24- or 12-hour format, framed or bare.',
  aliases: ['digital-time', 'clock-display', 'led-clock', 'lcd-clock', 'time-readout', 'lock-screen-clock', 'stacked-clock'],
  tags: ['time', 'clock', 'digital', 'display', 'screen'],
  synonyms: ['digital watch', 'clock radio', 'bedside clock', 'lock screen', 'current time', 'what time', 'hh mm',
    'twenty four hour', 'military time', 'am pm', 'time widget', 'status bar time', 'nine forty one'],
  params: {
    time: { type: 'time', default: '09:41', label: 'Time (HH:MM)' },
    format: { type: 'enum', options: ['24h', '12h'], default: '24h', label: 'Hour format' },
    frame: { type: 'bool', default: true, label: 'Show the display frame' },
  },
  examples: [
    { time: '09:41', format: '24h', frame: true },
    { time: '23:58', format: '24h', frame: true },
    { time: '21:05', format: '12h', frame: true },
    { time: '00:00', format: '24h', frame: true },
    { time: '09:41', format: '24h', frame: false },
    { time: '18:30', format: '24h', frame: false },
  ],
  build({ time, format, frame }) {
    const { hh, mm } = clockDigits(time, format)
    if (frame) {
      const cap = rowCap([hh, mm], ROWS[0].x1 - ROWS[0].x0, ROWS[0].y1 - ROWS[0].y0)
      const g = [hh, mm].flatMap((s, i) => text(s, { x: 12, y: (ROWS[i].y0 + ROWS[i].y1) / 2, size: cap }).paths)
      return {
        paths: [{ d: DISPLAY, plate: 'K' }, ...g.map(d => ({ d, plate: 'A' }))],
        fills: [DISPLAY],
        cutouts: asCutouts(g),
      }
    }
    // bare: the digits are the icon, at the large cap 7, rows 12u apart (5u of white between them)
    const g = [...text(hh, { x: 12, y: 6, size: 7 }).paths, ...text(mm, { x: 12, y: 18, size: 7 }).paths]
    return { paths: g.map(d => ({ d, plate: 'K' })), fills: [], cutouts: [] }
  },
})
