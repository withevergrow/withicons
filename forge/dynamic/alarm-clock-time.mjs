// Live icon: an alarm clock (twin bells, splayed feet) whose hands show the alarm time (forge/DYNAMIC.md).
// Frame = the static `alarm-clock`; `ringing` adds short shake arcs either side of the body.
import { ALARM, hands, arc } from './_parts-time.mjs'
import { live } from './_font.mjs'

export default live({
  name: 'alarm-clock-time', title: 'Alarm clock showing a time', category: 'time',
  description: 'A twin-bell alarm clock whose hands show the wake-up time you choose, optionally ringing.',
  aliases: ['alarm-at', 'wake-up-time', 'alarm-time-set', 'morning-alarm-time', 'alarm-set-for', 'bell-clock-time'],
  tags: ['time', 'alarm', 'wake', 'morning', 'reminder'],
  synonyms: ['wake me up at', 'set alarm', 'alarm ringing', 'ringing clock', 'snooze', 'get up', 'bedtime',
    'rise and shine', 'reminder time', 'sleep schedule', 'morning routine', 'time is up'],
  params: {
    time: { type: 'time', default: '07:00', label: 'Alarm time (HH:MM)' },
    ringing: { type: 'bool', default: false, label: 'Ringing' },
  },
  examples: [
    { time: '07:00', ringing: false },
    { time: '06:15', ringing: true },
    { time: '10:10', ringing: false },
    { time: '12:00', ringing: true },
    { time: '05:45', ringing: false },
  ],
  build({ time, ringing }) {
    const [cx, cy] = ALARM.c
    const h = hands(time, { cx, cy, minute: 4, hour: 2.5, tail: 1.25 })
    // shake arcs: concentric with the body (r 10 -> 1u of white to the body ink), centred on 3 and 9 o'clock
    const shake = ringing ? [arc(cx, cy, 10, 72, 108), arc(cx, cy, 10, 252, 288)] : []
    return {
      paths: [
        { d: ALARM.body, plate: 'K' },
        { d: h, plate: 'A' },
        ...ALARM.bells.map(d => ({ d, plate: 'A' })),
        ...ALARM.feet.map(d => ({ d, plate: 'A' })),
        ...shake.map(d => ({ d, plate: 'S' })),
      ],
      fills: [ALARM.body, ...ALARM.bells],
      cutouts: [h],
    }
  },
})
