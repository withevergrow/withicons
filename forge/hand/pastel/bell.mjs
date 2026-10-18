// forge/hand/pastel/bell.mjs — the pastel bell with more presence on white: the family butter dome framed by a peach
// knob and a full-width peach lip (deeper hue = a firm edge), and the peach clapper (A) set apart from the lip by a gap.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { path, rr, circle, cut } = Prim
  return compose([
    ['butter', path('M4.75 16.75 C5.75 15.75 5.75 14.75 5.75 13.25 V11.25 A6.25 6.25 0 0 1 18.25 11.25 V13.25 C18.25 14.75 18.25 15.75 19.25 16.75 Z')],
    ['peach', circle(12, 4.25, 1.75), rr(3.5, 15.75, 20.5, 18.75, 1.5)],
    ['peach@A', cut(circle(12, 19.75, 2.4), rr(2.5, 14.75, 21.5, 19.5, 2))],
  ], icon)
}
