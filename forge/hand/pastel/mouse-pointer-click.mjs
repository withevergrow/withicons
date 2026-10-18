// forge/hand/pastel/mouse-pointer-click.mjs — the pastel click: the cursor sibling's broad lavender pointer (head and
// tail one field) with its tip at the burst's centre, and five short butter rays (S, they twinkle) set on an arc that
// stands well clear of the tip; the generated long peach rays crowded the tip and the pale sky pointer at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { poly, seg2, unite } = Prim
  const cx = 9.25, cy = 9.25, r0 = 4.25, r1 = 6.25, rw = 2
  const ray = deg => {
    const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
    const q = v => Math.round(v * 100) / 100
    return seg2(q(cx + r0 * c), q(cy + r0 * s), q(cx + r1 * c), q(cy + r1 * s), rw)
  }
  const E = entriesOf([
    ['lavender@K', unite(
      poly([[9.25, 9], [21, 16.5], [15.5, 17.5], [12.25, 21.75]], [1.2, 1.4, 0.8, 1.4]),
      seg2(15, 17, 17.75, 20.5, 3.1))],
    ['butter.flat@S', ...[135, 180, 225, 270, 315].map(ray)],
  ], icon)
  for (const e of E) e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['lavender']), ...deeper(['butter'], 1) }, glint: true })
}
