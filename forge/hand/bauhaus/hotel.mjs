// forge/hand/bauhaus/hotel.mjs — a tall blue hotel block with rounded top corners: a red sign band, two floors of
// cream windows (3 x 2) and a yellow door, on a slim ink ground bar. The floor rhythm reads as a building at 16px.
import { rr, pill } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const win = (x, y) => rr(x, y, x + 2.5, y + 2.5, 0.5)
  return compose([
    ['c3', rr(4, 2.5, 20, 21.5, [2.5, 2.5, 0, 0])],
    ['c1', pill(6.5, 4.5, 17.5, 7.25)],
    ['tint', win(6.5, 9.5), win(10.75, 9.5), win(15, 9.5), win(6.5, 13), win(10.75, 13), win(15, 13)],
    ['c2', rr(10, 16.75, 14, 21.5, [2, 2, 0, 0])],
    ['ink', pill(2, 21.25, 22, 22.75)],
  ], icon)
}
