// Live icon: a speech bubble with a short word inside (HI, OK, LOL, ?, !, ...), tail on the left or the right.
import { asCutouts, live } from './_font.mjs'
import { fitChain, fitInside, dot } from './_parts-misc.mjs'
import { fitLabel, fitLadder, boxDist, CLEAR } from './_parts-labels.mjs'
import { clipD } from './_parts-counts.mjs'

// landscape bubble (2..22 x 3..17, r 2.5) with a straight-backed tail dropping to y 21, on the left or the right
const LEFT = 'M4.5 3 H19.5 A2.5 2.5 0 0 1 22 5.5 V14.5 A2.5 2.5 0 0 1 19.5 17 H10.5 L6 21 V17 H4.5 A2.5 2.5 0 0 1 2 14.5 V5.5 A2.5 2.5 0 0 1 4.5 3 Z'
// a long word runs across the bubble between its top and bottom walls (3.25u clear of both)
const ACROSS = { x0: 3.5, y0: 6.5, x1: 20.5, y1: 13.5 }
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
    // inside the closed bubble, shrinking to cap 4 (and slightly tighter tracking) ...
    const inside = fitInside(s, { outline: body, cx: 12, ys: [10, 9.75, 10.25], minCap: 4 })
    // ... else the word runs the full width and the bubble opens its side walls where the letters pass, like the
    // label family ("NEW", "WOW", "888" stay whole instead of turning into another word); shortening is the last resort
    const across = !inside && s ? (fitLabel(s, ACROSS, { minCap: 4, maxCap: 5.5 }) || fitLadder(s, ACROSS, { minCap: 4, maxCap: 5.5 })?.t) : null
    const t = inside || across
    const txt = t ? t.paths : []
    const frame = across ? clipD(body, p => boxDist(p, across.box) >= CLEAR) : body
    return {
      paths: [{ d: frame, plate: 'K' }, ...txt.map(d => ({ d, plate: 'A' }))],
      fills: [body],
      cutouts: asCutouts(txt),
    }
  },
})
