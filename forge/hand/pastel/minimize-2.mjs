// forge/hand/pastel/minimize-2.mjs — the pastel collapse: two soft lavender arrows pulling in from opposite corners,
// their square heads meeting near the centre with a clear gap, at the arrow family's 3.5 weight with a deeper 0.8 rim;
// the generated thin pale blush hooks lost their shafts at 16px.
import { arrow } from '../../styles/_pastel-kit.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const o = { w: 3.5, head: 6 }
  const E = entriesOf([
    ['lavender@K', arrow(4, 4, 9.75, 9.75, o), arrow(20, 20, 14.25, 14.25, o)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender']), glint: true })
}
