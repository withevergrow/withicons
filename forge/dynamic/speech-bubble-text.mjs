// Live icon: a speech bubble with a short word inside (HI, OK, LOL, ?, !, ...), tail on the left or the right.
import { live } from './_font.mjs'
import { dot } from './_parts-misc.mjs'
import { fitLabel, fitLadder, textInk } from './_parts-labels.mjs'

// landscape bubble (2..22 x 3..17, r 2.5) with a straight-backed tail dropping to y 21, on the left or the right
const LEFT = 'M4.5 3 H19.5 A2.5 2.5 0 0 1 22 5.5 V14.5 A2.5 2.5 0 0 1 19.5 17 H10.5 L6 21 V17 H4.5 A2.5 2.5 0 0 1 2 14.5 V5.5 A2.5 2.5 0 0 1 4.5 3 Z'
// the word's centreline box: 2.9u inside the walls
const INSIDE = { x0: 4.9, y0: 5.9, x1: 19.1, y1: 14.1 }
const RIGHT = 'M4.5 3 H19.5 A2.5 2.5 0 0 1 22 5.5 V14.5 A2.5 2.5 0 0 1 19.5 17 H18 V21 L13.5 17 H4.5 A2.5 2.5 0 0 1 2 14.5 V5.5 A2.5 2.5 0 0 1 4.5 3 Z'

export default live({
  name: 'speech-bubble-text', title: 'Speech bubble text', category: 'communication',
  description: 'A chat bubble with a short word, reaction or symbol inside: HI, OK, LOL, ?, ! or a typing "...".',
  aliases: ['chat-text', 'bubble-text', 'message-text', 'speech-text', 'chat-word', 'reply-text', 'typing'],
  tags: ['chat', 'message', 'speech', 'bubble', 'text'],
  synonyms: ['hi', 'hello', 'ok', 'lol', 'reaction', 'say', 'greeting', 'typing indicator', 'question', 'faq', 'help', 'comment', 'dm'],
  params: {
    text: { type: 'text', maxLength: 3, default: 'HI', case: 'upper', label: 'Text (up to 3 characters)' },
    tail: { type: 'enum', options: ['left', 'right'], default: 'left', label: 'Tail side' },
  },
  examples: [
    { text: 'HI', tail: 'left' },
    { text: 'OK', tail: 'right' },
    { text: 'LOL', tail: 'left' },
    { text: '...', tail: 'left' },
    { text: '?', tail: 'right' },
    { text: 'YES', tail: 'right' },
  ],
  build({ text, tail }) {
    const body = tail === 'right' ? RIGHT : LEFT
    const s = String(text || '').trim()
    // only dots ("." to "..."): a typing indicator with real pips instead of the font's small full stops
    if (/^[.]+$/.test(s)) {
      const n = s.length, xs = n === 1 ? [12] : n === 2 ? [9.75, 14.25] : [7.5, 12, 16.5]
      const pips = xs.map(x => dot(x, 10, 0.75))
      return {
        paths: [{ d: body, plate: 'K' }, ...pips.map(d => ({ d, plate: 'A' }))],
        fills: [body],
        cutouts: xs.map(x => dot(x, 10, 1.75)),
      }
    }
    // always inside the closed bubble: regular cut, then condensed (_parts-labels fitLabel), shortening last
    const t = s ? (fitLabel(s, INSIDE, { minCap: 4, maxCap: 5.5 }) || fitLadder(s, INSIDE, { minCap: 3.75, maxCap: 5.5 })?.t) : null
    const ink = textInk(t, 'A')
    return {
      paths: [{ d: body, plate: 'K' }, ...ink.paths],
      fills: [body],
      cutouts: ink.cutouts,
    }
  },
})
