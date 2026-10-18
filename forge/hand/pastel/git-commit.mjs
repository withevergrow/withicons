// forge/hand/pastel/git-commit.mjs — the pastel commit: a bigger peach commit node (r 5.5, up from 4) with a paper
// well, on a broad lavender line (3), both with a deeper 0.8 hue rim, so the commit dominates the bar and holds its
// contrast on white at 16px instead of vanishing.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { seg2, circle } = Prim
  const E = entriesOf([
    ['lavender@K', seg2(2.5, 12, 8, 12, 3), seg2(16, 12, 21.5, 12, 3)],
    ['peach@K', circle(12, 12, 5.5)],
    ['paper.well@K', circle(12, 12, 2.25)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach', 'paper']), glint: true })
}
