// forge/hand/liquid/bookmark.mjs: the bookmark ribbon with its V-notch kept. The generator stroked the outline 2.6u wide,
// which filled the shallow notch and left a flat-bottomed blob; here the ribbon is drawn as its exact shape (a fill) and the
// glass outline is pulled in by the stroke half-width, so the notch stays a crisp 5u-deep V with two pointed tails.
// Same model and paint as the generator (_liquid-core.mjs build); only the geometry is drawn.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, erode } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const D = 'M7.8 3.2H16.2A2.3 2.3 0 0 1 18.5 5.5V21L12 15.6L5.5 21V5.5A2.3 2.3 0 0 1 7.8 3.2Z'

export default function render(icon) {
  const set = setOf(parsePath(D, 0.04).map(s => s.pts))
  const lines = erode(set, 1.3).map(r => ({ pts: r, closed: true, plate: 'K', pathId: 'p0' }))
  const out = build({
    name: (icon && icon.name) || 'bookmark', paths: [], cutouts: [],
    fills: [{ subs: set.map(r => ({ pts: r, closed: true })), set }],
    lines,
  })
  if (!out) return null
  const defs = out[0] && out[0][0] === 'defs' ? out[0][2] : []
  const g0 = defs.find(g => /-0$/.test(g[1].id))
  if (g0) g0[2] = g0[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.22, 0.44, 0.7][i] }])
  return out
}
