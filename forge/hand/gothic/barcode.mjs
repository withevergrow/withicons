// forge/hand/gothic/barcode.mjs — a carved limestone label with straight, flat-ended bars of varied widths
// (sapphire glass and dark iron) so it reads as a barcode, not an arcade of pillars or candles.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const BARS = [[5, 1], [6.9, 2.2], [10, 1], [11.9, 1], [13.8, 2.2], [16.9, 1], [18.6, 0.8]]

export default function render(icon) {
  const parts = [g.stone(g.rr(2.4, 4.2, 21.6, 19.8, 1.8))]
  for (const [x, w] of BARS) {
    const r = g.rect(x, 7, x + w, 17)
    parts.push(w > 1.5 ? g.glass(r, 'c2', { outline: 0.34, glint: false, tracery: 'none' }) : g.iron(r, { outline: 0.2 }))
  }
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
