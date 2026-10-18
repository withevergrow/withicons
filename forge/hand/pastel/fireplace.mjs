// forge/hand/pastel/fireplace.mjs — the pastel fireplace: a peach chimney breast under a broad lavender mantel shelf,
// a deep arched lavender firebox set in as a well, one butter flame (A) on a short peach log (A), and a lavender hearth
// slab across the floor, every field with a deeper 0.8 rim; the generated pink block with a pale butter arch lost the
// opening and the mantel against white and spent its contrast on tiny flame detail.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, path, pill, arch } = Prim
  const E = entriesOf([
    ['peach@K', rr(4.5, 6, 19.5, 20.5, [0.75, 0.75, 0.75, 0.75])],
    ['lavender.well@K', arch(7.75, 11, 16.25, 20.5, 'n')],
    ['lavender@K', rr(2.5, 3.5, 21.5, 7.25, 1.75), pill(2.5, 19.75, 21.5, 22)],
    ['peach.flat@A', pill(9.25, 17.5, 14.75, 19.4)],
    ['butter@A', path('M12 18.25 C10.1 18.25 9.4 16.9 9.85 15.5 C10.3 14.15 11.6 13.4 12 11.75 C12.4 13.4 13.7 14.15 14.15 15.5 C14.6 16.9 13.9 18.25 12 18.25 Z')],
  ], icon)
  for (const e of E) if (e.mode !== 'ink' && e.mode !== 'well') e.rim = 0.8
  return paintEntries(E, { hues: { ...deeper(['peach', 'lavender']), ...deeper(['butter'], 1) }, glint: true })
}
