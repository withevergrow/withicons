// forge/hand/bauhaus/laptop.mjs — a short blue lid standing on a wider ink deck with a thumb notch at the hinge,
// replacing the generated framed screen over a loose bar that read as a monitor.
import { rr, half, clip, cut } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const screen = rr(6.75, 6.75, 17.25, 13.5, 1.25)
  return compose([
    ['c3', rr(4.5, 4.5, 19.5, 15.75, [2.5, 2.5, 0, 0])],
    ['c2', screen],
    ['c1', clip(half(12, 13.5, 3.75, 'n'), screen)],
    ['ink', cut(rr(1.5, 15.75, 22.5, 18.75, [1, 1, 1.5, 1.5]), rr(9.5, 14.75, 14.5, 17, 1.1))],
  ], icon)
}
