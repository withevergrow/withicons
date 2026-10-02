// Live icon: a pill badge carrying a short word ("NEW", "PRO", "BETA", "99+").
// Short text sits inside a closed pill. Longer words run the full width and the pill opens at its ends
// (top and bottom arcs stay, like brackets), because a 24px frame cannot fit 3-4 letters between two walls.
import { fitFirst, fitLadder, textInk, boxDist } from './_parts-labels.mjs'
import { rr } from './_layout.mjs'
import { live } from './_font.mjs'

const SHAPES = {
  // r 5 pill: hook ends (4,6.5) sit on the corner arc (3-4-5 triangle) so they stay on the grid
  pill: { r: 5, top: ['M4 6.5 A5 5 0 0 1 7 5.5', 'H17 A5 5 0 0 1 20 6.5'], bot: ['M20 17.5 A5 5 0 0 1 17 18.5', 'H7 A5 5 0 0 1 4 17.5'], ends: [[4, 6.5], [20, 6.5], [20, 17.5], [4, 17.5]], flat: [7, 17] },
  rounded: { r: 2.5, top: ['M2.5 6.5 A2.5 2.5 0 0 1 4.5 5.5', 'H19.5 A2.5 2.5 0 0 1 21.5 6.5'], bot: ['M21.5 17.5 A2.5 2.5 0 0 1 19.5 18.5', 'H4.5 A2.5 2.5 0 0 1 2.5 17.5'], ends: [[2.5, 6.5], [21.5, 6.5], [21.5, 17.5], [2.5, 17.5]], flat: [4.5, 19.5] },
}
const INSIDE = { x0: 5.25, y0: 8.75, x1: 18.75, y1: 15.25 }
const ACROSS = { x0: 3.5, y0: 8.75, x1: 20.5, y1: 15.25 }

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
    const S = SHAPES[shape] || SHAPES.pill
    const body = rr(2, 5.5, 22, 18.5, S.r)
    const s = text || 'NEW'
    const closed = fitFirst([s], INSIDE, { minCap: 5, maxCap: 7 })
    const fit = closed || fitLadder(s, ACROSS, { minCap: 4, maxCap: 6.5 })
    const t = fit && fit.t
    const ink = textInk(t, 'A')
    const paths = []
    if (!t || closed) paths.push({ d: body, plate: 'K' })
    else {
      // keep each end hook only if it clears the letters; otherwise stop at the flat edge
      const ok = S.ends.map(p => boxDist(p, t.box) >= 3)
      const [fx0, fx1] = S.flat
      paths.push({ d: (ok[0] ? S.top[0] + ' ' : `M${fx0} 5.5 `) + (ok[1] ? S.top[1] : `H${fx1}`), plate: 'K' })
      paths.push({ d: (ok[2] ? S.bot[0] + ' ' : `M${fx1} 18.5 `) + (ok[3] ? S.bot[1] : `H${fx0}`), plate: 'K' })
    }
    return { paths: [...paths, ...ink.paths], fills: [body], cutouts: ink.cutouts }
  },
})
