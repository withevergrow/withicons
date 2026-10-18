// forge/hand/liquid/users.mjs — two glass people: a clear front figure and a violet-glass figure standing behind it,
// its head a fat crescent and its shoulder a broad curve, both parted from the front figure by an even 1u gap. The
// generated pair was so faintly tinted that the front figure washed out on white, and the back figure was a thin
// lumpy crescent touching the front head plus a hook-shaped sliver; here the glass is a step denser with a firmer
// hairline and the back figure is drawn whole. Painted with the style's own glass recipe (_liquid-core build); only
// the geometry is drawn here.
import { parsePath, circle } from '../../kernel/geom.mjs'
import { setOf, differenceSets } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const ring = d => parsePath(d)[0].pts
const linesOf = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))

// front person (K): the skeleton's head and shoulders, grown to glass by the recipe's 2.6u stroke
const HEAD = 'M12.5 8A3.5 3.5 0 1 1 5.5 8A3.5 3.5 0 1 1 12.5 8Z'
const BODY = 'M2.5 21V19.5A4 4 0 0 1 6.5 15.5H11.5A4 4 0 0 1 15.5 19.5V21'
// the front figure's glass silhouette grown by a further 1u gap (head r 3.5 + 1.3 + 1, body offset 2.3)
const CLEAR = [circle(9, 8, 5.8), ring('M0.2 22.6V19.5A6.3 6.3 0 0 1 6.5 13.2H11.5A6.3 6.3 0 0 1 17.8 19.5V22.6Z')]
// back person (A), drawn as finished glass outlines: a head up and to the right, a shoulder rising behind
const BACK_HEAD = setOf([circle(16.4, 6.9, 4.4)])
const BACK_LINES = 'M17.6 4.6Q18.6 6.9 17.6 9.2M18.4 15.4Q20.3 16.4 20.3 20.6'
// (its inner edge runs along the gap circle, the tip and the foot corner rounded like every glass edge)
const BACK_BODY = setOf([ring('M19.1 22.3A1.3 1.3 0 0 1 17.8 21V19.5A6.3 6.3 0 0 0 16 15.09C15.3 14.4 15.6 13.3 16.6 13.3H17.9A4.9 4.9 0 0 1 22.8 18.2V21A1.3 1.3 0 0 1 21.5 22.3Z')])

export default function render(icon) {
  const name = (icon && icon.name) || 'users'
  const clear = setOf(CLEAR)
  const A = [differenceSets(BACK_HEAD, clear), differenceSets(BACK_BODY, clear)].filter(s => s.length)
  const icon2 = {
    name, cutouts: [],
    paths: [{ id: 'p0', d: HEAD, plate: 'K' }, { id: 'p1', d: BODY, plate: 'K' }],
    lines: [
      ...linesOf(HEAD, 'K'), ...linesOf(BODY, 'K'),
      // short centre lines inside each A outline: they mark the pieces as A and their 2.3u stroke stays inside
      ...linesOf(BACK_LINES, 'A'),
    ],
    fills: [
      { set: setOf([ring(HEAD)]) }, { set: setOf([ring(BODY + 'Z')]) },
      ...A.map(set => ({ set })),
    ],
  }
  const nodes = build(icon2)
  if (!nodes) return null
  const g0 = `wg-liquid-${name}-0`, g1 = `wg-liquid-${name}-1`
  const deeper = { [g0]: [0.24, 0.5, 0.76], [g1]: [0.45, 0.88] }
  return nodes.map(n => {
    if (n[0] === 'defs') {
      // denser glass: the same tint ramps a step deeper, so both figures hold on white
      return ['defs', {}, n[2].map(g => deeper[g[1].id]
        ? [g[0], g[1], g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': deeper[g[1].id][i] }])]
        : g)]
    }
    const a = n[1]
    if (a['stroke-width'] === 0.22) return [n[0], { ...a, 'stroke-opacity': 0.45, 'stroke-width': 0.26 }]
    return n
  })
}
