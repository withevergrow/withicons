// forge/hand/pastel/kite.mjs — the pastel kite: a full lavender diamond with a blush cap above the bowed spar (A), an
// ink spine and spar, and a butter tail (S) swinging under the bottom tip, every field with a deeper 0.8 rim; the
// generated kite was a hollow sky outline with a dark cross that faded to a wire frame on white.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { poly, path, clip, stroke, seg2 } = Prim
  const kite = poly([[12, 2], [20, 10], [12, 18], [4, 10]], [1.25, 1.5, 1.25, 1.5])
  const E = entriesOf([
    ['lavender@K', kite],
    ['blush@A', clip(kite, path('M2 10.25 C7 6.4 17 6.4 22 10.25 V0 H2 Z'))],
    ['ink@A', seg2(12, 3.5, 12, 16.5, 1.35), stroke('M5.6 10.1 C9 7.35 15 7.35 18.4 10.1', 1.35)],
    ['butter@S', poly([[12, 17], [15.25, 22], [8.75, 22]], [0.9, 1, 1])],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['lavender', 'blush']), ...deeper(['butter'], 1) }, glint: true })
}
