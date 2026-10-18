// forge/hand/liquid/chef-hat.mjs — hand-drawn liquid glass. Three distinct puff lobes over a crown, a narrower taller coloured band.
// Style pipeline (_liquid-core build): body wm-k, coloured part wm-a, slash/badge wm-s.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const ring = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const L = ring(6.9, 11, 2.9)
const C = ring(12, 7.9, 3.3)
const R = ring(17.1, 11, 2.9)
const CROWN = 'M8.5 12 H15.5 V16 H8.5 Z'
const BAND = 'M8.25 17 H15.75 V18.5 A1 1 0 0 1 14.75 19.5 H9.25 A1 1 0 0 1 8.25 18.5 Z'
const SKELETON = {
  name: 'chef-hat',
  paths: [{ d: L, plate: 'K' }, { d: C, plate: 'K' }, { d: R, plate: 'K' }, { d: CROWN, plate: 'K' }, { d: BAND, plate: 'A' }],
  fills: [L, C, R, CROWN, BAND],
  cutouts: ['M12 15.6 V13.5'],
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
