// forge/hand/pastel/wind.mjs — the pastel wind: three staggered sky gusts as soft bars (w 2.75) with 1.75u of page
// between them, each ending in a generous round curl (top and middle curl up, bottom curls down), ringed with a deeper
// 0.8 sky rim; the generated gusts packed 1.2u apart with small hooks and faded into the page.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = (names, t = 0.85) => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, t) }]))

// a gust: a bar from (x0, y) to (x1, y), then a curl of radius r turning up (dir -1) or down (dir 1) through `sweep` deg
function gust(x0, x1, y, r, dir, sweep) {
  const cyc = y + dir * r
  const t = sweep * Math.PI / 180
  const ex = x1 + r * Math.sin(t), ey = cyc - dir * r * Math.cos(t)
  const large = sweep > 180 ? 1 : 0
  const sw = dir < 0 ? 0 : 1
  return `M${x0} ${y} H${x1} A${r} ${r} 0 ${large} ${sw} ${ex.toFixed(2)} ${ey.toFixed(2)}`
}

export default function render(icon) {
  const { stroke } = Prim
  const W = 2.75
  const E = entriesOf([
    ['sky@K', stroke(gust(3.25, 16.75, 12.25, 3, -1, 230), W)],
    ['sky@A', stroke(gust(3.25, 8.5, 7.75, 2.25, -1, 240), W), stroke(gust(3.25, 13, 16.75, 2, 1, 240), W)],
  ], icon)
  for (const e of E) e.rim = 0.75
  return paintEntries(E, { hues: deeper(['sky']), glint: true })
}
