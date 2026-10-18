// forge/hand/liquid/hand-heart.mjs: a large coloured glass heart held over a clear glass open hand with a cuff and a
// clear finger groove, painted with the style's own glass recipe. The generated heart was small against a soft mitten
// whose groove closed up, so at 16px the hand lost its fingers and the heart its weight.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })
const cut = d => ({ subs: parsePath(d) })

// the heart, about 15% larger than the skeleton's and lifted to the top keyline
const HEART = 'M12 11.2 C12 11.2 6.3 8 6.3 4.1 C6.3 2.5 7.55 1.2 9.15 1.2 C10.35 1.2 11.4 1.85 12 2.85 C12.6 1.85 13.65 1.2 14.85 1.2 C16.45 1.2 17.7 2.5 17.7 4.1 C17.7 8 12 11.2 12 11.2 Z'
const CUFF = 'M3 14.2 V21.6'
const PALM = 'M3 15 H7.5 C8.6 15 9.6 15.4 10.4 16.1 L11.15 16.75 H14 A1.4 1.4 0 0 1 14 19.55 H9.5'
const FINGERS = 'M3 21 H13.5 C14.6 21 15.6 20.6 16.4 19.9 L20.6 16.2 A1.6 1.6 0 0 0 18.4 13.9 L15.4 16.4'
const MASS = 'M3 15 H7.5 C8.6 15 9.6 15.4 10.4 16.1 L11.15 16.75 H14 L15.4 16.4 L18.4 13.9 A1.6 1.6 0 0 1 20.6 16.2 L16.4 19.9 C15.6 20.6 14.6 21 13.5 21 H3 Z'
// the groove between thumb and fingers, cut through the glass
const GROOVE = 'M9.3 19.55 H14 A1.4 1.4 0 0 0 14 16.75'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'hand-heart', paths: [],
    lines: [...lines(CUFF, 'K'), ...lines(PALM, 'K'), ...lines(FINGERS, 'K'), ...lines(HEART, 'A')],
    fills: [fill(HEART), fill(MASS)],
    cutouts: [cut(GROOVE)],
  }) || []
}
