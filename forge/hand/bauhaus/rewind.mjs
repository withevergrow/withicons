// forge/hand/bauhaus/rewind.mjs — two soft play triangles running left, the red leader laid over the blue
// follower so they overlap into one double-arrow; replaces two small separated blobs that read as beans.
import { poly } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const R = [2.25, 1.75, 1.75] // tip, base corners (play: 2.25-2.75 at its tip)

export default function render(icon) {
  return compose([
    ['c3', poly([[10.25, 12], [21.5, 4.75], [21.5, 19.25]], R)],
    ['c1', poly([[2.5, 12], [13.75, 4.75], [13.75, 19.25]], R)],
  ], icon)
}
