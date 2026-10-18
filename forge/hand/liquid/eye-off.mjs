// forge/hand/liquid/eye-off.mjs — hand-drawn liquid glass. Full almond eye with a pupil disc, crossed by a shorter accent slash in its own moat.
// Style pipeline (_liquid-core build): body wm-k, coloured part wm-a, slash/badge wm-s.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const ring = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const EYE = 'M2.5 12 C4.5 7.5 8 5 12 5 C16 5 19.5 7.5 21.5 12 C19.5 16.5 16 19 12 19 C8 19 4.5 16.5 2.5 12 Z'
const SKELETON = {
  name: 'eye-off',
  paths: [{ d: EYE, plate: 'K' }, { d: ring(12, 12, 2.6), plate: 'A' }, { d: 'M4.25 4.25 L19.75 19.75', plate: 'S' }],
  fills: [EYE, ring(12, 12, 2.6)],
  cutouts: [ring(12, 12, 4) + ring(12, 12, 2.9).replace(/^M/, 'M')],
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
