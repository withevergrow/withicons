// forge/hand/liquid/cupid-bow.mjs: the diagonal bow (clear glass) with a purple glass arrow and a pink glass heart
// tip pointing up-right, as in the line version. The arrow and heart are wm-a, so they nudge along the diagonal.
const NAME = 'cupid-bow'
import { parsePath, distToPolyline, resample } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const HEX = { c2: '#A77BFF', c3: '#1C3F9E', c4: '#FF7EC1', accent: '#FF5F8F' }
const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
// the arrow shaft: bow strokes are cut where it passes, so the shaft reads as lying over the bow
const SHAFT = [[3.2, 20.8], [15.3, 8.7]]
const SHAFT_ROLE = 'c4'
const GAP = 2.45
function cut(d, plate) {
  const out = []
  for (const s of parsePath(d)) {
    let run = []
    for (const o of resample(s.pts, 0.2, false)) {
      if (distToPolyline(o.p, SHAFT, false) < GAP) { if (run.length > 1) out.push({ pts: run, closed: false, plate }); run = [] } else run.push(o.p)
    }
    if (run.length > 1) out.push({ pts: run, closed: false, plate })
  }
  return out
}

function pass(nodes, off, cls, { deepRole, ops = [0.3, 0.75], shadow = true } = {}) {
  const re = new RegExp('wg-liquid-' + NAME + '-([0-9]+)', 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = [], body = []
  for (const n of nodes) {
    if (n[0] === 'defs') {
      for (const g of n[2]) {
        let stops = g[2]
        if (g[1].id.endsWith('-1') && deepRole) stops = stops.map((t, i) => ['stop', { ...t[1], 'stop-color': `var(--with-liquid-${deepRole}, ${HEX[deepRole]})`, 'stop-opacity': ops[i] }])
        defs.push([g[0], { ...g[1], id: ren(g[1].id) }, stops])
      }
      continue
    }
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

const HEART = 'M19.25 4.75C19.5 6.25 20 9 18.5 10.25C17.75 11.25 16.5 11 15.75 10.25C15.25 9.75 15.25 9 16.25 7.75C15 8.75 14.25 8.75 13.75 8.25C13 7.5 12.75 6.25 13.75 5.5C15 4 17.75 4.5 19.25 4.75Z'

export default function render() {
  const bow = pass(build({ name: NAME, paths: [], lines: [...lines('M3 11.5Q15.5 8.5 12.5 21', 'K'), ...cut('M3 11.5L12.5 21', 'K')], fills: [], cutouts: [] }), 0, 'wm-k')
  const arrow = pass(build({ name: NAME, paths: [], lines: [...lines('M3.2 20.8L15.3 8.7', 'A'), ...lines('M3 18.5H5.5V21', 'A')], fills: [], cutouts: [] }), 6, 'wm-a', { deepRole: SHAFT_ROLE, ops: [0.55, 0.95], shadow: false })
  const tip = pass(build({ name: NAME, paths: [], lines: [{ pts: [[-8, -8], [-7, -8]], closed: false, plate: 'A' }], fills: [{ subs: parsePath(HEART).map(sb => ({ ...sb, pts: sb.pts.map(([x, y]) => [16.6 + (x - 16.6) * 1.22, 7.6 + (y - 7.6) * 1.22]) })) }], cutouts: [] }), 12, 'wm-a', { deepRole: 'accent', ops: [0.5, 0.95], shadow: false })
  return compose([bow, arrow, tip])
}
