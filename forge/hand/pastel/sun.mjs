// forge/hand/pastel/sun.mjs — the pastel sun: a full butter disc with a clear 1.6u halo of open page, then eight slim
// peach rays (w 2.25, the diagonals a touch shorter) as round-capped bars (A, they spin), every field with a deeper 0.8 rim;
// the generated pale disc and fat ray blobs crowded the centre and melted into white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { circle, seg2 } = Prim
  const cx = 12, cy = 12
  const rays = [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180)
    const r0 = 7.5, r1 = a % 90 ? 8.9 : 9.25
    return seg2(cx + c * r0, cy + s * r0, cx + c * r1, cy + s * r1, 2.25)
  })
  const E = entriesOf([
    ['butter@K', circle(cx, cy, 4.75)],
    ['peach@A', ...rays],
  ], icon)
  for (const e of E) e.rim = e.hue === 'butter' ? 0.8 : 0.7
  return paintEntries(E, { hues: { ...deeper(['peach']), ...deeper(['butter'], 1) }, glint: true })
}
