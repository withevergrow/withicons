// Live icon: a calendar tile with a month on top and a big day of the month under it.
import { MONTHS, merge, tile, split, smallText, bigText, ink } from './_parts-calendar.mjs'
import { live } from './_font.mjs'

export default live({
  name: 'calendar-date', title: 'Calendar date', category: 'time',
  description: 'A calendar tile showing a month and a day of the month you choose, for due dates, events and today.',
  aliases: ['date-tile', 'day-of-month', 'calendar-day', 'month-and-day', 'dated', 'date-badge', 'today-date', 'calendar-number'],
  tags: ['calendar', 'date', 'day', 'month', 'schedule', 'live'],
  synonyms: ['today', 'due date', 'event date', 'deadline', 'day number', 'date picker', 'calendar app'],
  params: {
    day: { type: 'int', min: 1, max: 31, default: 17, label: 'Day of the month' },
    month: { type: 'enum', options: MONTHS, default: 'MAR', label: 'Month' },
    rings: { type: 'bool', default: true, label: 'Binder rings' },
  },
  examples: [
    { day: 17, month: 'MAR', rings: true },
    { day: 1, month: 'JAN', rings: true },
    { day: 31, month: 'MAY', rings: true },
    { day: 8, month: 'DEC', rings: true },
    { day: 24, month: 'NOV', rings: false },
  ],
  build({ day, month, rings }) {
    const { small, big } = split()
    return merge(tile({ rings }), ink(smallText(month, small)), ink(bigText(String(day), big)))
  },
})
