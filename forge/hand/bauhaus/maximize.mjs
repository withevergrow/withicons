// forge/hand/bauhaus/maximize.mjs — the fullscreen idiom built from round-capped bars: two chunky ink shafts
// running out to a red and a blue corner bracket; replaces thin shafts with small swept heads that read as a sword.
import { seg2, bar } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const W = 3
  return compose([
    ['ink', seg2(13.75, 10.25, 19, 5, W)],
    ['c1', bar([[13.75, 3.75], [20.25, 3.75], [20.25, 10.25]], W)],
    ['ink', seg2(10.25, 13.75, 5, 19, W)],
    ['c3', bar([[10.25, 20.25], [3.75, 20.25], [3.75, 13.75]], W)],
  ], icon)
}
