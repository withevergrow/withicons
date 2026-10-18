// forge/hand/pastel/bike.mjs — the pastel bicycle: open lavender tyre rings with hub dots, a sturdier peach diamond
// frame (bars 2) with fork, stem and handlebar, and a butter saddle, all with deeper 0.8 rims; the generated slim
// pale frame faded between the wheels at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { ring, circle, seg2, bar, pill } = Prim
  const wl = [5.5, 16.5], wr = [18.5, 16.5], S = [9, 10], H = [15, 10], C = [12, 16.5]
  const w = 2
  const E = entriesOf([
    ['lavender@K', ring(...wl, 4.4, 2.5), ring(...wr, 4.4, 2.5)],
    // frame in separate entries so its open triangles stay open
    ['peach.flat@A', bar([wl, S, C, wl], w)],
    ['lavender.flat@K', circle(...wl, 1.15), circle(...wr, 1.15)],
    ['peach.flat@A', bar([S, H, C], w), bar([wr, H, [13.75, 5.75], [16.5, 5.75]], w), seg2(...S, 8.5, 7.25, w)],
    ['butter.flat@A', pill(6.5, 5.75, 11, 7.75)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'peach', 'butter']), glint: true })
}
