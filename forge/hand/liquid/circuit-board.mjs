// forge/hand/liquid/circuit-board.mjs: a rounded clear glass board with a violet chip in the middle, four traces
// leaving it (a run, a 45 degree step and a run to the pad) and four pink bead pads in the corners.
// The earlier drawing was one diagonal trace between two pads and read as a pipe or a phone handset; a centred chip
// with fanned traces and corner pads is the circuit-board silhouette. Generator recipe (_liquid-core.mjs build).
// Motion: board wm-k, chip and traces wm-a, pads wm-s.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets, roundStrokeSet } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'circuit-board'
const rings = d => parsePath(d).map(s => s.pts)
const dot = (x, y, plate) => ({ pts: [[x, y], [x + 0.1, y]], closed: false, plate })
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`

const BOARD = rr(3, 3, 21, 21, 3.2)
const CHIP = rr(9.4, 9.4, 14.6, 14.6, 1.2)
const PADS = [[6, 6.2], [18, 6.2], [6, 17.8], [18, 17.8]]
const TRACES = [
  [[6, 6.2], [6, 9], [8, 11], [9.4, 11]],
  [[18, 6.2], [18, 9], [16, 11], [14.6, 11]],
  [[6, 17.8], [6, 15], [8, 13], [9.4, 13]],
  [[18, 17.8], [18, 15], [16, 13], [14.6, 13]],
]

const B = { name: NAME, paths: [], cutouts: [], lines: [{ pts: parsePath(BOARD)[0].pts, closed: true, plate: 'K' }], fills: [{ set: rings(BOARD) }] }
const CHIPSET = unionSets([setOf(rings(CHIP)), ...TRACES.map(t => roundStrokeSet(t, 1))])
const C = { name: NAME, paths: [], cutouts: [], lines: [dot(12, 12, 'A')], fills: [{ set: CHIPSET }] }
const P = { name: NAME, paths: [], cutouts: [], lines: PADS.map(([x, y]) => dot(x, y, 'S')), fills: PADS.map(([x, y]) => ({ set: rings(disc(x, y, 1.3)) })) }

function pass(nodes, off, { cls, keepShadow = true } = {}) {
  const re = new RegExp(`wg-liquid-${NAME}-([0-9]+)`, 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = [], body = []
  for (const n of nodes) {
    if (n[0] === 'defs') { for (const g of n[2]) defs.push([g[0], { ...g[1], id: ren(g[1].id) }, g[2]]); continue }
    if (!keepShadow && n[1].class === 'wm-shadow') continue
    const a = { ...n[1] }
    if (a.fill) a.fill = ren(a.fill)
    if (a.stroke) a.stroke = ren(a.stroke)
    if (cls && a.class !== 'wm-shadow' && a.class !== 'wm-shine') a.class = cls
    body.push([n[0], a])
  }
  return { defs, body }
}
function compose(passes) {
  const sh = n => n[1].class === 'wm-shadow'
  const body = [...passes.flatMap(p => p.body.filter(sh)), ...passes.flatMap(p => p.body.filter(n => !sh(n)))]
  const used = new Set(body.flatMap(n => [n[1].fill, n[1].stroke]).map(v => (String(v).match(/#([^)]+)\)/) || [])[1]).filter(Boolean))
  return [['defs', {}, passes.flatMap(p => p.defs).filter(g => used.has(g[1].id))], ...body]
}

export default function render() {
  return compose([
    pass(build(B), 0, { cls: 'wm-k' }),
    pass(build(C), 6, { cls: 'wm-a', keepShadow: false }),
    pass(build(P), 12, { cls: 'wm-s', keepShadow: false }),
  ])
}
