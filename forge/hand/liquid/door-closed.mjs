// forge/hand/liquid/door-closed.mjs: a closed door as a violet glass leaf set in a clear glass frame that stands on a
// clear glass sill, with an accent glass knob. The generated door was one pale clear slab with a hollow ring for a
// handle, so on white it nearly vanished and read as a tablet or headstone; the coloured leaf inside its frame gives
// the door its tone and says "door" at 16px. Style pipeline (_liquid-core build). Motion: frame K, leaf A, knob S.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const area = d => ({ d, subs: parsePath(d) })

// lift the glass out of the white: a deeper tint in the clear and coloured glass, a firmer ink hairline, a fuller bead
const DEEP = { 0: [0.26, 0.5, 0.76], 1: [0.5, 0.9] }
function deepen(nodes) {
  if (!nodes) return []
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

const FRAME = 'M5 21 V5 A2 2 0 0 1 7 3 H17 A2 2 0 0 1 19 5 V21'
const SILL = 'M2.5 21 H21.5'
// the leaf's centreline: its glass grows 1.15u around it, to sit inside the frame with a hairline gap
const LEAF = 'M8.75 18.3 V6.6 A0.55 0.55 0 0 1 9.3 6.05 H14.7 A0.55 0.55 0 0 1 15.25 6.6 V18.3 Z'
// the knob: a tiny ring the bead grows around
const KNOB = 'M14.95 12.25 A0.2 0.2 0 1 1 14.55 12.25 A0.2 0.2 0 1 1 14.95 12.25 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'door-closed'
  return deepen(build({
    name, paths: [],
    lines: [...lines(FRAME, 'K'), ...lines(SILL, 'K'), ...lines(LEAF, 'A'), ...lines(KNOB, 'S')],
    fills: [area(LEAF)],
    cutouts: [],
  }))
}
