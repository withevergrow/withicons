// forge/hand/liquid/beer.mjs: a clear-glass mug body (the beer, K tint) with a wide open handle and two fluted grooves,
// crowned by a separate cloud of coloured-glass foam (wm-a) that overlaps its rim. The generated drawing merged foam
// and body into one coloured fill, so the whole mug turned into a single lilac blob that read as a bucket.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const BODY = 'M3.5 9.5 H15.5 V19.5 A2 2 0 0 1 13.5 21.5 H5.5 A2 2 0 0 1 3.5 19.5 Z'
const HANDLE = 'M15.5 11 H18.5 A2 2 0 0 1 20.5 13 V16.5 A2 2 0 0 1 18.5 18.5 H15.5'
const GROOVES = ['M7.5 13.25 V18', 'M11.5 13.25 V18']
const FOAM = 'M3.5 9.75 C1.75 7.75 3.75 4.5 6.25 5.5 C7.25 3 11.75 2.5 12.75 5 C14.75 4.5 17 7 15.5 9.75 Z'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'beer', paths: [],
    lines: [...lines(BODY, 'K'), ...lines(HANDLE, 'K'), ...GROOVES.flatMap(d => lines(d, 'K')), ...lines(FOAM, 'A')],
    fills: [fill(BODY), fill(FOAM)],
    cutouts: [],
  }) || []
}
