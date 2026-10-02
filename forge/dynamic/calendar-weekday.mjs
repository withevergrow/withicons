// Live icon: a calendar tile with a weekday on top and a big day of the month under it.
import { WEEKDAYS, merge, tile, split, smallText, bigText, ink } from './_parts-calendar.mjs'
import { live } from './_font.mjs'

export default live({
  name: 'calendar-weekday', title: 'Calendar weekday', category: 'time',
  description: 'A calendar tile showing the day of the week and the day of the month, like a phone calendar app.',
  aliases: ['weekday', 'day-of-week', 'week-day', 'weekday-date', 'today-weekday', 'day-name', 'calendar-today', 'date-weekday'],
  tags: ['calendar', 'weekday', 'date', 'day', 'schedule', 'live'],
  synonyms: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'today', 'what day', 'calendar app'],
  params: {
    day: { type: 'int', min: 1, max: 31, default: 17, label: 'Day of the month' },
    weekday: { type: 'enum', options: WEEKDAYS, default: 'TUE', label: 'Day of the week' },
    rings: { type: 'bool', default: true, label: 'Binder rings' },
  },
  examples: [
    { day: 17, weekday: 'TUE', rings: true },
    { day: 1, weekday: 'MON', rings: true },
    { day: 28, weekday: 'WED', rings: true },
    { day: 6, weekday: 'SAT', rings: true },
    { day: 31, weekday: 'FRI', rings: false },
  ],
  build({ day, weekday, rings }) {
    const { small, big } = split()
    return merge(tile({ rings }), ink(smallText(weekday, small)), ink(bigText(String(day), big)))
  },
})
