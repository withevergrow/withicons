// forge/hand/bauhaus/minimize.mjs — the exit-fullscreen idiom built from round-capped bars: two chunky ink shafts
// from the corners into a red and a blue bracket at the centre; replaces thin shafts with small heads that read as pencils.
import { seg2, bar } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const W = 3
  return compose([
    ['ink', seg2(20.25, 3.75, 15, 9, W)],
    ['c1', bar([[14, 3.5], [14, 10], [20.5, 10]], W)],
    ['ink', seg2(3.75, 20.25, 9, 15, W)],
    ['c3', bar([[3.5, 14], [10, 14], [10, 20.5]], W)],
  ], icon)
}
