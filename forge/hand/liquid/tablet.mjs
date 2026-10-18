// forge/hand/liquid/tablet.mjs: a portrait tablet as one slab of clear glass with a slim bezel, one big rounded screen
// cut clean through it (a pale tint and a slanted glare keep it a glass screen), and a coloured-glass home bar in the
// wider bottom bezel. The generated tablet had a heavy frame round a small screen, so it read as a generic box or
// monitor; the thin bezel, large rounded screen and home bar say "tablet" at 16px. Painted with the style's own glass
// recipe (_liquid-core build); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ d, subs: parsePath(d) })

// body: a 16 x 19 slab with 2.6u corners; screen: nearly edge to edge, 1.9u corners
const BODY = 'M6.6 2.5H17.4A2.6 2.6 0 0 1 20 5.1V18.9A2.6 2.6 0 0 1 17.4 21.5H6.6A2.6 2.6 0 0 1 4 18.9V5.1A2.6 2.6 0 0 1 6.6 2.5Z'
const SCREEN = 'M7 4.9H17A1.9 1.9 0 0 1 18.9 6.8V15.4A1.9 1.9 0 0 1 17 17.3H7A1.9 1.9 0 0 1 5.1 15.4V6.8A1.9 1.9 0 0 1 7 4.9Z'
// a closed hair-line ring inside the screen cut marks the plate K (the cut removes it); the home bar is plate A
const VOTE = 'M11.8 10.8H12.2V11.2H11.8Z'
const HOME = 'M10.7 19.4H13.3'
// the screen as it lies on the page after the recipe's scale: a tint and two glare bands
const TINT = 'M7.4 5.55H16.4A1.6 1.6 0 0 1 18 7.15V14.4A1.6 1.6 0 0 1 16.4 16H7.4A1.6 1.6 0 0 1 5.8 14.4V7.15A1.6 1.6 0 0 1 7.4 5.55Z'
const GLARE = ['M11.4 6.1H13.6L9.4 15.5H7.2Z', 'M14.7 6.1H15.9L11.7 15.5H10.5Z']

export default function render(icon) {
  const name = (icon && icon.name) || 'tablet'
  const nodes = build({
    name,
    paths: [],
    lines: [...lines(VOTE, 'K'), ...lines(HOME, 'A')],
    fills: [fill(BODY)],
    cutouts: [fill(SCREEN)],
  })
  if (!nodes) return null
  nodes.push(['path', { d: TINT, fill: 'var(--with-liquid-c1, #4A9DFF)', 'fill-opacity': 0.14, class: 'wm-k' }])
  for (const d of GLARE) nodes.push(['path', { d, fill: 'var(--with-liquid-shine, #FFFFFF)', 'fill-opacity': 0.55, class: 'wm-shine' }])
  return nodes
}
