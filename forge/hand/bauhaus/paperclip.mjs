// forge/hand/bauhaus/paperclip.mjs — one unbroken blue wire bent into the clip's loops; the old red/blue split
// turned the U-bends into the poles of a horseshoe magnet.
import * as Prim from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'
// untagged nodes are the body: tag them wm-k so motion keeps them with the object
const body = nodes => nodes.map(([t, a]) => [t, a.class ? a : { ...a, class: 'wm-k' }])

const WIRE = 'M12.25 4.5 L4.25 12.5 A4.24 4.24 0 0 0 10.25 18.5 L20.25 8.5 A2.12 2.12 0 0 0 17.25 5.5 L9.25 13.5'

export default function render(icon) {
  return body(compose([['c3', Prim.stroke(WIRE, 2.25)]], icon))
}
