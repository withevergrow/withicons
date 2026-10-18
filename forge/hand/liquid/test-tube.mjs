// forge/hand/liquid/test-tube.mjs: a test tube in liquid glass, a wide clear glass tube with a round bottom and a
// rim that flares past its walls, holding a violet liquid that fills its lower part. The generated tube carried the liquid only as a thin
// band across a narrow pale body, so it read as a marker or a syringe; the flared rim and the filled bottom make it a
// test tube at 16px. Style pipeline (_liquid-core build). Motion: tube K, liquid A (floats).
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

// axis from the round bottom (8, 16) up and to the right
const TUBE = 'M14.37 5.39 L5.88 13.88 A3 3 0 0 0 10.12 18.12 L18.61 9.63'
const TUBE_FILL = TUBE + ' Z'
// the flared lip, across the open end and 1.9u past each wall
const LIP = 'M13.66 3.41 L20.59 10.34'
// the liquid's centreline (its glass grows 1.15u): the round bottom up to a level a third of the way along
const LIQUID = 'M10.19 11.97 L7.08 15.08 A1.3 1.3 0 0 0 8.92 16.92 L12.03 13.81 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'test-tube'
  return deepen(build({
    name, paths: [],
    lines: [...lines(TUBE, 'K'), ...lines(LIP, 'K'), ...lines(LIQUID, 'A')],
    fills: [area(TUBE_FILL), area(LIQUID)],
    cutouts: [],
  }))
}
