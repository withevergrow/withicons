// forge/hand/bauhaus/phone-incoming.mjs — the family split handset of phone (red ear half, blue mouth half)
// with a big ink-and-red arrow diving into its crook, replacing the thin handset and small arrow that were lost at 16px.
import * as P from '../../styles/_bauhaus-prim.mjs'
import { head, split } from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

// the family handset of phone and phone-off, symmetric about x + y = 24 and split once along that axis at its waist
const PHONE = 'M3 5 A2.25 2.25 0 0 1 5.25 2.75 H8.5 A1.75 1.75 0 0 1 10.25 4.5 V6.25 C10.25 7.5 9.25 7.75 9.25 8.75 A6 6 0 0 0 15.25 14.75 C16.25 14.75 16.5 13.75 17.75 13.75 H19.5 A1.75 1.75 0 0 1 21.25 15.5 V18.75 A2.25 2.25 0 0 1 19 21 A16 16 0 0 1 3 5 Z'

export default function render(icon) {
  const deg = 135, tx = 13.25, ty = 10.75, len = 6.5
  const ux = Math.cos(deg * Math.PI / 180), uy = Math.sin(deg * Math.PI / 180)
  return compose([
    ...split(P.path(PHONE), 'c1', 'c3', 12, 12, -45),
    ['ink', P.seg2(20.5, 3.5, tx - ux * len * 0.55, ty - uy * len * 0.55, 2.5)],
    ['c1', head(tx, ty, deg, len, 4.75, 1.5, { notch: 0, rb: 1.3 })],
  ], icon)
}
