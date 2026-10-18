// forge/hand/liquid/headset.mjs — a liquid-glass headset, hand-drawn. The generated one put the colour in the thin
// band and boom and left the two ear cups as pale clear glass, so the heaviest parts washed out on white. Here the
// band is clear glass and the cups are deep violet glass (grown from inset centrelines so their corners stay soft),
// with the boom curling from the right cup to a round mic bead in the same coloured glass. Style pipeline
// (_liquid-core build) with a deeper tint and firmer hairline. Motion: band wm-k; cups, boom and mic wm-a.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'headset'
const ring = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const CUP_L = 'M5.65 12.75 H6.35 A1 1 0 0 1 7.35 13.75 V15.75 A1 1 0 0 1 6.35 16.75 H5.65 A1 1 0 0 1 4.65 15.75 V13.75 A1 1 0 0 1 5.65 12.75 Z'
const CUP_R = 'M18.35 12.75 H17.65 A1 1 0 0 0 16.65 13.75 V15.75 A1 1 0 0 0 17.65 16.75 H18.35 A1 1 0 0 0 19.35 15.75 V13.75 A1 1 0 0 0 18.35 12.75 Z'

const SKELETON = {
  name: NAME,
  paths: [
    { d: 'M3.75 13 V12 A8.25 8.25 0 0 1 20.25 12 V13', plate: 'K' },
    { d: CUP_L, plate: 'A' },
    { d: CUP_R, plate: 'A' },
    { d: 'M18 17.5 V18.25 A3.25 3.25 0 0 1 14.75 21.5 H12.75', plate: 'A' },
    { d: ring(12.25, 21.5, 0.4), plate: 'A' },
  ],
  fills: [CUP_L, CUP_R, ring(12.25, 21.5, 1.45)],
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
    // the shared lens pool sits right over the left cup: soften it on the coloured glass so both cups read deep
    if (a.class === 'wm-a' && a.fill === 'url(#wg-liquid-headset-4)') a = { ...a, 'fill-opacity': 0.45 }
    return a === n[1] ? n : [n[0], a]
  })
}

export default function render() {
  return deepen(build(prepare(SKELETON)))
}
