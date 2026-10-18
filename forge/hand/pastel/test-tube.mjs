// forge/hand/pastel/test-tube.mjs — the pastel test tube: a wide sky glass tube with a round bottom and a lavender
// lip collar at its mouth, half full of mint liquid (A) with a glass shine, drawn upright and tilted 45° like the
// skeleton, every field with a deeper 0.8 rim; the generated narrow sky capsule had no lip and no visible liquid and
// read as a pill or a syringe.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

export default function render(icon) {
  const { rr, rect, clip, rot, seg2, move } = Prim
  // upright, centred on (12, 12), then turned 45° clockwise so the mouth sits top-right as in the skeleton
  const T = s => move(rot(s, 45, 12, 12), 0.5, 0.25)
  const tube = rr(8.75, 3.5, 15.25, 22.25, [1, 1, 3.25, 3.25])
  const E = entriesOf([
    ['sky@K', T(tube)],
    ['mint@A', T(clip(tube, rect(6, 12.75, 18, 24)))],
    ['lavender@K', T(rr(7.25, 1.5, 16.75, 5, 1.6))],
    ['shine', T(seg2(10.75, 7, 10.75, 11, 1.1))],
  ], icon)
  for (const e of E) if (e.mode !== 'ink' && e.mode !== 'shine') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['sky', 'mint', 'lavender']), glint: false })
}
