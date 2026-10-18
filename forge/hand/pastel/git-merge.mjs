// forge/hand/pastel/git-merge.mjs — the pastel merge: a lavender trunk joining two peach nodes on the left and one
// clean curve from the top node out to a third node set well clear on the right (18.25, 12); bigger nodes (r 3.25)
// with paper wells and a deeper 0.8 hue rim, so the merge reads at 16px without the pale halo noise.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { seg2, stroke, circle } = Prim
  const W = 2.75, R = 3.25, r = 1.25
  const E = entriesOf([
    ['lavender@K', seg2(6.5, 6, 6.5, 18, W), stroke('M7.25 7.5 C8.25 10.5 10.75 12 15.5 12', W)],
    ['peach@K', circle(6.5, 5.5, R), circle(6.5, 18.5, R), circle(18.25, 12, R)],
    ['paper.well@K', circle(6.5, 5.5, r), circle(6.5, 18.5, r), circle(18.25, 12, r)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach', 'paper']), glint: true })
}
