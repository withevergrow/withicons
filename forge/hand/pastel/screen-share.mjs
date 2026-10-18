// forge/hand/pastel/screen-share.mjs — the pastel screen share in the monitor build: a lavender bezel (K) round a sky
// screen well, a lavender neck and foot (A), and a broad peach up-arrow (S) rising on the screen; deeper 0.8 rims so
// the bezel and stand hold on white, where the generated pale sky slab and thin stand faded.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { rr, pill, unite } = Prim
  const E = entriesOf([
    ['lavender@K', rr(2, 3, 22, 16.75, 3)],
    ['sky.well@K', rr(4.25, 5.25, 19.75, 14.5, 1.75)],
    ['lavender.flat@A', unite(rr(10.5, 16.25, 13.5, 20, 0.75), pill(7, 18.75, 17, 21.75))],
    ['peach@S', Kit.arrow(12, 12.5, 12, 7.25, { w: 2.75, head: 3.5 })],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'sky', 'peach']), glint: true })
}
