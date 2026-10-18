// forge/hand/liquid/log-out.mjs — a liquid-glass log-out, hand-drawn. The generated one grew the skeleton's door
// fill into a lumpy pale slab with a notch where the arrow enters, so the bracket lost its open mouth and the whole
// icon washed out on white. Here the door is a clean open bracket of clear glass with its mouth wide open, and the
// arrow is a bold violet glass arrow that starts clear of the bracket and points out of it. Style pipeline
// (_liquid-core build) with a deeper tint and firmer hairline. Motion: bracket wm-k, arrow wm-a (it nudges out).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'log-out'
const ring = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const SKELETON = {
  name: NAME,
  paths: [
    { d: 'M9.75 3.75 H5.75 A2.25 2.25 0 0 0 3.5 6 V18 A2.25 2.25 0 0 0 5.75 20.25 H9.75', plate: 'K' },
    { d: 'M9.25 12 H20', plate: 'A' },
    { d: 'M15.5 7.5 L20 12 L15.5 16.5', plate: 'A' },
  ],
  fills: [],
}


function prepare(raw) {
  const paths = raw.paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    ...raw, paths, fills, cutouts: [],
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}

// lift the glass out of the white: a deeper tint in the clear and coloured glass, a firmer hairline, a fuller bead
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
