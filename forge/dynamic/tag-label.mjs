// Live icon: a hanging label tag (eyelet at the top) with a short word ("SALE", "NEW", "VIP").
// Short text sits inside the tag. Longer words run the full width under the eyelet: the tag keeps its roof
// and its base, its side walls open where the letters pass, and filled styles get a band under the letters.
import { fitFirst, fitLadder, textInk } from './_parts-labels.mjs'
import { circle } from './_layout.mjs'
import { live } from './_font.mjs'

// a hanging tag across the whole live width with 45-degree shoulders and an eyelet; the word sits closed on its body
const TAG = 'M7.5 3.5 H16.5 L22 9 V18.5 A2.5 2.5 0 0 1 19.5 21 H4.5 A2.5 2.5 0 0 1 2 18.5 V9 Z'
const EYE = circle(12, 7.75, 1.25)
const INSIDE = { x0: 4.9, y0: 11.75, x1: 19.1, y1: 18.1 }

export default live({
  name: 'tag-label', title: 'Label tag', category: 'commerce',
  description: 'A hanging label tag with a short word such as SALE, NEW, VIP or GIFT.',
  aliases: ['hang-tag', 'label-tag', 'swing-tag', 'gift-tag', 'luggage-tag', 'name-tag', 'text-tag'],
  tags: ['tag', 'label', 'shopping', 'text'],
  synonyms: ['label', 'sale', 'new', 'gift', 'vip', 'category', 'marker', 'sticker', 'clothing tag', 'stock', 'inventory', 'merchandise'],
  params: {
    text: { type: 'text', maxLength: 4, default: 'SALE', case: 'upper', label: 'Text' },
  },
  examples: [{ text: 'SALE' }, { text: 'NEW' }, { text: 'VIP' }, { text: 'A1' }, { text: 'GIFT' }, { text: '%' }],
  build({ text }) {
    const s = text || 'SALE'
    const fit = fitFirst([s], INSIDE, { minCap: 4, maxCap: 5.25 }) || fitLadder(s, INSIDE, { minCap: 3.75, maxCap: 5.25 })
    const ink = textInk(fit && fit.t, 'A')
    return { paths: [{ d: TAG, plate: 'K' }, { d: EYE, plate: 'A' }, ...ink.paths], fills: [TAG], cutouts: [EYE, ...ink.cutouts] }
  },
})
