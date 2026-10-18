// forge/hand/liquid/candy-corn.mjs — candy corn as three stacked glass bands cut from one tapered kernel: a clear tip,
// a bright accent-glass middle band and a deep coloured-glass base, parted by hairline seams. The generated drawing
// grew the middle band's tube past the silhouette into two wings, so the kernel read as a hooded cone or a sock, and
// its pale base and tip blurred together. Same model and paint as the generator (_liquid-core.mjs build); only the
// geometry is drawn here, with the clear and coloured glass a touch denser so the bands hold on white.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, differenceSets, unionSets, strokeSet } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'
import * as F from '../../styles/_liquid-field.mjs'

const ringsOf = d => parsePath(d, 0.15).map(s => s.pts)
const fill = set => ({ d: '', subs: set.map(r => ({ pts: r, closed: true })), set })
const E = { K: 1.3, A: 1.15, S: 1.1 }
const cy = r => r.reduce((a, p) => a + p[1], 0) / r.length
// a piece is its exact fill plus its outline inset by half the style's tube width (the tube adds nothing to the
// silhouette; the inset ring only tells the core which plate the fill belongs to), inset on the style's own distance
// field so acute corners stay clean
const inset = (set, e, plate) => F.trace(F.offset(F.region(set, 2), e), 0.02, 0.2).map(pts => ({ pts, closed: true, plate }))
const piece = (set, plate) => ({ fill: fill(set), lines: inset(set, E[plate], plate) })

const KERNEL = 'M12 2.25C13.6 2.25 14.65 3.6 15.4 5.4L19.6 16.3C20.7 19.5 17 21.75 12 21.75C7 21.75 3.3 19.5 4.4 16.3L8.6 5.4C9.35 3.6 10.4 2.25 12 2.25Z'
// the two seams follow the kernel's roundness (they bow down, like the front of a real candy corn)
const SEAM1 = 'M5 8.6C8.5 10.1 15.5 10.1 19 8.6'
const SEAM2 = 'M3 13.6C8.5 15.6 15.5 15.6 21 13.6'

function skeleton(name) {
  const kernel = setOf(ringsOf(KERNEL))
  // the accent band clears its own moat in the core, so its seams are drawn as a fine line here
  const seams = unionSets([SEAM1, SEAM2].map(d => strokeSet(parsePath(d, 0.15)[0].pts, 0.3)))
  const bands = differenceSets(kernel, seams).sort((a, b) => cy(a) - cy(b))
  const [tip, mid, base] = [[bands[0]], [bands[1]], [bands[2]]]
  const parts = [piece(tip, 'K'), piece(base, 'A'), piece(mid, 'S')]
  return { name, paths: [], cutouts: [], lines: parts.flatMap(p => p.lines), fills: parts.map(p => p.fill) }
}

const DEEP = { 0: [0.3, 0.5, 0.74], 1: [0.55, 0.92] }
export default function render(icon) {
  const out = build(skeleton((icon && icon.name) || 'candy-corn'))
  const defs = out && out[0] && out[0][0] === 'defs' ? out[0][2] : []
  for (const g of defs) {
    const t = DEEP[g[1].id.split('-').pop()]
    if (t) g[2] = g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': t[i] }])
  }
  return out
}
