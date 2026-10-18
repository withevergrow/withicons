// forge/hand/liquid/bell-plus.mjs — a liquid-glass bell with an add badge, hand-drawn as a sibling of liquid bell. The
// generated bell was a pale crownless dome with a U clapper fused to its lip, so on white the silhouette washed out and
// the plus floated beside a ghost. Here the dome rises to a crown knob and flares into a firm lip in deeper clear glass
// with a firmer hairline, the clapper is a separate violet bead hung clear below it, and the plus is a fuller accent
// bead in its own moat at the top right. Style pipeline (_liquid-core build). Motion: bell wm-k (rings about the
// crown at 11,6.5), clapper wm-a, plus wm-s (pops about 19,5).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'bell-plus'
const ring = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const DOME = 'M5.25 15.75 V12.25 A5.75 5.75 0 0 1 16.75 12.25 V15.75 L18.5 18 H3.5 Z'

const SKELETON = {
  name: NAME,
  paths: [
    { d: DOME, plate: 'K' },
    { d: ring(11, 5.4, 0.3), plate: 'K' },
    { d: ring(11, 21, 0.55), plate: 'A' },
    { d: 'M19 2.25 V7.75', plate: 'S' },
    { d: 'M16.25 5 H21.75', plate: 'S' },
  ],
  fills: [DOME, ring(11, 5.6, 1.4), ring(11, 21, 1.6)],
}

function prepare(raw) {
  const paths = raw.paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    ...raw, paths, fills, cutouts: [],
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}

// lift the glass out of the white (as liquid bell): deeper clear and coloured tint, firmer hairline, fuller bead
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
