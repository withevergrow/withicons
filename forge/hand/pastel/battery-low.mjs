// forge/hand/pastel/battery-low.mjs — the pastel low battery: the battery family's lavender shell, nub and paper well
// with a single chunky lit blush cell (A) in the first of three slots, ringed with a deeper 0.8 rim, so the low state
// reads at 16px where the thin flat pink sliver washed out on white.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()

export default function render(icon) {
  const { rr } = Prim
  const E = entriesOf([
    ['lavender@K', rr(1.75, 6, 19.25, 18, 3.25)],
    ['lavender.flat@K', rr(19.75, 9.75, 22.25, 14.25, [0, 1.1, 1.1, 0])],
    ['paper.well@K', rr(3.9, 8.15, 17.1, 15.85, 1.6)],
    ['blush@A', rr(5.25, 9.5, 9, 14.5, 1.1)],
  ], icon)
  for (const e of E) if (e.hue === 'blush' && e.mode !== 'ink') e.rim = 0.8
  const blush = { ...HUES.blush, rim: mix(HUES.blush.base, HUES.blush.deep, 0.9) }
  return paintEntries(E, { hues: { blush }, glint: true })
}
