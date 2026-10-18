// Live icon: a digital clock: a desk display on two short feet with the hours stacked over the minutes, or the bare
// digits at a bold cap 7 (forge/DYNAMIC.md).
//
// Why stacked: "09:41" on one line is 18-20u wide at cap 4; no display on the 24 grid holds every time of day legibly
// on one line at ONE size (a clock whose digits change size with the time is wrong). Two rows of two digits fit a
// 17 x 17.5 display at cap 4.75 for every time in both formats, in the regular cut; the feet make it a clock.
import { text, asCutouts, live } from './_font.mjs'
import { rr } from './_layout.mjs'
import { clockDigits } from './_parts-time.mjs'

const DISPLAY = rr(3.5, 2, 20.5, 19.5, 3)
const FEET = ['M7 19.5 V21.5', 'M17 19.5 V21.5']
// row centres: caps 4.75 with 2.5u (centreline) between the rows, 2.75u inside the walls
const CAP = 4.75, TRACK = -0.25, ROWS = [7.125, 14.375]

export default live({
  name: 'digital-clock', title: 'Digital clock', category: 'time',
  description: 'A digital clock with the hours stacked over the minutes, on a desk display or bare, in 24- or 12-hour format.',
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
      const g = [hh, mm].flatMap((str, i) => text(str, { x: 12, y: ROWS[i], size: CAP, tracking: TRACK }).paths)
      return {
        paths: [{ d: DISPLAY, plate: 'K' }, ...FEET.map(d => ({ d, plate: 'K' })), ...g.map(d => ({ d, plate: 'A' }))],
        fills: [DISPLAY],
        cutouts: asCutouts(g),
      }
    }
    // bare: the digits are the icon, at the large cap 7, rows 12u apart (5u of white between them)
    const g = [...text(hh, { x: 12, y: 6, size: 7 }).paths, ...text(mm, { x: 12, y: 18, size: 7 }).paths]
    return { paths: g.map(d => ({ d, plate: 'K' })), fills: [], cutouts: [] }
  },
})
