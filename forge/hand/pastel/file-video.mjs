// forge/hand/pastel/file-video.mjs — the pastel video file: the family sky sheet with a paper fold (A) and a large,
// soft-cornered ink play triangle (A) centred in the page body, so the play mark reads at 16px instead of a small notch.
import * as Prim from '../../styles/_pastel-prim.mjs'
import * as Kit from '../../styles/_pastel-kit.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { poly } = Prim
  const f = Kit.page(4.5, 2.25, 19.5, 21.75, 5.75, 2.75)
  return compose([
    ['sky', f.sheet],
    ['paper@A', f.fold],
    ['ink@A', poly([[9.5, 9.75], [16.75, 14.5], [9.5, 19.25]], 1.3)],
  ], icon)
}
