// Live icon: an analogue clock showing the time you set (forge/DYNAMIC.md).
// Frame = the static `clock` (PARTS circle container) or the PARTS square container; hands are one polyline.
import { CLOCK_FACE, SQUARE_FACE, hands } from './_parts-time.mjs'
import { live } from './_font.mjs'

export default live({
  name: 'clock-time', title: 'Clock showing a time', category: 'time',
  description: 'An analogue clock whose hands show the exact time you choose; the hour hand moves with the minutes.',
  aliases: ['clock-at', 'time-of-day', 'analog-time', 'set-time', 'clock-hands', 'time-display', 'wall-clock-time'],
  tags: ['time', 'clock', 'hour', 'minute', 'schedule'],
  synonyms: ['what time', 'opening time', 'closing time', 'appointment time', 'meeting time', 'start time', 'end time',
    'o clock', 'half past', 'quarter past', 'quarter to', 'time picker', 'pick a time', 'business hours', 'deadline', 'eta'],
  params: {
    time: { type: 'time', default: '10:10', label: 'Time (HH:MM)' },
    shape: { type: 'enum', options: ['round', 'square'], default: 'round', label: 'Clock shape' },
  },
  examples: [
    { time: '10:10', shape: 'round' },
    { time: '03:00', shape: 'round' },
    { time: '12:00', shape: 'round' },
    { time: '07:20', shape: 'square' },
    { time: '08:20', shape: 'round' },
    { time: '01:50', shape: 'square' },
  ],
  build({ time, shape }) {
    const face = shape === 'square' ? SQUARE_FACE : CLOCK_FACE
    // minute 6 / hour 3.5 (round): a clear long/short pair, 1.5u of white to the face; the square face is 0.5u tighter
    const h = hands(time, { cx: 12, cy: 12, minute: shape === 'square' ? 5.5 : 6, hour: 3.5, tail: 1.5 })
    return {
      paths: [{ d: face, plate: 'K' }, { d: h, plate: 'A' }],
      fills: [face],
      cutouts: [h],
    }
  },
})
