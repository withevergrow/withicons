// forge/hand/liquid/hotel.mjs: a wide clear-glass hotel building (rounded roof, ground slab) with a pink sign pill
// under the roof, two rows of three violet window panes and an arched door at the foot. The earlier drawing put a bed
// inside a box and lost the building; here the silhouette is the building (wider and shorter than the tower icon) and
// the sign pill is what says "hotel". Tower pass is the style pipeline, panes and sign are inlays laid over it.
// Motion: building wm-k, panes and door wm-a, sign wm-s.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'hotel'
const rings = d => parsePath(d).map(s => s.pts)
const lineOf = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const dot = (x, y, plate) => ({ pts: [[x, y], [x + 0.1, y]], closed: false, plate })
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

const BODY = 'M3.6 20V11A2 2 0 0 1 5.6 9H8V5.7A2 2 0 0 1 10 3.7H14A2 2 0 0 1 16 5.7V9H18.4A2 2 0 0 1 20.4 11V20Z'
const BASE = 'M2.4 20H21.6'
const SIGN = { d: rr(9.3, 5.1, 14.7, 7.5, 1.1), c: [12, 6.3] }
const PANE = (x0, y0) => ({ d: rr(x0, y0, x0 + 2.9, y0 + 2.9, 1.2), c: [x0 + 1.45, y0 + 1.45] })
const PANES = [PANE(5.2, 10.6), PANE(8.8, 10.6), PANE(12.3, 10.6), PANE(15.9, 10.6), PANE(5.2, 14.4), PANE(15.9, 14.4)]
const DOOR = { d: 'M10.1 21V18.4A1.9 1.9 0 0 1 13.9 18.4V21Z', c: [12, 19.8] }

const TOWER = { name: NAME, paths: [], cutouts: [], lines: [...lineOf(BODY, 'K'), ...lineOf(BASE, 'K')], fills: [{ set: rings(BODY) }] }
const GLASS = { name: NAME, paths: [], cutouts: [], lines: [...PANES, DOOR].map(p => dot(...p.c, 'A')), fills: [...PANES, DOOR].map(p => ({ set: rings(p.d) })) }
const PILL = { name: NAME, paths: [], cutouts: [], lines: [dot(...SIGN.c, 'S')], fills: [{ set: rings(SIGN.d) }] }

function pass(nodes, off, { cls, deep = false, keepShadow = true } = {}) {
  const re = new RegExp(`wg-liquid-${NAME}-([0-9]+)`, 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = [], body = []
  for (const n of nodes) {
    if (n[0] === 'defs') {
      for (const g of n[2]) {
        const k = +g[1].id.split('-').pop()
        let stops = g[2]
        if (k === 1 && deep) stops = stops.map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.55, 0.97][i] }])
        defs.push([g[0], { ...g[1], id: ren(g[1].id) }, stops])
      }
      continue
    }
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
  const tower = pass(build(TOWER), 0, { cls: 'wm-k' })
  const glass = pass(build(GLASS), 6, { cls: 'wm-a', deep: true, keepShadow: false })
  const sign = pass(build(PILL), 12, { cls: 'wm-s', keepShadow: false })
  return compose([tower, glass, sign])
}
