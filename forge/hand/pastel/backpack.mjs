// forge/hand/pastel/backpack.mjs — the pastel backpack after the new skeleton: a peach domed pack, a lavender top flap
// whose curved hem crosses the body, a peach carry loop (A) and a butter front pocket (A) with an ink zip, so it reads
// as a bag with a flap and pocket instead of the old flat peach shed.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { path, clip, stroke, rr, seg2 } = Prim
  const body = path('M7.25 21.75 H16.75 A2.5 2.5 0 0 0 19.25 19.25 V12.25 A5.75 5.75 0 0 0 13.5 6.5 H10.5 A5.75 5.75 0 0 0 4.75 12.25 V19.25 A2.5 2.5 0 0 0 7.25 21.75 Z')
  const flap = clip(body, path('M2 2 H22 V11.25 C16.5 13.75 7.5 13.75 2 11.25 Z'))
  return compose([
    ['peach', body],
    ['lavender', flap],
    ['peach@A', stroke('M9.75 7.25 V4.75 A2.25 2.25 0 0 1 14.25 4.75 V7.25', 2.5)],
    ['butter@A', rr(8.25, 15.25, 15.75, 19.5, 1.75)],
    ['ink@A', seg2(10.25, 17.25, 13.75, 17.25, 1.5)],
  ], icon)
}
