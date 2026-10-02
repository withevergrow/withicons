// Live icon: an envelope with an unread count. forge/DYNAMIC.md, parts in ./_parts-counts.mjs
import { countIcon, countParams, countExamples, countShows, keptRatio } from './_parts-counts.mjs'
import { live } from './_font.mjs'

// the static `mail` skeleton (on the 0.25 grid)
const BASE = {
  paths: [
    { d: 'M4.5 4.5 H19.5 A2 2 0 0 1 21.5 6.5 V17.5 A2 2 0 0 1 19.5 19.5 H4.5 A2 2 0 0 1 2.5 17.5 V6.5 A2 2 0 0 1 4.5 4.5 Z', plate: 'K' },
    { d: 'M2.5 7 L12 13.5 L21.5 7', plate: 'A' },
  ],
  fills: ['M4.5 4.5 H19.5 A2 2 0 0 1 21.5 6.5 V17.5 A2 2 0 0 1 19.5 19.5 H4.5 A2 2 0 0 1 2.5 17.5 V6.5 A2 2 0 0 1 4.5 4.5 Z'],
  cutouts: ['M5 8.75 L12 13.5 L19 8.75'],
}

export default live({
  name: 'mail-count', title: 'Mail with count', category: 'communication',
  description: 'An envelope with an unread-mail count badge: a number, "99+", a dot, or nothing at zero.',
  aliases: ['unread-mail', 'email-count', 'mail-badge', 'unread-email', 'new-mail', 'email-badge', 'mail-unread-count'],
  tags: ['email', 'mail', 'badge', 'count', 'unread'],
  synonyms: ['new messages', 'unread messages', 'email notification', 'mail notification', 'you have mail', 'message count'],
  params: countParams({ count: 5 }),
  examples: countExamples(),
  shows: p => countShows(BASE, p), kept: p => keptRatio(BASE, p),
  build(p) { return countIcon(BASE, p) },
})
