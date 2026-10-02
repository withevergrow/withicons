// Live icon: a hanging ribbon banner with a swallowtail end and a short word ("BEST", "TOP", "#1", "NEW").
// Short text sits inside the closed banner. Longer words run the full width: the banner keeps its top edge and
// its notched tail and opens its side walls where the letters pass.
import { fitFirst, fitLadder, textInk, cutPolygon, polyD } from './_parts-labels.mjs'
import { live } from './_font.mjs'

// landscape 20 x 17.5 banner; the V tail rises to y 16 so a cap-6.5 word fits above it
const BAND = [[2, 3], [22, 3], [22, 20.5], [12, 16], [2, 20.5]]
const INSIDE = { x0: 5.25, y0: 6.25, x1: 18.75, y1: 12.75 }
const ACROSS = { x0: 3.5, y0: 6.25, x1: 20.5, y1: 12.75 }

export default live({
  name: 'ribbon-label', title: 'Ribbon banner', category: 'commerce',
  description: 'A hanging ribbon banner with a notched tail and a short word such as BEST, TOP, #1 or NEW.',
  aliases: ['banner-label', 'ribbon-banner', 'award-ribbon', 'banner-ribbon', 'promo-banner', 'title-banner'],
  tags: ['ribbon', 'banner', 'award', 'label'],
  synonyms: ['best', 'top', 'winner', 'featured', 'award', 'prize', 'achievement', 'bestseller', 'first place', 'promotion', 'announcement', 'headline'],
  params: {
    text: { type: 'text', maxLength: 4, default: 'BEST', case: 'upper', label: 'Text' },
  },
  examples: [{ text: 'BEST' }, { text: 'TOP' }, { text: '#1' }, { text: 'NEW' }, { text: 'WWWW' }, { text: 'A' }],
  build({ text }) {
    const s = text || 'BEST'
    const inside = fitFirst([s], INSIDE, { minCap: 5, maxCap: 6.5 })
    const fit = inside || fitLadder(s, ACROSS, { minCap: 4, maxCap: 6 })
    const t = fit && fit.t, ink = textInk(t, 'A')
    const runs = t ? cutPolygon(BAND, t.box, 3.25) : null
    const band = runs ? runs.map(r => ({ d: polyD(r, false), plate: 'K' })) : [{ d: polyD(BAND, true), plate: 'K' }]
    return {
      paths: [...band, ...ink.paths],
      fills: [polyD(BAND, true)],
      cutouts: ink.cutouts,
    }
  },
})
