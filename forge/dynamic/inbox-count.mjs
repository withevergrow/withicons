// Live icon: an inbox tray with the number of new items. forge/DYNAMIC.md, parts in ./_parts-counts.mjs
import { countIcon, countParams, countExamples, countShows, keptRatio } from './_parts-counts.mjs'
import { live } from './_font.mjs'

// the static `inbox` skeleton, verbatim
const BASE = {
  paths: [
    { d: 'M2.5 12.5 L5.5 5 H18.5 L21.5 12.5 V17.5 A2 2 0 0 1 19.5 19.5 H4.5 A2 2 0 0 1 2.5 17.5 Z', plate: 'K' },
    { d: 'M2.5 12.5 H7.5 L9 15 H15 L16.5 12.5 H21.5', plate: 'A' },
  ],
  fills: ['M2.5 12.5 H7.5 L9 15 H15 L16.5 12.5 H21.5 V17.5 A2 2 0 0 1 19.5 19.5 H4.5 A2 2 0 0 1 2.5 17.5 Z'],
  cutouts: [],
}

export default live({
  name: 'inbox-count', title: 'Inbox with count', category: 'communication',
  description: 'An inbox tray with the number of new items: a number, "99+", a dot, or an empty tray at zero.',
  aliases: ['inbox-badge', 'unread-inbox', 'new-items', 'tray-count', 'inbox-unread-count', 'pending-count'],
  tags: ['inbox', 'tray', 'badge', 'count', 'unread'],
  synonyms: ['inbox zero', 'new messages', 'to do count', 'queue length', 'pending items', 'unread items', 'incoming'],
  params: countParams({ count: 8 }),
  examples: countExamples(),
  shows: p => countShows(BASE, p), kept: p => keptRatio(BASE, p),
  build(p) { return countIcon(BASE, p) },
})
