// Live icon: a starburst sale sticker with a short deal ("-50%", "SALE", "%").
// The text always sits inside the closed burst (no band, no opened outline): regular cut, then condensed, then a
// little closer to the teeth, before "-50%" gives way to "50%".
import { textInk, polyD, snap } from './_parts-labels.mjs'
import { fitChain } from './_parts-misc.mjs'
import { polar } from './_layout.mjs'
import { live } from './_font.mjs'

// A closed starburst with the word or discount set inside it (the regular cut, then condensed; "-50%" gives way to
// "50%" before it would shrink below cap 4). Teeth are shallow enough (rIn 8.5-9.25) to leave a 6u-radius middle.
function burst(n, rIn) {
  const pts = []
  // a tooth tip points straight left and right, where the word runs (an inner notch there would pinch it)
  for (let i = 0; i < n * 2; i++) pts.push(polar(12, 12, i % 2 ? rIn : 10, i * 180 / n))
  return pts
}

export default live({
  name: 'sale-sticker', title: 'Sale sticker', category: 'commerce',
  description: 'A starburst sale sticker with a discount or word such as -50%, SALE or HOT.',
  aliases: ['discount-sticker', 'starburst', 'promo-sticker', 'deal-badge', 'sale-burst', 'burst-badge'],
  tags: ['sale', 'discount', 'promotion', 'shopping'],
  synonyms: ['sale', 'discount', 'deal', 'offer', 'promo', 'percent off', 'clearance', 'special offer', 'black friday', 'coupon', 'markdown', 'bargain'],
  params: {
    text: { type: 'text', maxLength: 4, default: '-50%', case: 'upper', label: 'Text' },
    points: { type: 'int', min: 8, max: 20, default: 14, label: 'Number of points' },
  },
  examples: [{ text: '-50%', points: 14 }, { text: 'SALE', points: 14 }, { text: '%', points: 12 }, { text: '20%', points: 16 }, { text: 'HOT', points: 10 }, { text: '1', points: 20 }],
  build({ text, points }) {
    const n = Math.max(8, Math.min(20, points | 0))
    // deeper teeth with few points, shallower with many, so the outline weight stays even
    const rIn = snap(n <= 10 ? 8.75 : n <= 14 ? 9 : 9.25)
    const B = burst(n, rIn), d = polyD(B, true)
    const s = text || '%'
    const pct = s.replace(/^-/, '')
    const opts = { outline: d, cx: 12, ys: [12, 12.25, 11.75], clearance: 2.75, maxCap: 6, condense: [1, 0.88, 0.8, 0.74] }
    // the whole text first, then the same at 2.5u from the teeth (the default "-50%" and "100%" fit there at cap 4),
    // then "50%" for "-50%"; truncating is the last resort. A sign or "%" below cap 4 closes its counters, so only
    // plain words and numbers go down to cap 3.5, a word in the tightest setting.
    const word = /^[A-Z]+$/.test(s), plain = /^[0-9A-Z]+$/.test(s)
    const hit = fitChain([s], { ...opts, minCap: 4 }) || fitChain([s], { ...opts, minCap: 4, clearance: 2.5 }) ||
      (plain && fitChain([s], { ...opts, minCap: 3.5, clearance: 2.5 })) || fitChain([pct], { ...opts, minCap: 4 }) ||
      (word && (fitChain([s], { ...opts, minCap: 3.5, tracking: -0.5 }) || fitChain([s], { ...opts, minCap: 3.5, maxCap: 3.75, tracking: -0.75 }))) ||
      fitChain([pct.replace(/%$/, ''), [...s].slice(0, 3).join(''), [...s].slice(0, 2).join('')], { ...opts, minCap: 3.5 })
    const ink = textInk(hit && hit.t, 'A')
    return { paths: [{ d, plate: 'K' }, ...ink.paths], fills: [d], cutouts: ink.cutouts }
  },
})
