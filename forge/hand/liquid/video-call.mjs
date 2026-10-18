// forge/hand/liquid/video-call.mjs — a liquid-glass video call, hand-drawn. The generated one cut the person as
// two outlined rings through the clear slab and the lens as a hollow triangle overlapping it, so the camera read as a
// pale busy tangle with no clear subject. Here the camera is one deeper clear slab with the caller as a solid violet
// glass inlay (head bead over shoulders) set in thin moats, and the lens is a solid violet glass wedge standing just
// clear of the slab. Style pipeline (_liquid-core build). Motion: slab wm-k; caller and lens wm-a.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'video-call'
const ring = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const BODY = 'M4 5 H13.5 A2 2 0 0 1 15.5 7 V17 A2 2 0 0 1 13.5 19 H4 A2 2 0 0 1 2 17 V7 A2 2 0 0 1 4 5 Z'
const LENS = 'M18.75 10.5 L21.25 8.75 V15.25 L18.75 13.5 Z'
const SHOULDERS = 'M4.75 17.25 A4 3.25 0 0 1 12.75 17.25 Z'

const SKELETON = {
  name: NAME,
  paths: [
    { d: BODY, plate: 'K' },
    { d: LENS, plate: 'A' },
    { d: ring(8.75, 10.25, 0.9), plate: 'A' },
    { d: 'M7.25 16.25 H10.25', plate: 'A' },
  ],
  fills: [BODY, LENS, ring(8.75, 10.25, 2.1), SHOULDERS],
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
