// forge/hand/bauhaus/phone-missed.mjs — the family split handset of phone (red ear half, blue mouth half) with a plain
// diagonal arrow in the crook: an ink shaft from the upper-right corner and a red head aimed down-left at the handset
// (the call that never landed). One simple arrow with open air around it, so it never reads as a check mark.
import * as P from '../../styles/_bauhaus-prim.mjs'
import { split, head } from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

// the family handset of phone and phone-off, symmetric about x + y = 24 and split once along that axis at its waist
const PHONE = 'M3 5 A2.25 2.25 0 0 1 5.25 2.75 H8.5 A1.75 1.75 0 0 1 10.25 4.5 V6.25 C10.25 7.5 9.25 7.75 9.25 8.75 A6 6 0 0 0 15.25 14.75 C16.25 14.75 16.5 13.75 17.75 13.75 H19.5 A1.75 1.75 0 0 1 21.25 15.5 V18.75 A2.25 2.25 0 0 1 19 21 A16 16 0 0 1 3 5 Z'

export default function render(icon) {
  const tx = 12.6, ty = 10.9
  return compose([
    ...split(P.path(PHONE), 'c1', 'c3', 12, 12, -45),
    ['ink', P.seg2(20.5, 3.1, 15.2, 8.4, 2.5)],
    ['c1', head(tx, ty, 135, 5.5, 4.5, 1.25, { notch: 0.4, rb: 1.1 })],
  ], icon)
}
