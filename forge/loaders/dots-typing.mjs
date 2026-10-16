// Three dots, the chat "typing" rhythm: each in turn lifts a little, swells and brightens, then settles back dim,
// and the three rest together for a breath before the next phrase. Unhurried, like someone thinking as they type.
import { circle, solid, E } from './_kit.mjs'

const R = 1, GAP = 5.5, LAG = 0.17
const keys = [
  [0, { y: 0, s: 1, o: 0.32, e: E.ease }],
  [0.22, { y: -1.6, s: 1.18, o: 1, e: E.ease }],
  [0.48, { y: 0, s: 1, o: 0.32 }],
  [1, { y: 0, s: 1, o: 0.32 }],
]
export default {
  name: 'dots-typing', title: 'Typing dots', group: 'common',
  description: 'Three dots lift, swell and brighten one after another, then rest a breath: the calm "someone is typing" rhythm.',
  intent: 'someone (or an AI) is composing a reply',
  aliases: ['typing-dots', 'ellipsis-loader', 'thinking-dots', 'composing-dots', 'dots-pulse-sequence'],
  tags: ['loading', 'dots', 'chat', 'typing', 'ai'], synonyms: ['typing', 'thinking', 'composing', 'reply', 'please wait'],
  duration: 1.5,
  parts: [{
    skel: solid(circle(12, 12, R)),
    motion: { origin: [12, 12], keys },
    copies: [-GAP, 0, GAP].map((x, i) => ({ x, y: 0, lag: i * LAG })),
  }],
}
