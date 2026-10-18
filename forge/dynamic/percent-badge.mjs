// Live icon: a percent badge ("20%", "-5%", "35%"). A wide pill so the figures stay as big as possible. Fallbacks, in
// order, when the text will not fit at a legible cap (>= 4.25u): tighter tracking, then drop the sign, then drop the
// "%" (only "100%" and signed two-digit values ever need them).
import { live } from './_font.mjs'
import { fitFirst, textInk } from './_parts-labels.mjs'
import { rr } from './_layout.mjs'

const FRAME = rr(2, 6, 22, 18, 4)                   // landscape pill, 20 x 12 (the badge-text pill)
const BOX = { x0: 5.1, y0: 8.9, x1: 18.9, y1: 15.1 } // centrelines 2.9u inside the walls
const SIGNS = { none: '', minus: '-', plus: '+' }

export default live({
  name: 'percent-badge', title: 'Percent badge', category: 'commerce',
  description: 'A pill-shaped badge with the percentage you choose, for discounts, changes and scores.',
  aliases: ['discount-badge', 'sale-badge', 'percent-off', 'percentage-badge', 'percent-label', 'discount-tag', 'percent-chip', 'off-badge'],
  tags: ['percent', 'discount', 'sale', 'badge', 'commerce'],
  synonyms: ['discount', 'sale', 'percent', 'percentage', 'off', 'deal', 'offer', 'promo', 'promotion', 'coupon', 'markdown', 'savings', 'rate', 'interest', 'growth', 'change', 'increase', 'decrease', 'tax', 'vat', 'tip', 'black friday'],
  params: {
    value: { type: 'int', min: 0, max: 100, default: 20, label: 'Percent' },
    sign: { type: 'enum', options: ['none', 'minus', 'plus'], default: 'none', label: 'Sign' },
  },
  examples: [
    { value: 20, sign: 'none' },
    { value: 5, sign: 'minus' },
    { value: 50, sign: 'minus' },
    { value: 12, sign: 'plus' },
    { value: 100, sign: 'none' },
    { value: 0, sign: 'none' },
  ],
  build({ value, sign }) {
    const n = String(Math.max(0, Math.min(100, Math.round(value)))), sg = SIGNS[sign] || ''
    // the whole value closed in the pill: regular cut, then condensed; the sign goes before the digits shrink
    const fit = fitFirst([sg + n + '%'], BOX, { minCap: 4.25, maxCap: 5.75 }) || fitFirst([sg + n + '%', n + '%', n], BOX, { minCap: 3.75, maxCap: 5.75 })
    const ink = textInk(fit && fit.t, 'A')
    return {
      paths: [{ d: FRAME, plate: 'K' }, ...ink.paths],
      fills: [FRAME],
      cutouts: ink.cutouts,
    }
  },
})
