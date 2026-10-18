// forge/hand/pastel/champagne-toast.mjs — the pastel toast to the new skeleton: two tilted flutes clinking at the rim,
// butter champagne (c1) set inside each sky glass bowl with tiny ink bubbles, the glass running on with stem and foot, and
// three butter sparkle bars (S) over the clink; the old all-sky figure read as a pair of legs.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.9) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { path, seg2, clip, cut, rr, unite, flipX, circle } = Prim
  const bowl = path('M6.25 6.5 L12 8.9 C11 12.9 8.25 15.75 6 17 C4.85 14.5 4.6 10.4 6.25 6.5 Z')
  const inner = path('M6.95 7.75 L10.95 9.45 C10 12.75 7.9 14.95 6.45 15.85 C5.7 13.7 5.6 10.6 6.95 7.75 Z')
  const liqL = clip(inner, rr(0, 10, 24, 24, 0))
  const glassL = unite(cut(bowl, liqL), seg2(6.1, 16.5, 5, 20, 2), seg2(3, 19.4, 7, 20.6, 2))
  const E = entriesOf([
    ['butter@K', liqL, flipX(liqL)],
    ['sky@K', glassL, flipX(glassL)],
    ['ink@K', circle(8.4, 11.9, 0.6), circle(7.1, 13.6, 0.5), circle(15.6, 11.9, 0.6), circle(16.9, 13.6, 0.5)],
    ['butter.flat@S', seg2(12, 2, 12, 4.75, 2), seg2(6.75, 2.5, 8.25, 4.5, 2), seg2(17.25, 2.5, 15.75, 4.5, 2)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['butter', 'sky']), glint: true })
}
