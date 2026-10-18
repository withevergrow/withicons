// Live icon: a hanging ribbon banner with a swallowtail end and a short word ("BEST", "TOP", "#1", "NEW").
// Short text sits inside the closed banner. Longer words run the full width: the banner keeps its top edge and
// its notched tail and opens its side walls where the letters pass.
import { fitFirst, fitLadder, textInk, polyD } from './_parts-labels.mjs'
import { live } from './_font.mjs'

// landscape 20 x 17.5 banner with a notched V tail; the word sits closed on the band above the notch
const BAND = [[2, 3], [22, 3], [22, 20.5], [12, 16.5], [2, 20.5]]
const INSIDE = { x0: 4.9, y0: 5.9, x1: 19.1, y1: 13.1 }

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
    const fit = fitFirst([s], INSIDE, { minCap: 4, maxCap: 5.75 }) || fitLadder(s, INSIDE, { minCap: 3.75, maxCap: 5.75 })
    const ink = textInk(fit && fit.t, 'A')
    const band = polyD(BAND, true)
    return { paths: [{ d: band, plate: 'K' }, ...ink.paths], fills: [band], cutouts: ink.cutouts }
  },
})
