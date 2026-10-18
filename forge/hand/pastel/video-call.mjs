// forge/hand/pastel/video-call.mjs — the pastel video call: the camcorder build (sky body, lavender lens cone A) with a
// larger paper screen well in which the caller (peach head, lavender shoulders A) fills the frame, plus deeper 0.8 hue
// rims, so body, lens and person all read at 16px instead of a pale box with a tiny figure.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { rr, poly, circle, clip } = Prim
  const scr = rr(3.75, 6.75, 14.25, 17.25, 1.75)
  const E = entriesOf([
    ['sky@K', rr(1.75, 4.75, 16.25, 19.25, 3.25)],
    ['lavender@A', poly([[15.25, 10], [22.25, 6.25], [22.25, 17.75], [15.25, 14]], [1, 1.5, 1.5, 1])],
    ['paper.well@A', scr],
    ['lavender.flat@A', clip(rr(5.25, 14, 12.75, 21, [3.25, 3.25, 0, 0]), scr)],
    ['peach.flat@A', circle(9, 10.75, 2.4)],
  ], icon)
  for (const e of E) if (e.mode !== 'ink' && e.hue !== 'paper') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['sky', 'lavender', 'peach']), glint: true })
}
