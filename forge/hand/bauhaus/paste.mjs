// forge/hand/bauhaus/paste.mjs — the new paste: a blue clipboard board with its yellow arched clip, and a red pasted
// sheet with cream text lines moated off its lower-right corner; replaces two plain squares that read as copy.
import { rr, arch, seg2 } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['c3', rr(3, 4.5, 17, 20, 2.5)],
    ['c2', arch(7, 2, 13, 7.25, 'n', 1.25)],
    ['cut', rr(9.25, 9.75, 22.25, 22.75, 3.5)],
    ['c1', rr(10.5, 11, 21, 21.5, 2.5)],
    ['tint', seg2(13.5, 14.5, 18, 14.5, 2), seg2(13.5, 18, 16, 18, 2)],
  ], icon)
}
