// Live icon: a wristwatch whose hands show the time you set (forge/DYNAMIC.md).
// Frame = the static `watch` (round case) or a squircle case on the same straps.
import { WATCH, hands } from './_parts-time.mjs'
import { live } from './_font.mjs'

export default live({
  name: 'watch-time', title: 'Wristwatch showing a time', category: 'time',
  description: 'A wristwatch with a round or square case whose hands show the time you choose.',
  aliases: ['wristwatch-time', 'watch-at', 'watch-face', 'wrist-time', 'smartwatch-time', 'timepiece'],
  tags: ['time', 'watch', 'wrist', 'clock', 'wearable'],
  synonyms: ['wristwatch', 'smartwatch', 'what time', 'on time', 'punctual', 'appointment',
    'meeting time', 'fitness watch', 'wearable', 'time check', 'running late'],
  params: {
    time: { type: 'time', default: '10:10', label: 'Time (HH:MM)' },
    shape: { type: 'enum', options: ['round', 'square'], default: 'round', label: 'Case shape' },
  },
  examples: [
    { time: '10:10', shape: 'round' },
    { time: '03:00', shape: 'square' },
    { time: '12:00', shape: 'round' },
    { time: '07:25', shape: 'round' },
    { time: '09:41', shape: 'square' },
  ],
  build({ time, shape }) {
    const w = WATCH[shape] || WATCH.round
    const h = hands(time, w.hands)
    return {
      paths: [
        { d: w.face, plate: 'K' },
        ...w.straps.map(d => ({ d, plate: 'K' })),
        { d: h, plate: 'A' },
      ],
      fills: w.fills,
      cutouts: [h],
    }
  },
})
