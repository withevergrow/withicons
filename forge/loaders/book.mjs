// An open book whose pages turn from right to left: each page lifts off the right-hand side, stands up at the spine
// (rising a little towards you) and settles onto the left, three pages in a staggered riffle, then a breath.
import { merge, stroke, E } from './_kit.mjs'

// parts draw under their own name: "book" is also a library icon, and some styles hand-draw that icon by name
const NAME = 'loader-book'
const SP = [12, 13]                                      // the spine pivot (pages scale on X about it)
// the right-hand page (a closed sheet, spine edge included); the left page is its mirror
const RIGHT = 'M12 7.5 C13.5 6 16 5 19.5 5 A1.5 1.5 0 0 1 21 6.5 V16.5 A1.5 1.5 0 0 1 19.5 18 C16 18 13.5 19 12 20.5 Z'
const LEFT = 'M12 7.5 C10.5 6 8 5 4.5 5 A1.5 1.5 0 0 0 3 6.5 V16.5 A1.5 1.5 0 0 0 4.5 18 C8 18 10.5 19 12 20.5 Z'
const TEXT_R = 'M14.5 10 H18.5 M14.5 13.25 H17.5'
const TEXT_L = 'M5.5 10 H9.5 M6.5 13.25 H9.5'
// a page turn: it peels up (fading in as it leaves the stack), stands at the spine lifted towards you, then falls
// open onto the left page and melts into it
const flip = [
  [0, { sx: 1, sy: 1, y: 0, o: 0, e: E.in }],
  [0.07, { sx: 0.9, o: 1, e: E.in }],
  [0.24, { sx: 0.04, sy: 1.08, y: -1.3, e: E.out }],
  [0.41, { sx: -0.9, sy: 1.01, y: -0.1, o: 1, e: E.out }],
  [0.48, { sx: -1, sy: 1, y: 0, o: 0 }],
]
const sheet = (d, text, plate, tp = 'A') => ({ paths: [{ d, plate }, { d: text, plate: tp }], fills: [d], cutouts: [text] })
const page = sheet(RIGHT, TEXT_R, 'A')
export default {
  name: 'book', title: 'Book', group: 'creative',
  description: 'An open book riffles: three pages lift off the right, stand up at the spine and settle on the left.',
  intent: 'reading, learning, or content being turned page by page',
  aliases: ['page-flip', 'book-pages-turning', 'reading-loader', 'flipping-book'],
  tags: ['loading', 'book', 'reading', 'pages', 'education'],
  synonyms: ['reading', 'learning', 'loading content', 'docs', 'turning pages', 'library'],
  duration: 3,
  parts: [
    { name: NAME, skel: merge(stroke(LEFT), stroke(RIGHT), stroke(TEXT_L, 'A'), stroke(TEXT_R, 'A')) },
    ...[0, 0.17, 0.34].map(lag => ({ name: NAME, skel: page, motion: { origin: SP, keys: flip, lag } })),
  ],
}
