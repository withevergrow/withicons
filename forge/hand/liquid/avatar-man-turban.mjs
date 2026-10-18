// forge/hand/liquid/avatar-man-turban.mjs — a glass man in a violet glass turban: the wrap rises in a peaked dome to a
// V over the forehead, its two folds crossing over the front, grooved through the glass, and an even seam parts it from the clear glass
// face below (grooved eyes and smile). The generated drawing let the pale wrap run into the pale face with faint folds,
// so on white it read as one washed-out blob; here the seam and folds are cut and the glass is a step denser with a
// firmer hairline. Painted with the style's own glass recipe (_liquid-core build); only the geometry is drawn here.
import { parsePath, bbox, pointInSet, distToPolyline } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, strokeSet } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const ring = d => parsePath(d)[0].pts
const area = d => setOf(parsePath(d).map(s => s.pts))
// plate markers: a grid of tiny closed rings at least r inside a region, so the recipe's round strokes (K 2.6u, A 2.3u)
// stay inside it and the region's fill keeps its exact outline (and votes for the marker's plate)
const dotsIn = (set, r, plate) => {
  const out = [], b = bbox(set.flat())
  for (let j = Math.ceil(b.y0 * 2); j <= b.y1 * 2; j++) for (let i = Math.ceil(b.x0 * 2); i <= b.x1 * 2; i++) {
    const p = [i / 2, j / 2]
    if (!pointInSet(p, set) || Math.min(...set.map(q => distToPolyline(p, q, true))) < r) continue
    out.push({ pts: [p, [p[0] + 0.01, p[1]], [p[0], p[1] + 0.01]], closed: true, plate })
  }
  return out
}
const linesOf = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))

const SHOULDERS = 'M4.5 21.5C4.5 19.25 6.25 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.75 18 19.5 19.25 19.5 21.5'
const FACE = area('M17.75 10.75A5.75 6 0 1 1 6.25 10.75A5.75 6 0 1 1 17.75 10.75Z')
// the wrap: a peaked dome whose lower edge dips at the temples and rises to a V over the forehead
const TURBAN = area('M6.6 9.6C5 8.6 4.35 6.6 4.85 5C5.75 2.45 8.7 1.2 12 1.2C15.3 1.2 18.25 2.45 19.15 5C19.65 6.6 19 8.6 17.4 9.6C15.8 8.85 13.75 8.4 12 7.35C10.25 8.4 8.2 8.85 6.6 9.6Z')
// the two folds sweeping up from the temples, crossing above the V and running out over the crown
const FOLDS = ['M3.6 7.1C7.2 6.5 10.5 5 13.4 1.9', 'M20.4 7.1C16.8 6.5 13.5 5 10.6 1.9']

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-man-turban'
  const face = differenceSets(FACE, dilate(TURBAN, 0.6))
  const grooves = unionSets(FOLDS.map(d => strokeSet(parsePath(d)[0].pts, 0.85)))
  const wrap = differenceSets(TURBAN, grooves)
  const icon2 = {
    name, paths: [],
    lines: [
      ...dotsIn(face, 1.35, 'K'),
      ...linesOf('M10 13.6C11 14.6 13 14.6 14 13.6', 'K'),
      ...dotsIn(wrap, 1.25, 'A'),
      ...linesOf(SHOULDERS, 'A'),
    ],
    fills: [{ set: face }, { set: wrap }, { set: setOf([ring(SHOULDERS + 'Z')]) }],
    cutouts: [
      { subs: parsePath('M10.25 10.85A0.75 1 0 1 1 8.75 10.85A0.75 1 0 1 1 10.25 10.85Z') },
      { subs: parsePath('M15.25 10.85A0.75 1 0 1 1 13.75 10.85A0.75 1 0 1 1 15.25 10.85Z') },
    ],
  }
  const nodes = build(icon2)
  if (!nodes) return null
  const g0 = `wg-liquid-${name}-0`, g1 = `wg-liquid-${name}-1`
  const deeper = { [g0]: [0.24, 0.5, 0.76], [g1]: [0.48, 0.9] }
  return nodes.map(n => {
    if (n[0] === 'defs') {
      // denser glass: the same tint ramps a step deeper, so face and wrap hold on white
      return ['defs', {}, n[2].map(g => deeper[g[1].id]
        ? [g[0], g[1], g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': deeper[g[1].id][i] }])]
        : g)]
    }
    const a = n[1]
    if (a['stroke-width'] === 0.22) return [n[0], { ...a, 'stroke-opacity': 0.45, 'stroke-width': 0.26 }]
    return n
  })
}
