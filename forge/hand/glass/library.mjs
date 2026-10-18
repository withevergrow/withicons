// forge/hand/glass/library.mjs: three narrow frosted books of different heights standing on a glass shelf with clear gaps,
// a fourth leaning on its neighbour in accent glass; etched spine bands make it read as books, not a block.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const D = set => setD(set, 0.03)
const f = v => +v.toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = erode(F, 0.1); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
// rounded-top book, square bottom: x, top, width, bottom, radius
const book = (x, t, w, b, r = 0.9) => `M${x} ${b}V${f(t + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${t}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(t + r)}V${b}Z`
const rot = (pts, ang, [px, py]) => { const c = Math.cos(ang), s = Math.sin(ang); return pts.map(([x, y]) => [px + (x - px) * c - (y - py) * s, py + (x - px) * s + (y - py) * c]) }

export default function render() {
  const NAME = 'library'
  const defs = []
  let n = 0
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const blue = grad('linearGradient', { x1: 3, y1: 4, x2: 21, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])
  const pink = grad('linearGradient', { x1: 13, y1: 7, x2: 21, y2: 20 }, [stop(0, V.accent, 0.95), stop(1, V.shadow)])
  const frost = grad('linearGradient', { x1: 3, y1: 4, x2: 20, y2: 21 }, [stop(0, V.frost, 0.62), stop(0.45, V.tint, 0.48), stop(1, V.tint, 0.34)])

  const BASE = 19.2, ANG = -0.24, PIV = [17, BASE]
  const b1 = area(book(3.2, 4.2, 4, BASE)), b2 = area(book(8.2, 8, 3.4, BASE)), b3 = area(book(12.6, 5.6, 3.4, BASE))
  const leanRing = rot([[17, BASE], [20.8, BASE], [20.8, BASE - 12.6], [17, BASE - 12.6]], ANG, PIV)
  const lean = dilate(erode(setOf([leanRing]), 0.9), 0.9)
  const shelf = area('M2.4 19.7H21.6V20.6A1.2 1.2 0 0 1 20.4 21.8H3.6A1.2 1.2 0 0 1 2.4 20.6Z')
  const books = [b1, b2, b3, lean]
  const out = [['defs', {}, defs]]
  const h = translateSet(unionSets([...books, shelf]), 0.5, 0.9)
  out.push(['path', { d: D(dilate(h, 0.8)), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['path', { d: D(dilate(h, 0.3)), fill: V.shadow, 'fill-opacity': 0.09, class: 'wm-shadow' }])
  const piece = (F, body, cls, others) => {
    const B = differenceSets(translateSet(erode(F, 0.3), 0.55, 0.55), dilate(others, 0.2))
    out.push(['path', { d: D(B), fill: body, 'fill-rule': 'evenodd', class: cls }])
    out.push(['path', { d: D(F), fill: frost, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'fill-rule': 'evenodd', class: cls }])
    out.push(['path', { d: D(rimOf(F)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  }
  piece(shelf, blue, 'wm-k', [])
  ;[b1, b2, b3].forEach((b, i) => piece(b, blue, 'wm-k', unionSets([...books.filter((_, j) => j !== i), shelf])))
  piece(lean, pink, 'wm-a', unionSets([b3, shelf]))
  const band = (x1, x2, y) => `M${x1} ${y}H${x2}`
  const etch = d => ['path', { d, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.6, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }]
  out.push(etch(band(4.2, 6.2, 7.2) + band(4.2, 6.2, 8.6) + band(4.2, 6.2, 16)))
  out.push(etch(band(9, 10.8, 11) + band(9, 10.8, 12.4) + band(9, 10.8, 16)))
  out.push(etch(band(13.4, 15.2, 8.6) + band(13.4, 15.2, 10) + band(13.4, 15.2, 16)))
  const lb = (u, v0, v1) => { const [a, b] = rot([[17 + v0, BASE - u], [17 + v1, BASE - u]], ANG, PIV); return `M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}` }
  out.push(['path', { d: lb(10.4, 0.9, 2.9) + lb(9, 0.9, 2.9) + lb(3.4, 0.9, 2.9), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-a' }])
  return out
}
