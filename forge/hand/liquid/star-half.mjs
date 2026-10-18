// forge/hand/liquid/star-half.mjs: a clear glass star outline with its left half laid in as one solid piece of coloured
// glass, painted with the style's own glass recipe. The generated drawing filled the left half with the same clear glass
// as the rim and ran a coloured bar down the middle, so it read as a star with a stick in it, not as half a star.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

// skeleton coordinates (the style scales them into its frame); a slightly fuller star than the line set's.
// The clear rim runs only round the empty right half (tip to inner notch): the coloured half is its own whole
// piece on the left, so no clear rim shows through it
const STAR = 'M11.4 3.95 L12 2.6 L14.85 8.95 L21.75 9.7 L16.6 14.4 L18.05 21.2 L12 17.75 L11.4 18.1'
// the coloured half: its centreline edge sits 1.3u left of the axis so the round stroke ends on the axis
const HALF = 'M10.7 5.5 L9.15 8.95 L2.25 9.7 L7.4 14.4 L5.95 21.2 L10.7 18.5 Z'

export default function render(icon) {
  return build({
    name: (icon && icon.name) || 'star-half', paths: [],
    // A first: the half's fill shares its outer edge with the star, and ties go to the first line listed
    lines: [...lines(HALF, 'A'), ...lines(STAR, 'K')],
    fills: [fill(HALF)],
    cutouts: [],
  }) || []
}
