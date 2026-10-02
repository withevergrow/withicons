// Live icon: a shop price tag pointing left, with a string hole and a price ("$9", "€49", "£199").
// The price gets the room it needs, in this order: inside the closed tag beside the hole; the right end opens;
// the hole goes; the currency sign goes. The amount itself is never shortened.
import { fitFirst, textInk, boxDist, clearPoint } from './_parts-labels.mjs'
import { circle } from './_layout.mjs'
import { live } from './_font.mjs'

const TAG = 'M8 5.5 H19.5 A2.5 2.5 0 0 1 22 8 V16 A2.5 2.5 0 0 1 19.5 18.5 H8 L2.5 12 Z'
const HOLE = circle(7, 12, 1.25)
const Y = { y0: 8.75, y1: 15.25 }
const CURRENCY = { usd: '$', eur: '€', gbp: '£', inr: '₹', none: '' }

export default live({
  name: 'price-tag', title: 'Price tag', category: 'commerce',
  description: 'A shop price tag with a currency sign and an amount you choose.',
  aliases: ['price-label', 'price-sticker', 'cost-tag', 'pricing-tag', 'shop-tag', 'amount-tag'],
  tags: ['price', 'shopping', 'commerce', 'money'],
  synonyms: ['price', 'cost', 'pricing', 'how much', 'retail', 'store', 'checkout', 'dollar', 'euro', 'pound', 'rupee', 'buy', 'value', 'fee'],
  params: {
    amount: { type: 'int', min: 0, max: 999, default: 9, label: 'Amount' },
    currency: { type: 'enum', options: ['usd', 'eur', 'gbp', 'inr', 'none'], default: 'usd', label: 'Currency sign' },
  },
  examples: [{ amount: 9, currency: 'usd' }, { amount: 49, currency: 'eur' }, { amount: 199, currency: 'gbp' }, { amount: 999, currency: 'usd' }, { amount: 5, currency: 'inr' }, { amount: 0, currency: 'none' }],
  build({ amount, currency }) {
    const n = String(amount), cur = CURRENCY[currency] ?? '$'
    const full = cur + n
    const tries = [
      { hole: true, open: false, box: { x0: 11.5, x1: 18.75, ...Y }, s: [full], minCap: 5 },
      { hole: true, open: true, box: { x0: 11.5, x1: 20.5, ...Y }, s: [full], minCap: 5 },
      { hole: false, open: true, box: { x0: 6.25, x1: 20.5, ...Y }, s: [full], minCap: 4.5 },
      { hole: false, open: true, box: { x0: 6.25, x1: 20.5, ...Y }, s: [full, n], minCap: 4 },
    ]
    let pick = null, fit = null
    // with the right end open the price hugs it, leaving the pointed end as long as possible
    for (const tr of tries) { fit = fitFirst(tr.s, tr.box, { minCap: tr.minCap, maxCap: 6.5, align: tr.open && !tr.hole ? 'right' : 'center' }); if (fit) { pick = tr; break } }
    const t = fit && fit.t, ink = textInk(t, 'A')
    const paths = []
    if (!t || !pick.open) paths.push({ d: TAG, plate: 'K' })
    else {
      const b = t.box
      const topEnd = boxDist([21.5, 6.5], b) >= 3 ? ' A2.5 2.5 0 0 1 21.5 6.5' : ''
      const botStart = boxDist([21.5, 17.5], b) >= 3 ? 'M21.5 17.5 A2.5 2.5 0 0 1 19.5 18.5' : 'M19.5 18.5'
      if (pick.hole) paths.push({ d: `${botStart} H8 L2.5 12 L8 5.5 H19.5${topEnd}`, plate: 'K' })
      else {
        // the pointed end gives way to the letters: each arm stops where it would crowd them
        const up = clearPoint([8, 5.5], [2.5, 12], b, 3.25), lo = clearPoint([8, 18.5], [2.5, 12], b, 3.25)
        const whole = up[0] === 2.5 && lo[0] === 2.5
        if (whole) paths.push({ d: `${botStart} H8 L2.5 12 L8 5.5 H19.5${topEnd}`, plate: 'K' })
        else {
          paths.push({ d: `M${up[0]} ${up[1]} L8 5.5 H19.5${topEnd}`, plate: 'K' })
          paths.push({ d: `${botStart} H8 L${lo[0]} ${lo[1]}`, plate: 'K' })
        }
      }
    }
    if (!pick || pick.hole) paths.push({ d: HOLE, plate: 'A' })
    return {
      paths: [...paths, ...ink.paths],
      fills: [TAG],
      cutouts: [...(!pick || pick.hole ? [HOLE] : []), ...ink.cutouts],
    }
  },
})
