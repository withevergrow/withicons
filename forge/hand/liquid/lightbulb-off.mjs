// forge/hand/liquid/lightbulb-off.mjs — hand-drawn liquid glass. Clear glass bulb, coloured screw base, accent slash in a moat.
// Style pipeline (_liquid-core build): body wm-k, coloured part wm-a, slash/badge wm-s.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const ring = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const BULB = 'M9.25 15 C9.25 13.5 6.5 12.2 6.5 8.75 A5.5 5.5 0 0 1 17.5 8.75 C17.5 12.2 14.75 13.5 14.75 15 Z'
const BASE = 'M9.25 15.9 H14.75 V16.9 H9.25 Z M9.5 18.1 H14.5 V19.1 H9.5 Z'
const TIP = 'M10.5 20.1 H13.5 A1.25 1.25 0 0 1 12.25 21.35 H11.75 A1.25 1.25 0 0 1 10.5 20.1 Z'
const SKELETON = {
  name: 'lightbulb-off',
  paths: [{ d: BULB, plate: 'K' }, { d: BASE, plate: 'A' }, { d: TIP, plate: 'A' }, { d: 'M5.5 4.5 L18.5 17.5', plate: 'S' }],
  fills: [BULB, BASE, TIP],
  cutouts: [],
}

function prepare(raw) {
  const paths = raw.paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = (raw.cutouts || []).map(d => ({ d, subs: parsePath(d) }))
  return {
    ...raw, paths, fills, cutouts,
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}

// deeper tint and firmer hairline so the glass holds on light grounds
const DEEP = { 0: [0.24, 0.48, 0.74], 1: [0.46, 0.88] }
function deepen(nodes) {
  return nodes.map(n => {
    if (n[0] === 'defs') {
      return ['defs', {}, n[2].map(g => {
        const k = +g[1].id.split('-').pop()
        if (!DEEP[k]) return g
        return [g[0], g[1], g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': DEEP[k][i] }])]
      })]
    }
    let a = n[1]
    if (a.stroke === 'currentColor' && a['stroke-opacity'] === 0.3) a = { ...a, 'stroke-opacity': 0.5, 'stroke-width': 0.28 }
    if (String(a.fill).includes('liquid-accent') && a['fill-opacity'] === 0.75) a = { ...a, 'fill-opacity': 0.92 }
    return a === n[1] ? n : [n[0], a]
  })
}

export default function render() {
  return deepen(build(prepare(SKELETON)))
}
