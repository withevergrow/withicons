// forge/hand/liquid/text-cursor-input.mjs: the input box split in two clear glass halves by a tall I-beam text cursor
// (coloured glass, serifs top and bottom, standing proud of the box), a short dash of typed text inlaid in the left
// half. The earlier drawing kept one intact pill with a tiny cursor floating in it. Two passes of the style pipeline:
// the two halves, then the dash and the cursor laid over them. Motion: halves wm-k, dash and cursor wm-a.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const NAME = 'text-cursor-input'
const rings = d => parsePath(d).map(s => s.pts)
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

// one half of the box: big round outer corners, small soft corners where the cursor splits it
const half = (x0, y0, x1, y1, ro, ri, side) => {
  const [rl, rr_] = side === 'L' ? [ro, ri] : [ri, ro]
  return `M${x0 + rl} ${y0}H${x1 - rr_}A${rr_} ${rr_} 0 0 1 ${x1} ${y0 + rr_}V${y1 - rr_}A${rr_} ${rr_} 0 0 1 ${x1 - rr_} ${y1}H${x0 + rl}A${rl} ${rl} 0 0 1 ${x0} ${y1 - rl}V${y0 + rl}A${rl} ${rl} 0 0 1 ${x0 + rl} ${y0}Z`
}
const LEFT = half(2, 6.2, 10.5, 17.8, 3.2, 1, 'L')
const RIGHT = half(15.9, 6.2, 22, 17.8, 3.2, 1, 'R')
// the I-beam as one closed outline: 1.6u stem, 1.6u serifs, corners softened
function rpoly(pts, r) {
  const n = pts.length
  let d = ''
  pts.forEach((p, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1])
    const ka = Math.min(r, la / 2) / la, kb = Math.min(r, lb / 2) / lb
    d += (i ? 'L' : 'M') + r2(p[0] + (a[0] - p[0]) * ka) + ' ' + r2(p[1] + (a[1] - p[1]) * ka) + 'Q' + r2(p[0]) + ' ' + r2(p[1]) + ' ' + r2(p[0] + (b[0] - p[0]) * kb) + ' ' + r2(p[1] + (b[1] - p[1]) * kb)
  })
  return d + 'Z'
}
const BEAM = rpoly([[11.5, 3.3], [14.9, 3.3], [14.9, 5.1], [14.1, 5.1], [14.1, 18.9], [14.9, 18.9], [14.9, 20.7], [11.5, 20.7], [11.5, 18.9], [12.3, 18.9], [12.3, 5.1], [11.5, 5.1]], 0.55)
const DASH = rr(4.3, 10.85, 8.3, 13.15, 1.15)
const dot = (x, y) => ({ pts: [[x, y], [x + 0.1, y]], closed: false, plate: 'A' })

const HALVES = { name: NAME, paths: [], cutouts: [], lines: [], fills: [{ set: rings(LEFT) }, { set: rings(RIGHT) }] }
const PARTS = { name: NAME, paths: [], cutouts: [], lines: [dot(6.2, 12)], fills: [{ set: rings(BEAM) }, { set: rings(DASH) }] }

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
  const halves = pass(build(HALVES), 0, { cls: 'wm-k' })
  const parts = pass(build(PARTS), 6, { cls: 'wm-a', deep: true, keepShadow: false })
  return compose([halves, parts])
}
