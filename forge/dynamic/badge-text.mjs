// Live icon: a pill badge carrying a short word ("NEW", "PRO", "BETA", "99+").
// The badge is always closed: the word is set inside it, in the condensed cut when it is long (_parts-labels.mjs
// fitLabel), never through an opened wall. The badge spans the whole live width so a 4-letter word fits at cap 4-5.
import { fitFirst, fitLadder, textInk } from './_parts-labels.mjs'
import { rr } from './_layout.mjs'
import { live } from './_font.mjs'

const SHAPES = { pill: 4.5, rounded: 2.5 } // corner radius of the 20 x 12 badge
// the word's centreline box: 2.9u inside the walls (0.875 wall ink + 1.25 white + 0.75 text ink); at the pill's
// corners the box keeps that clearance for a cap-5 word (checked against the corner arcs)
const INSIDE = { pill: { x0: 5.25, y0: 8.9, x1: 18.75, y1: 15.1 }, rounded: { x0: 4.9, y0: 8.9, x1: 19.1, y1: 15.1 } }

export default live({
  name: 'badge-text', title: 'Text badge', category: 'status',
  description: 'A pill badge with a short word such as NEW, PRO, BETA or HOT.',
  aliases: ['new-badge', 'pill-badge', 'text-chip', 'status-pill', 'label-badge', 'beta-badge'],
  tags: ['badge', 'label', 'new', 'status'],
  synonyms: ['new', 'beta', 'pro', 'hot', 'free', 'chip', 'pill', 'flag', 'feature', 'premium', 'tag'],
  params: {
    text: { type: 'text', maxLength: 4, default: 'NEW', case: 'upper', label: 'Text' },
    shape: { type: 'enum', options: ['pill', 'rounded'], default: 'pill', label: 'Shape' },
  },
  examples: [{ text: 'NEW', shape: 'pill' }, { text: 'PRO', shape: 'rounded' }, { text: 'BETA', shape: 'pill' }, { text: 'OK', shape: 'pill' }, { text: '99+', shape: 'rounded' }, { text: '1', shape: 'pill' }],
  build({ text, shape }) {
    const r = SHAPES[shape] ?? SHAPES.pill, box = INSIDE[shape] || INSIDE.pill
    const body = rr(2, 6, 22, 18, r)
    const s = text || 'NEW'
    // the whole word down to cap 4, then cap 3.5 ("DOCX" in the pill) before the ladder shortens it
    const fit = fitFirst([s], box, { minCap: 4, maxCap: 5.5 }) || fitFirst([s], box, { minCap: 3.5, maxCap: 3.75 }) ||
      fitLadder(s, box, { minCap: 3.75, maxCap: 5.5 })
    const ink = textInk(fit && fit.t, 'A')
    return { paths: [{ d: body, plate: 'K' }, ...ink.paths], fills: [body], cutouts: ink.cutouts }
  },
})
