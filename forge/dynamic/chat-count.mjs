// Live icon: a chat bubble with an unread-message count. forge/DYNAMIC.md, parts in ./_parts-counts.mjs
import { countIcon, countParams, countExamples, countShows, keptRatio } from './_parts-counts.mjs'
import { live } from './_font.mjs'

// the static `message-circle` and `message-square` skeletons (on the 0.25 grid)
const ROUND = 'M8 19.25 A9 9 0 1 0 4.75 16 L2.5 21.5 Z'
const SQUARE = 'M3 21 V5.5 A2 2 0 0 1 5 3.5 H19 A2 2 0 0 1 21 5.5 V15.5 A2 2 0 0 1 19 17.5 H6.5 Z'
const BASES = {
  round: { paths: [{ d: ROUND, plate: 'K' }], fills: [ROUND], cutouts: [] },
  square: { paths: [{ d: SQUARE, plate: 'K' }], fills: [SQUARE], cutouts: [] },
}

export default live({
  name: 'chat-count', title: 'Chat with count', category: 'communication',
  description: 'A chat bubble with an unread-message count badge: a number, "99+", a dot, or nothing at zero.',
  aliases: ['unread-messages', 'message-count', 'chat-badge', 'unread-chat', 'comment-count', 'message-badge', 'dm-count'],
  tags: ['chat', 'message', 'badge', 'count', 'unread'],
  synonyms: ['new messages', 'unread chats', 'comments', 'replies', 'direct messages', 'conversation', 'speech bubble'],
  params: {
    ...countParams({ count: 7 }),
    bubble: { type: 'enum', options: ['round', 'square'], default: 'round', label: 'Bubble shape' },
  },
  examples: countExamples().map((p, i) => ({ ...p, bubble: i % 2 ? 'square' : 'round' })),
  shows: p => countShows(BASES[p.bubble] || BASES.round, p), kept: p => keptRatio(BASES[p.bubble] || BASES.round, p),
  build(p) { return countIcon(BASES[p.bubble] || BASES.round, p) },
})
