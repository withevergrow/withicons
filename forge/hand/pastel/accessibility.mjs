// forge/hand/pastel/accessibility.mjs — the pastel accessibility mark: the status-circle build (sky disc r 10 with a deeper
// rim, like alert- and info-circle) carrying a bold ink figure (A) of open arms, body and legs; the generated figure was a
// thin white cut-out that turned pale and spidery at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { circle, seg2, bar, unite } = Prim
  const w = 2.25
  const figure = unite(
    seg2(6.75, 10.25, 17.25, 10.25, w),
    seg2(12, 10.25, 12, 13.75, w),
    bar([[9, 18], [12, 13.75], [15, 18]], w),
  )
  const E = entriesOf([
    ['sky@K', circle(12, 12, 10)],
    ['ink@A', circle(12, 6.25, 1.75), figure],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['sky']), glint: true })
}
