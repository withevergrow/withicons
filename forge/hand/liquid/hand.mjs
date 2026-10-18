// forge/hand/liquid/hand.mjs: an open hand as one thick slab of clear liquid glass with four distinct fingers, a
// stepped fingertip line and a thumb, parted by grooves cut from the fingertips down into the palm. The generated hand
// stroked the finger outlines into one pale mitten with three short slots, so at 16px it read as a fist or a blob.
// Style pipeline (_liquid-core build) with a deeper tint and firmer hairline. Motion: one K piece (sways at the wrist).
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

// the glass silhouette (drawn at full glass size: no outline stroke grows it)
const HAND = 'M1.75 10 A2.25 2.25 0 0 1 6.25 10 V6 A2.125 2.125 0 0 1 10.5 6 V4 A2.125 2.125 0 0 1 14.75 4 V5.5 ' +
  'A2.125 2.125 0 0 1 19 5.5 V12.6 A2.6 2.6 0 0 1 21.85 16.95 L18.1 20.75 A5.6 5.6 0 0 1 14.15 22.4 H8 ' +
  'A6.25 6.25 0 0 1 1.75 16.15 Z'
// the grooves between the fingers, cut through the glass
const GROOVES = 'M6.25 10.5 V14 M10.5 6.5 V13.25 M14.75 6 V13.25'

export default function render(icon) {
  const name = (icon && icon.name) || 'hand'
  return deepen(build({ name, paths: [], lines: [], fills: [area(HAND)], cutouts: [area(GROOVES)] }))
}
