// Live icon: a shop price tag pointing left, with a string hole and a price ("$9", "€49", "£199").
// The tag ALWAYS keeps its point and its eyelet (a small punched hole in the point, so the price can start right
// after it). The price gets the room it needs, in this order: inside the closed tag; the right end opens; the text
// shrinks; the currency sign goes. The amount itself is never shortened.
import { fitFirst, textInk, boxDist } from './_parts-labels.mjs'
import { circle } from './_layout.mjs'
import { live } from './_font.mjs'

const TAG = 'M8 5.5 H19.5 A2.5 2.5 0 0 1 22 8 V16 A2.5 2.5 0 0 1 19.5 18.5 H8 L2.5 12 Z'
// the eyelet: a small ring in the point, 2.25u (centreline) inside both slanted edges; a closed ring (not a dot
// stub) so every style draws it, knocked out of filled tags as a real hole. Text starts 3u right of it (x 9).
const DOT = circle(5.75, 12, 0.25)
const DOT_CUT = circle(5.75, 12, 0.75)
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
      { open: false, box: { x0: 9, x1: 18.75, ...Y }, s: [full], minCap: 5 },
      { open: true, box: { x0: 9, x1: 20.5, ...Y }, s: [full], minCap: 5 },
      // the open end lets the text run to x 22 (the static keyline)
      { open: true, box: { x0: 9, x1: 22, ...Y }, s: [full], minCap: 4.5 },
      { open: true, box: { x0: 9, x1: 22, ...Y }, s: [full, n], minCap: 4.5 },
      { open: true, box: { x0: 9, x1: 22, ...Y }, s: [full, n], minCap: 4 },
    ]
    let pick = null, fit = null
    for (const tr of tries) { fit = fitFirst(tr.s, tr.box, { minCap: tr.minCap, maxCap: 6.5 }); if (fit) { pick = tr; break } }
    const t = fit && fit.t, ink = textInk(t, 'A')
    const paths = []
    if (!t || !pick.open) paths.push({ d: TAG, plate: 'K' })
    else {
      // the right end gives way to the letters: each corner arc stops where it would crowd them
      const b = t.box
      const topEnd = boxDist([21.5, 6.5], b) >= 3 ? ' A2.5 2.5 0 0 1 21.5 6.5' : ''
      const botStart = boxDist([21.5, 17.5], b) >= 3 ? 'M21.5 17.5 A2.5 2.5 0 0 1 19.5 18.5' : 'M19.5 18.5'
      paths.push({ d: `${botStart} H8 L2.5 12 L8 5.5 H19.5${topEnd}`, plate: 'K' })
    }
    paths.push({ d: DOT, plate: 'A' })
    return {
      paths: [...paths, ...ink.paths],
      fills: [TAG],
      cutouts: [DOT_CUT, ...ink.cutouts],
    }
  },
})
