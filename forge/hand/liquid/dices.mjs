// forge/hand/liquid/dices.mjs — the line design in glass: a clear blue die in front with three diagonal pips and a
// violet die behind it at the upper right (one pip), parted from the front one by a clean 1.3u gap (a boolean cut, so
// the two read as two cubes). The pips are solid deep-glass drops with a pin-point glint instead of holes cut through
// pale glass, which were nearly invisible at 24 and 16px. Same glass recipe as the generator (_liquid-core.mjs build);
// only the geometry is drawn here. Front die + its pips wm-k, back die + its pip wm-a.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, dilate, differenceSets } from '../../kernel/bool.mjs'
import { build, col, L } from '../../styles/_liquid-core.mjs'

const shape = d => setOf(parsePath(d, 0.04).map(s => s.pts))
const cx = r => [r.reduce((a, p) => a + p[0], 0) / r.length, r.reduce((a, p) => a + p[1], 0) / r.length]
// a skeleton the liquid model expects: each piece's fill is its exact shape, its (hidden) line sits inside it
function skeleton(name, parts) {
  const lines = [], fills = []
  for (const p of parts) {
    const rings = p.line ? [p.line] : p.set.map(r => { const c = cx(r); return r.map(q => [c[0] + (q[0] - c[0]) * 0.5, c[1] + (q[1] - c[1]) * 0.5]) })
    for (const r of rings) lines.push({ pts: r, closed: !p.line, plate: p.plate, pathId: 'p' })
    fills.push({ subs: p.set.map(r => ({ pts: r, closed: true })), set: p.set })
  }
  return { name, paths: [], cutouts: [], lines, fills }
}

// front die (K): 11.5 square, bottom left
const FRONT = shape('M5.2 10H11.3A2.7 2.7 0 0 1 14 12.7V18.8A2.7 2.7 0 0 1 11.3 21.5H5.2A2.7 2.7 0 0 1 2.5 18.8V12.7A2.7 2.7 0 0 1 5.2 10Z')
// back die (A): the same square up and to the right, minus the front die grown by the gap
const BACK = differenceSets(shape('M12.7 2.5H18.8A2.7 2.7 0 0 1 21.5 5.2V11.3A2.7 2.7 0 0 1 18.8 14H12.7A2.7 2.7 0 0 1 10 11.3V5.2A2.7 2.7 0 0 1 12.7 2.5Z'), dilate(FRONT, 1.3))

// pips on the 24 grid: [x, y, r]
const PIPS = [
  [5.6, 13.1, 1.35], [8.25, 15.75, 1.35], [10.9, 18.4, 1.35], // front die: three on the diagonal
  [17.6, 6.4, 1.35], // back die
]

export default function render(icon) {
  const nodes = build(skeleton((icon && icon.name) || 'dices', [
    { set: FRONT, plate: 'K' },
    { set: BACK, plate: 'A', line: [[12.6, 5.35], [18.4, 5.35], [18.4, 11.2]] },
  ]))
  const r2 = v => Math.round(v * 100) / 100
  const tf = (x, y) => [r2((x - 12) * L.SCALE + 12 + L.TX), r2((y - 12) * L.SCALE + 12 + L.TY)]
  PIPS.forEach(([x, y, r], i) => {
    const [px, py] = tf(x, y), rr = r2(r * L.SCALE)
    const cls = i < 3 ? 'wm-k' : 'wm-a'
    nodes.push(['circle', { cx: px, cy: py, r: rr, fill: col('c3'), 'fill-opacity': 0.92, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.22, class: cls }])
    nodes.push(['circle', { cx: r2(px - rr * 0.38), cy: r2(py - rr * 0.38), r: r2(rr * 0.3), fill: col('shine'), 'fill-opacity': 0.75, class: 'wm-shine' }])
  })
  return nodes
}
