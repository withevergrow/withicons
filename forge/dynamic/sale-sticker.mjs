// Live icon: a starburst sale sticker with a short deal ("-50%", "SALE", "%").
// Short text sits inside the burst. Longer text runs across a band: the burst keeps its points above and below
// and opens where the letters pass, and filled styles knock the text out of a band laid across the burst.
import { fitFirst, fitLadder, textInk, cutPolygon, polyD, bandAround, snap } from './_parts-labels.mjs'
import { polar } from './_layout.mjs'
import { live } from './_font.mjs'

const INSIDE = { x0: 7.5, y0: 9.5, x1: 16.5, y1: 14.5 }
const ACROSS = { x0: 3.5, y0: 8.5, x1: 20.5, y1: 15.5 }

function burst(n, rIn) {
  const pts = []
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
    const rIn = snap(n <= 10 ? 7.5 : n <= 14 ? 8 : 8.5)
    const B = burst(n, rIn)
    const s = text || '%'
    let fit = fitFirst([s], INSIDE, { minCap: 4.5, maxCap: 7 })
    let runs = fit ? cutPolygon(B, fit.t.box, 3.25) : null
    if (!fit || runs) {
      // too long for the middle: run it across, the burst opens where the letters pass
      const pct = s.replace(/^-/, '')
      fit = fitLadder(s, ACROSS, { minCap: 4, maxCap: 6 }, [pct, pct.replace(/%$/, '')])
      runs = fit ? cutPolygon(B, fit.t.box, 3.25) : null
    }
    const t = fit && fit.t
    const ink = textInk(t, 'A')
    const fills = [polyD(B, true)]
    const paths = runs ? runs.map(r => ({ d: polyD(r, false), plate: 'K' })) : [{ d: polyD(B, true), plate: 'K' }]
    if (runs && t) {
      // band across the burst for the filled styles: union drawn as one outline would be off-grid, so the burst
      // fill becomes burst-above + band + burst-below in one polygon: walk the burst and clamp it to the band
      const band = bandAround(t.box, { dx: 1.25, dy: 1.75 })
      const out = []
      for (const [x, y] of B) {
        if (y > band.y0 && y < band.y1) out.push([x < 12 ? Math.min(x, band.x0) : Math.max(x, band.x1), y])
        else out.push([x, y])
      }
      // square the band ends: insert its corners where the outline enters and leaves the band rows
      const ring = []
      for (let i = 0; i < out.length; i++) {
        const a = out[i], c = out[(i + 1) % out.length], A = B[i], C = B[(i + 1) % B.length]
        ring.push(a)
        for (const yb of [band.y0, band.y1]) {
          if ((A[1] - yb) * (C[1] - yb) < 0) {
            const side = (A[0] + C[0]) / 2 < 12 ? band.x0 : band.x1
            const tt = (yb - A[1]) / (C[1] - A[1]), xb = A[0] + (C[0] - A[0]) * tt
            const inA = A[1] > band.y0 && A[1] < band.y1
            ring.push(inA ? [side, yb] : [snap(xb), yb], inA ? [snap(xb), yb] : [side, yb])
          }
        }
      }
      fills[0] = polyD(ring, true)
    }
    return { paths: [...paths, ...ink.paths], fills, cutouts: ink.cutouts }
  },
})
