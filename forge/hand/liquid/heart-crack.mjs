// forge/hand/liquid/heart-crack.mjs — a liquid-glass broken heart: the whole heart in deeper clear glass with a firmer
// hairline, split from the top notch through the tip by a wide see-through zigzag crack. The generated heart was the
// palest glass in the family and its crack a thin violet inlay that blurred into the tint at 16px; a clean gap of air
// reads as broken at any size. Style pipeline (_liquid-core build). Motion: one body (breathes and shudders as one).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, roundStrokeSet } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'heart-crack'
const HEART = 'M12 20.5 C12 20.5 3 15.2 3 8.9 C3 6.2 5.1 4 7.8 4 C9.6 4 11.1 5 12 6.5 C12.9 5 14.4 4 16.2 4 C18.9 4 21 6.2 21 8.9 C21 15.2 12 20.5 12 20.5 Z'
// the crack: one zigzag from above the notch to below the tip, knocked out as a 1.75u band of air
const CRACK = [[12.25, 4.5], [10, 10.5], [13.5, 13.5], [11, 17], [12.25, 22.25]]

function glass(name) {
  const subs = parsePath(HEART)
  return {
    name,
    paths: [{ id: 'p0', d: HEART, plate: 'K', subs }],
    lines: subs.map(s => ({ pts: s.pts, closed: s.closed, plate: 'K', pathId: 'p0' })),
    fills: [{ d: HEART, subs, set: setOf(subs.map(s => s.pts)) }],
    cutouts: [{ subs: roundStrokeSet(CRACK, 1.75).map(pts => ({ pts, closed: true })) }],
  }
}

// lift the glass out of the white (as liquid bell): deeper clear tint, firmer hairline
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
    return a === n[1] ? n : [n[0], a]
  })
}

export default function render() {
  return deepen(build(glass(NAME)))
}
