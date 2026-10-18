// forge/hand/pastel/snowflake.mjs — the pastel snowflake: six bold sky spokes (w 2.75) each with one V branch (w 2.25)
// at 60° that opens clear of the spoke and the next arm, united into one field with a deeper 0.8 sky rim and no white hub to
// wash the centre out; the generated
// flake's thin arms, crowded branches and big white hexagon melted into a pale smudge on white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { seg2, bar, join, unite, around } = Prim
  // one arm pointing up: the spoke and a V branch opening toward the tip
  // branch: base on the spoke at r 6, arms 2.6 long at 60° to the spoke, so the V opens and clears the next arm
  const B = 6, Lb = 2.6, W = 2.25, lat = Lb * Math.sin(Math.PI / 3), up = Lb * Math.cos(Math.PI / 3)
  const arm = join(seg2(12, 12, 12, 3.25, 2.75), bar([[12 - lat, 12 - B - up], [12, 12 - B], [12 + lat, 12 - B - up]], W))
  const E = entriesOf([
    ['sky@K', unite(around(arm, 6, 12, 12))],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: deeper(['sky']), glint: true })
}
