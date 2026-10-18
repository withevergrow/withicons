// forge/hand/liquid/chinese-knot.mjs: a wide diamond knot of clear glass with a woven lattice grooved into it and
// an open loop on each side, a bead and tassel below in coloured glass (wm-a, it sways). Same drawing as the line
// version; the generated hanging pendant with a top ring read as a charm, not a knot.
const NAME = 'chinese-knot'
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const fill = d => ({ subs: parsePath(d) })
const OFF = plate => ({ pts: [[-8, -8], [-7, -8]], closed: false, plate })
const glass = (fills, cutouts, plate) => ({ name: NAME, paths: [], lines: plate ? [OFF(plate)] : [], fills: fills.map(fill), cutouts: cutouts.map(fill) })
const oval = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`

function pass(nodes, off, cls, { shadow = true } = {}) {
  const re = new RegExp('wg-liquid-' + NAME + '-([0-9]+)', 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = [], body = []
  for (const n of nodes) {
    if (n[0] === 'defs') { for (const g of n[2]) defs.push([g[0], { ...g[1], id: ren(g[1].id) }, g[2]]); continue }
    const a = { ...n[1] }
    if (a.class === 'wm-shadow' && !shadow) continue
    if (a.fill) a.fill = ren(a.fill)
    if (a.stroke) a.stroke = ren(a.stroke)
    if (a.class !== 'wm-shadow' && a.class !== 'wm-shine') a.class = cls
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

const DIAMOND = 'M12 2.4C12.6 2.4 13.1 2.7 13.6 3.2L18.8 8.4C19.3 8.9 19.3 9.3 18.8 9.8L13.6 15C13.1 15.5 12.6 15.8 12 15.8C11.4 15.8 10.9 15.5 10.4 15L5.2 9.8C4.7 9.3 4.7 8.9 5.2 8.4L10.4 3.2C10.9 2.7 11.4 2.4 12 2.4Z'
const LOOPS = [oval(4.2, 9.1, 2.2, 4), oval(19.8, 9.1, 2.2, 4)]
// hollow loops and the lattice grooves
const HOLES = [oval(4, 9.1, 0.85, 2.5), oval(20, 9.1, 0.85, 2.5)]
const LATTICE = []
const TASSEL = ['M12 16.4V17.6M10.8 17.6H13.2L14.3 22H9.7Z']

export default function render() {
  const body = pass(build(glass([DIAMOND, ...LOOPS], [...HOLES, ...LATTICE])), 0, 'wm-k')
  const tassel = pass(build(glass(['M11 16.1H13V18H11Z', 'M10.3 17.6H13.7L15.2 22.4H8.8Z'], [], 'A')), 6, 'wm-a', { shadow: false })
  const ink = d => ['path', { d, stroke: 'var(--with-liquid-c3, #1C3F9E)', 'stroke-opacity': 0.75, 'stroke-width': 0.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', class: 'wm-k' }]
  const weave = [ink('M12 5.4L15.7 9.1L12 12.8L8.3 9.1Z'), ink('M9.5 6.6L14.5 11.6M14.5 6.6L9.5 11.6')]
  const nodes = compose([body, tassel])
  const g = nodes[0][2].find(x => x[1].id === `wg-liquid-${NAME}-0`)
  if (g) g[2].forEach((t, i) => { t[1]['stop-opacity'] = [0.26, 0.5, 0.78][i] })
  return [...nodes, ...weave]
}
