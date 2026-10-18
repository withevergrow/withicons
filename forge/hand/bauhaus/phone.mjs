// forge/hand/bauhaus/phone.mjs — the handset as one split body: a single curved form cut once across
// its waist (red ear half, blue mouth half) instead of three loose colour blobs.
import * as Prim from '../../styles/_bauhaus-prim.mjs'
import { split } from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'
// untagged nodes are the body: tag them wm-k so motion keeps them with the object
const body = nodes => nodes.map(([t, a]) => [t, a.class ? a : { ...a, class: 'wm-k' }])

const PHONE = 'M3 5 A2.25 2.25 0 0 1 5.25 2.75 H8.5 A1.75 1.75 0 0 1 10.25 4.5 V6.25 C10.25 7.5 9.25 7.75 9.25 8.75 A6 6 0 0 0 15.25 14.75 C16.25 14.75 16.5 13.75 17.75 13.75 H19.5 A1.75 1.75 0 0 1 21.25 15.5 V18.75 A2.25 2.25 0 0 1 19 21 A16 16 0 0 1 3 5 Z'

export default function render(icon) {
  // the handset is symmetric about x + y = 24: the seam runs along that axis through its waist
  return body(compose(split(Prim.path(PHONE), 'c1', 'c3', 12, 12, -45), icon))
}
