// Live icon: a hanging label tag (eyelet at the top) with a short word ("SALE", "NEW", "VIP").
// Short text sits inside the tag. Longer words run the full width under the eyelet: the tag keeps its roof
// and its base, its side walls open where the letters pass, and filled styles get a band under the letters.
import { fitFirst, fitLadder, textInk, boxDist, clearPoint, wallCut, bandAround, bandLobes } from './_parts-labels.mjs'
import { circle } from './_layout.mjs'
import { live } from './_font.mjs'

const SH = 8 // shoulder height: the roof corners are cut at 45 degrees from y 3.5 to 8
const TAG = 'M7.5 3.5 H16.5 L21 8 V18.5 A2.5 2.5 0 0 1 18.5 21 H5.5 A2.5 2.5 0 0 1 3 18.5 V8 Z'
const EYE = circle(12, 7.5, 1)
const INSIDE = { x0: 6.25, y0: 11.75, x1: 17.75, y1: 17.75 }
const ACROSS = { x0: 3.5, y0: 11.75, x1: 20.5, y1: 16.75 }

export default live({
  name: 'tag-label', title: 'Label tag', category: 'commerce',
  description: 'A hanging label tag with a short word such as SALE, NEW, VIP or GIFT.',
  aliases: ['hang-tag', 'label-tag', 'swing-tag', 'gift-tag', 'luggage-tag', 'name-tag', 'text-tag'],
  tags: ['tag', 'label', 'shopping', 'text'],
  synonyms: ['label', 'sale', 'new', 'gift', 'vip', 'category', 'marker', 'sticker', 'clothing tag', 'stock', 'inventory', 'merchandise'],
  params: {
    text: { type: 'text', maxLength: 4, default: 'SALE', case: 'upper', label: 'Text' },
  },
  examples: [{ text: 'SALE' }, { text: 'NEW' }, { text: 'VIP' }, { text: 'A1' }, { text: 'GIFT' }, { text: '%' }],
  build({ text }) {
    const s = text || 'SALE'
    const inside = fitFirst([s], INSIDE, { minCap: 5, maxCap: 6 })
    const fit = inside || fitLadder(s, ACROSS, { minCap: 4, maxCap: 5 })
    const t = fit && fit.t, ink = textInk(t, 'A')
    const paths = [], fills = [TAG]
    if (!t || inside) paths.push({ d: TAG, plate: 'K' })
    else {
      const b = t.box
      // each side's top end: on the shoulder if the letters reach that high, else down the wall
      const side = (x, arm) => {
        const cut = wallCut(x, b)
        if (cut && cut[0] < SH) return clearPoint(arm, [x, SH], b, 3.25)
        return [x, cut ? cut[0] : 18.5]
      }
      const L = side(3, [7.5, 3.5]), R = side(21, [16.5, 3.5])
      const leg = (P, x) => P[1] >= SH ? ` L${x} ${SH}${P[1] > SH ? ` V${P[1]}` : ''}` : ` L${P[0]} ${P[1]}`
      const roof = `M${L[0]} ${L[1]}${L[1] > SH ? ` V${SH}` : ''} L7.5 3.5 H16.5${leg(R, 21)}`
      paths.push({ d: roof, plate: 'K' })
      const foot = x => boxDist([x, 20], b) >= 3
      paths.push({ d: `${foot(3.5) ? 'M3.5 20 A2.5 2.5 0 0 0 5.5 21' : 'M5.5 21'} H18.5${foot(20.5) ? ' A2.5 2.5 0 0 0 20.5 20' : ''}`, plate: 'K' })
      const band = bandAround(b, { dy: 1.5 }), lobes = bandLobes(band, 3, 21)
      fills[0] = `M7.5 3.5 H16.5 L21 8 ${lobes.R}V18.5 A2.5 2.5 0 0 1 18.5 21 H5.5 A2.5 2.5 0 0 1 3 18.5 ${lobes.L}V8 Z`
    }
    paths.push({ d: EYE, plate: 'A' })
    return { paths: [...paths, ...ink.paths], fills, cutouts: [EYE, ...ink.cutouts] }
  },
})
