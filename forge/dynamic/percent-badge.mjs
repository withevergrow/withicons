// Live icon: a percent badge ("20%", "-5%", "35%"). A wide pill so the figures stay as big as possible. Fallbacks, in
// order, when the text will not fit at a legible cap (>= 4.25u): tighter tracking, then drop the sign, then drop the
// "%" (only "100%" and signed two-digit values ever need them).
import { fitText, asCutouts, live } from './_font.mjs'
import { rr } from './_layout.mjs'

const FRAME = rr(2, 5, 22, 19, 4)               // landscape pill, 20 x 14
const BOX = { x0: 5, y0: 8.5, x1: 19, y1: 15.5 } // centreline area: wall ink + 1u white + text ink
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
    const fit = (s, tracking = 0) => { const t = fitText(s, BOX, { prefer: 'large', minCap: 4.25, tracking }); return t && t.paths }
    const glyphs = fit(sg + n + '%') || fit(sg + n + '%', -0.25) || fit(n + '%') || fit(n + '%', -0.25) || fit(n) || []
    return {
      paths: [{ d: FRAME, plate: 'K' }, ...glyphs.map(d => ({ d, plate: 'A' }))],
      fills: [FRAME],
      cutouts: asCutouts(glyphs),
    }
  },
})
