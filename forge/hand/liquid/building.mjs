// forge/hand/liquid/building.mjs: a tall glass tower (rounded top, wider base slab) with six separate coloured-glass
// window panes in a clean 2x3 grid and an arched door at the foot. The generated drawing turned the window dashes and
// their cut-outs into tangled loops; here the tower is one pass of the style pipeline and the panes a second pass laid
// over it, each pane one plain rounded inlay with a single rim (no moat ring around it).
// Motion: tower wm-k, panes and door wm-a.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const NAME = 'building'
const rings = d => parsePath(d).map(s => s.pts)
const lineOf = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const dot = (x, y) => ({ pts: [[x, y], [x + 0.1, y]], closed: false, plate: 'A' })
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

// the tower outline (centre line of the 2.6u glass wall) and the wide base slab
const BODY = 'M6 20V5.7A2 2 0 0 1 8 3.7H16A2 2 0 0 1 18 5.7V20Z'
const BASE = 'M4.1 20H19.9'
// panes at their final size (fills are exact; the dot only claims the coloured-glass plate)
const COLS = [[7.4, 10.8], [13.2, 16.6]], ROWS = [[4.5, 7.1], [8.9, 11.5], [13.3, 15.9]]
const PANES = ROWS.flatMap(([y0, y1]) => COLS.map(([x0, x1]) => ({ d: rr(x0, y0, x1, y1, 1.1), c: [(x0 + x1) / 2, (y0 + y1) / 2] })))
const DOOR = { d: 'M10.1 21V19A1.9 1.9 0 0 1 13.9 19V21Z', c: [12, 19.8] }

const TOWER = {
  name: NAME, paths: [], cutouts: [],
  lines: [...lineOf(BODY, 'K'), ...lineOf(BASE, 'K')],
  fills: [{ set: rings(BODY) }],
}
const GLASS = {
  name: NAME, paths: [], cutouts: [],
  lines: [...PANES, DOOR].map(p => dot(...p.c)),
  fills: [...PANES, DOOR].map(p => ({ set: rings(p.d) })),
}

// a second pass is renumbered (gradient ids) and retagged, the coloured glass a step deeper than the generator's
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
  return compose([tower, glass])
}
