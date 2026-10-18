// forge/hand/liquid/plug.mjs: the upright plug of the line drawing in liquid glass. A clear rounded-bottom body, two
// straight parallel violet prongs standing on top of it and one straight vertical cord running down from its foot.
// (The earlier drawing hooked the cord sideways and the prongs read as bunny ears.) Two passes of the style
// pipeline: the body, then the prongs and cord laid over it. Motion: body wm-k, prongs and cord wm-a.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const NAME = 'plug'
const rings = d => parsePath(d).map(s => s.pts)
const dot = (x, y) => ({ pts: [[x, y], [x + 0.1, y]], closed: false, plate: 'A' })
const seg = (x1, y1, x2, y2) => ({ pts: [[x1, y1], [x2, y2]], closed: false, plate: 'A' })

const BODY = 'M6.7 7.8H17.3A1.5 1.5 0 0 1 18.8 9.3V11.6A6.8 6.8 0 0 1 5.2 11.6V9.3A1.5 1.5 0 0 1 6.7 7.8Z'
// prongs: flat feet tucked into the body, round tips
const PRONG_L = 'M7.6 8.6V3.3A1.4 1.4 0 0 1 10.4 3.3V8.6Z'
const PRONG_R = 'M13.6 8.6V3.3A1.4 1.4 0 0 1 16.4 3.3V8.6Z'

const TOWER = { name: NAME, paths: [], cutouts: [], lines: [], fills: [{ set: rings(BODY) }] }
const PARTS = {
  name: NAME, paths: [], cutouts: [],
  lines: [dot(9, 5.6), dot(15, 5.6), seg(12, 17.6, 12, 21.6)],
  fills: [{ set: rings(PRONG_L) }, { set: rings(PRONG_R) }],
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
        else if (k === 1 && deep) stops = stops.map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.72, 1][i] }])
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
  const body = pass(build(TOWER), 0, { cls: 'wm-k' })
  const parts = pass(build(PARTS), 6, { cls: 'wm-a', deep: true, keepShadow: false })
  return compose([body, parts])
}
