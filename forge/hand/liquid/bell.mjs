// forge/hand/liquid/bell.mjs — a liquid-glass bell, hand-drawn. The generated bell was a pale clear dome with no
// crown and a clapper grown from an arc into a U that fused with the lip (it read as a smile), so on white the bell
// washed out. Here a fuller dome rises to a crown knob and flares into a firm lip, and the clapper is a separate violet
// glass bead hung just clear below it; the clear glass carries a deeper c1 tint and a firmer ink hairline.
// Built with the style's own glass pipeline (_liquid-core build), so rim, refraction band, lens, fringe, glint,
// caustic and shadow are exactly the siblings'. Motion: dome wm-k (rings about the crown), clapper wm-a.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'bell'
const ring = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const DOME = 'M5.75 15 V11 A6.25 6.25 0 0 1 18.25 11 V15 L20 17.25 H4 Z'

const SKELETON = {
  name: NAME,
  paths: [
    { d: DOME, plate: 'K' },
    { d: ring(12, 3.6, 0.35), plate: 'K' },
    { d: ring(12, 20.85, 0.6), plate: 'A' },
  ],
  fills: [DOME, ring(12, 3.75, 1.5), ring(12, 20.85, 1.75)],
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
