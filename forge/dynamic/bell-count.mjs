// Live icon: a notification bell with an unread count. forge/DYNAMIC.md, parts in ./_parts-counts.mjs
import { countIcon, countParams, countExamples, countShows, keptRatio } from './_parts-counts.mjs'
import { live } from './_font.mjs'

// the static `bell` skeleton, verbatim
const BASE = {
  paths: [
    { d: 'M6 16.5 V11 A6 6 0 0 1 18 11 V16.5 L19.5 18.5 H4.5 Z', plate: 'K' },
    { d: 'M9.5 18.5 A2.5 2.5 0 0 0 14.5 18.5', plate: 'A' },
  ],
  fills: ['M6 16.5 V11 A6 6 0 0 1 18 11 V16.5 L19.5 18.5 H4.5 Z'],
  cutouts: [],
}

const OPT = { minKeep: 0.7 }

export default live({
  name: 'bell-count', title: 'Bell with count', category: 'communication',
  description: 'A notification bell with an unread count badge: a number, "99+", a dot, or nothing at zero.',
  aliases: ['notification-count', 'notifications-badge', 'unread-notifications', 'bell-badge', 'alert-count', 'notification-badge'],
  tags: ['notification', 'bell', 'badge', 'count', 'unread'],
  synonyms: ['new notifications', 'unread alerts', 'notification number', 'activity count', 'pending alerts', 'red dot', 'notification dot'],
  params: countParams({ count: 3 }),
  examples: countExamples(),
  // the dome is the bell: a "99+" tag that leaves less than 70% of the outline (it takes the dome) shows "9+"
  shows: p => countShows(BASE, p, OPT), kept: p => keptRatio(BASE, p, OPT),
  build(p) { return countIcon(BASE, { ...p, ...OPT }) },
})
