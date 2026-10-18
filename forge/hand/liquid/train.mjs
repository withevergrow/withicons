// forge/hand/liquid/train.mjs: the front of a train in liquid glass: a clear rounded-roof body, a two-pane windscreen
// in deep navy glass split by a glass pillar, two round violet headlights and two splayed rail legs. The generated
// drawing cut the windows and lamps as holes inside coloured rings, which read as ambiguous loops. Three passes of the
// style pipeline (body, windscreen, lamps and legs), each laid over the last with a single rim.
// Motion: body wm-k, windscreen and lamps and legs wm-a.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const NAME = 'train'
const rings = d => parsePath(d).map(s => s.pts)
const dot = (x, y) => ({ pts: [[x, y], [x + 0.1, y]], closed: false, plate: 'A' })
const seg = (x1, y1, x2, y2) => ({ pts: [[x1, y1], [x2, y2]], closed: false, plate: 'A' })
const circ = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`
// rectangle with one radius per corner: tl tr br bl
function box(x0, y0, x1, y1, [a, b, c, d]) {
  return `M${x0 + a} ${y0}H${x1 - b}A${b} ${b} 0 0 1 ${x1} ${y0 + b}V${y1 - c}A${c} ${c} 0 0 1 ${x1 - c} ${y1}H${x0 + d}A${d} ${d} 0 0 1 ${x0} ${y1 - d}V${y0 + a}A${a} ${a} 0 0 1 ${x0 + a} ${y0}Z`
}

const BODY = box(3.6, 2.4, 20.4, 17.6, [5, 5, 2.4, 2.4])
const WIN_L = box(6.3, 5, 11.3, 10.4, [2.6, 0.9, 0.9, 0.9])
const WIN_R = box(12.7, 5, 17.7, 10.4, [0.9, 2.6, 0.9, 0.9])
const LAMP_L = circ(8.3, 14, 1.8), LAMP_R = circ(15.7, 14, 1.8)

const SHELL = { name: NAME, paths: [], cutouts: [], lines: [], fills: [{ set: rings(BODY) }] }
const GLASS = { name: NAME, paths: [], cutouts: [], lines: [dot(8.8, 7.7), dot(15.2, 7.7)], fills: [{ set: rings(WIN_L) }, { set: rings(WIN_R) }] }
const FEET = {
  name: NAME, paths: [], cutouts: [],
  lines: [dot(8.3, 14), dot(15.7, 14), seg(8.3, 17.4, 6, 21.2), seg(15.7, 17.4, 18, 21.2)],
  fills: [{ set: rings(LAMP_L) }, { set: rings(LAMP_R) }],
}

// a second pass is renumbered (gradient ids) and retagged; `deep` makes the coloured glass a step denser
function pass(nodes, off, { cls, deep = false, keepShadow = true, deepRole } = {}) {
  const re = new RegExp(`wg-liquid-${NAME}-([0-9]+)`, 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = [], body = []
  for (const n of nodes) {
    if (n[0] === 'defs') {
      for (const g of n[2]) {
        const k = +g[1].id.split('-').pop()
        let stops = g[2]
        if (k === 1 && deepRole) stops = stops.map(s => ['stop', { ...s[1], 'stop-color': `var(--with-liquid-${deepRole}, #1C3F9E)`, ...(s[1]['stop-opacity'] != null ? { 'stop-opacity': r2(0.8 + 0.2 * +s[1].offset) } : {}) }])
        else if (k === 1 && deep) stops = stops.map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.55, 0.97][i] }])
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
  const shell = pass(build(SHELL), 0, { cls: 'wm-k' })
  const glass = pass(build(GLASS), 6, { cls: 'wm-a', deepRole: 'c3', keepShadow: false })
  const feet = pass(build(FEET), 12, { cls: 'wm-a', deep: true, keepShadow: false })
  return compose([shell, glass, feet])
}
