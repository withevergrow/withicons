// Live icon: a calendar tile with a big day and an event marker under it (a dot, dots, a bar or a short label).
import { merge, tile, bigText, ink, mark, dot, disc, INNER, TILE, RINGS } from './_parts-calendar.mjs'
import { clean, live } from './_font.mjs'
import { fitLabel, fitLadder, boxDist } from './_parts-labels.mjs'
import { clipD } from './_parts-counts.mjs'

// the label row at the bottom of the tile (cap 4..4.5) and the day above it (3u between the two text lines)
const LABEL_IN = { x0: 5.25, y0: 13.5, x1: 18.75, y1: 18 }
const LABEL_ACROSS = { x0: 3.25, y0: 13.5, x1: 20.75, y1: 18 }

export default live({
  name: 'calendar-event', title: 'Calendar event', category: 'time',
  description: 'A calendar day with an event under it: a dot, several dots, an event bar or a short label like DUE.',
  aliases: ['event-date', 'calendar-dot', 'has-event', 'date-marker', 'event-day', 'appointment-date', 'scheduled-day', 'due-date'],
  tags: ['calendar', 'event', 'date', 'reminder', 'schedule', 'live'],
  synonyms: ['appointment', 'meeting', 'deadline', 'due', 'reminder', 'busy day', 'booked', 'event dot'],
  params: {
    day: { type: 'int', min: 1, max: 31, default: 17, label: 'Day of the month' },
    marker: { type: 'enum', options: ['dot', 'dots', 'bar', 'label'], default: 'dot', label: 'Event marker' },
    label: { type: 'text', maxLength: 3, default: 'DUE', case: 'upper', label: 'Label, up to 3 characters (when the marker is a label)' },
    rings: { type: 'bool', default: true, label: 'Binder rings' },
  },
  examples: [
    { day: 17, marker: 'dot', label: 'DUE', rings: true },
    { day: 31, marker: 'dots', label: 'DUE', rings: true },
    { day: 1, marker: 'bar', label: 'DUE', rings: true },
    { day: 24, marker: 'label', label: 'DUE', rings: true },
    { day: 9, marker: 'label', label: 'OFF', rings: false },
    { day: 12, marker: 'label', label: 'NEW', rings: true },
  ],
  build({ day, marker, label, rings }) {
    const n = String(day)
    if (marker === 'label') {
      // a word of up to 3 characters under the day at cap 4 or more (never below the legibility floor). Inside the
      // walls first; a wide word ("NEW", "WWW") runs across and the tile opens its side walls where it passes,
      // like the label family. The day shrinks to share the tile: the label row wins over a huge number.
      const s = clean(label, 3)
      const inside = s && fitLabel(s, LABEL_IN, { minCap: 4, maxCap: 4.5, valign: 'bottom' })
      const t = inside || (s && fitLadder(s, LABEL_ACROSS, { minCap: 4, maxCap: 4.5, valign: 'bottom' })?.t)
      if (t) {
        const big = bigText(n, { ...INNER, y1: t.box.y0 - 3 }, { maxCap: 6.5 })
        const frame = inside ? tile({ rings })
          : { paths: [{ d: clipD(TILE, p => boxDist(p, t.box) >= 3), plate: 'K' }, ...(rings ? RINGS.map(d => ({ d, plate: 'A' })) : [])], fills: [TILE], cutouts: [] }
        return merge(frame, ink(big), ink(t, 'A'))
      }
      marker = 'bar'
    }
    let event, bottom // bottom = top of the marker's ink
    if (marker === 'dot') { event = mark(disc(12, 16.75, 0.75), 'A', disc(12, 16.75, 1.25)); bottom = 15 }
    else if (marker === 'dots') { event = merge(...[8.5, 12, 15.5].map(x => mark(dot(x - 0.125, 17), 'A'))); bottom = 16 }
    else { event = mark('M8 17 H16', 'A'); bottom = 16 }
    // the day fills what is left above the marker (white 1 + text ink 1)
    return merge(tile({ rings }), ink(bigText(n, { ...INNER, y1: bottom - 2 })), event)
  },
})
