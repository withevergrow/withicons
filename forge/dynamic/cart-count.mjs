// Live icon: a shopping cart with the number of items in it. forge/DYNAMIC.md, parts in ./_parts-counts.mjs
import { countIcon, countParams, countExamples, countShows, keptRatio } from './_parts-counts.mjs'
import { live } from './_font.mjs'

// the static `shopping-cart` skeleton (on the 0.25 grid)
const BASE = {
  paths: [
    { d: 'M2.5 3.5 H3.75 A1 1 0 0 1 4.75 4.25 L6.75 13.75 A1 1 0 0 0 7.75 14.5 H17.25 A1 1 0 0 0 18.25 13.75 L20.5 7 H5.25', plate: 'K' },
    { d: 'M10 19.5 A1.5 1.5 0 1 1 7 19.5 A1.5 1.5 0 1 1 10 19.5 Z M18.5 19.5 A1.5 1.5 0 1 1 15.5 19.5 A1.5 1.5 0 1 1 18.5 19.5 Z', plate: 'A' },
  ],
  fills: [
    'M5.25 7 H20.5 L18.25 13.75 A1 1 0 0 1 17.25 14.5 H7.75 A1 1 0 0 1 6.75 13.75 Z',
    'M10 19.5 A1.5 1.5 0 1 1 7 19.5 A1.5 1.5 0 1 1 10 19.5 Z',
    'M18.5 19.5 A1.5 1.5 0 1 1 15.5 19.5 A1.5 1.5 0 1 1 18.5 19.5 Z',
  ],
  cutouts: [],
}

export default live({
  name: 'cart-count', title: 'Cart with count', category: 'commerce',
  description: 'A shopping cart with the number of items in it: a number, "99+", a dot, or an empty cart at zero.',
  aliases: ['cart-items', 'cart-badge', 'basket-count', 'items-in-cart', 'shopping-cart-count', 'trolley-count'],
  tags: ['cart', 'ecommerce', 'badge', 'count', 'checkout'],
  synonyms: ['cart quantity', 'number of items', 'bag count', 'added to cart', 'checkout items', 'basket items', 'order items'],
  params: countParams({ count: 2 }),
  examples: countExamples(),
  shows: p => countShows(BASE, p), kept: p => keptRatio(BASE, p),
  build(p) { return countIcon(BASE, p) },
})
