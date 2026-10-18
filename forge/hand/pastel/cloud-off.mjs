// forge/hand/pastel/cloud-off.mjs — the pastel cloud-off to the new skeleton: the full sky exemplar cloud crossed by a
// bold lit blush slash (S) with a deeper rim in a clean moat, replacing the old thin pale slash that blurred into the cloud.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()

export default function render(icon) {
  const { seg2 } = Prim
  const E = entriesOf([
    ['sky@K', Kit.cloud(12, 13.25, 1.05)],
    ['cut', seg2(2.75, 2.75, 21.25, 21.25, 5.4)],
    ['blush@S', seg2(3.25, 3.25, 20.75, 20.75, 3)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  const d = n => ({ ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) })
  return paintEntries(E, { hues: { sky: d('sky'), blush: d('blush') }, glint: true })
}
