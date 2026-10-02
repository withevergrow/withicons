// Live icon: a five-star rating. A single row of five stars cannot stay legible in 24u, so the default layout packs
// them 3-over-2 like a honeycomb (read top row, then bottom). Earned stars are solid little stars, a half star is the
// left half, stars still to earn are dots (or tiny stars). The "score" layout shows one big star over the number.
import { fitText, asCutouts, live } from './_font.mjs'
import { star, halfStar, dot } from './_parts-progress.mjs'

const R = 2.6, RATIO = 0.42
const SLOTS = [[4.75, 8.25], [12, 8.25], [19.25, 8.25], [8.25, 15.5], [15.75, 15.5]]

export default live({
  name: 'rating-stars', title: 'Star rating', category: 'status',
  description: 'A rating out of five: five stars in a compact two-row layout (half stars included), or one star over the score.',
  aliases: ['star-rating', 'five-stars', 'stars-rating', 'review-stars', 'rating-score', 'stars-score', 'rating-five'],
  tags: ['rating', 'stars', 'review', 'score', 'feedback'],
  synonyms: ['rating', 'review', 'reviews', 'stars', '5 stars', 'five star', 'score', 'feedback', 'rate', 'rated', 'quality', 'customer reviews', 'testimonial', 'satisfaction', 'ranking', 'half star', 'app rating', 'product rating'],
  params: {
    rating: { type: 'number', min: 0, max: 5, step: 0.5, default: 3.5, label: 'Rating (out of 5)' },
    layout: { type: 'enum', options: ['stars', 'score'], default: 'stars', label: 'Layout' },
    empty: { type: 'enum', options: ['dots', 'small stars', 'hidden'], default: 'dots', label: 'Stars not earned' },
  },
  examples: [
    { rating: 0, layout: 'stars', empty: 'dots' },
    { rating: 1, layout: 'stars', empty: 'dots' },
    { rating: 3.5, layout: 'stars', empty: 'dots' },
    { rating: 4.5, layout: 'stars', empty: 'small stars' },
    { rating: 5, layout: 'stars', empty: 'dots' },
    { rating: 4.5, layout: 'score', empty: 'dots' },
  ],
  build({ rating, layout, empty }) {
    const r = Math.round(Math.max(0, Math.min(5, Number(rating) || 0)) * 2) / 2
    if (layout === 'score') {
      // one star (half star when the score is under 1) over the score: "4.5", "5", "0"
      const s = Number.isInteger(r) ? String(r) : r.toFixed(1)
      const big = r > 0 && r < 1 ? halfStar(12, 7.75, 5.5, 0.45) : star(12, 7.75, 5.5, 0.45)
      const t = fitText(s, { x0: 5, y0: 16.5, x1: 19, y1: 21.5 }, { prefer: 'small', maxCap: 5, minCap: 4 })
      const txt = t ? t.paths : []
      return {
        paths: [{ d: big, plate: 'K' }, ...txt.map(d => ({ d, plate: 'A' }))],
        fills: r > 0 ? [big] : [], cutouts: [],
      }
    }
    const paths = [], fills = []
    SLOTS.forEach(([x, y], i) => {
      if (r >= i + 1) { const d = star(x, y, R, RATIO); paths.push({ d, plate: 'K' }); fills.push(d) }
      else if (r >= i + 0.5) { const d = halfStar(x, y, R, RATIO); paths.push({ d, plate: 'K' }); fills.push(d) }
      else if (empty === 'small stars') paths.push({ d: star(x, y + 0.25, 1.25, 0.45), plate: 'A' })
      else if (empty === 'dots' || r === 0) paths.push({ d: dot(x, y + 0.25), plate: 'A' })
    })
    return { paths, fills, cutouts: [] }
  },
})
