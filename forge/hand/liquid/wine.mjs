// forge/hand/liquid/wine.mjs: a stemmed glass whose lower bowl is the wine (clear glass, K tint) and whose empty upper
// bowl is a separate coloured-glass cap (wm-a), so the bowl is two clear tones over a firm stem and foot. The generated
// bowl was one pale fill crossed by a thin stripe, which washed out on white and read as a goblet with a band.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

const WINE = 'M5.75 7.75 H18.25 C18.1 9 17.75 10 17 11 C15.75 13 14 14 12 14 C10 14 8.25 13 7 11 C6.25 10 5.9 9 5.75 7.75 Z'
const CAP = 'M6.5 2.5 H17.5 C18 4.25 18.25 5.75 18.25 7.25 H5.75 C5.75 5.75 6 4.25 6.5 2.5 Z'
const STEM = 'M12 14 V21'
const FOOT = 'M8 21.25 H16'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'wine', paths: [],
    lines: [...lines(WINE, 'K'), ...lines(STEM, 'K'), ...lines(FOOT, 'K'), ...lines(CAP, 'A')],
    fills: [fill(WINE), fill(CAP)],
    cutouts: [],
  }) || []
}
