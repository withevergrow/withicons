// forge/hand/liquid/minimize-2.mjs: two inward arrows in liquid glass, each a wide clear glass shaft capped by a bold
// violet glass corner head. The generated arrows ran a thin clear shaft that washed out on white, so at 16px only two
// loose violet corners were left; here the shafts are wider capsules and the glass carries a deeper tint.
// Style pipeline (_liquid-core build). Motion: shafts K, heads A.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const area = d => ({ d, subs: parsePath(d) })

// lift the glass out of the white: a deeper tint in the clear and coloured glass, a firmer ink hairline, a fuller bead
const DEEP = { 0: [0.26, 0.5, 0.76], 1: [0.62, 0.96] }
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

// a capsule ring from a to b with radius r
function capsule(a, b, r, n = 12) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), out = []
  for (let i = 0; i <= n; i++) { const t = ang - Math.PI / 2 - Math.PI * i / n; out.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]) }
  for (let i = 0; i <= n; i++) { const t = ang + Math.PI / 2 - Math.PI * i / n; out.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]) }
  return out
}
const SHAFT_TL = [[4.2, 4.2], [7.6, 7.6]]
const SHAFT_BR = [[19.8, 19.8], [16.4, 16.4]]
// the shafts' centrelines (the capsules widen them) keep them clear glass
const SHAFTS = 'M4.2 4.2 L7.6 7.6 M19.8 19.8 L16.4 16.4'
const HEAD_TL = 'M10 4 V10 H4'
const HEAD_BR = 'M20 14 H14 V20'

export default function render(icon) {
  const name = (icon && icon.name) || 'minimize-2'
  return deepen(build({
    name, paths: [],
    lines: [...lines(HEAD_TL, 'A'), ...lines(HEAD_BR, 'A'), ...lines(SHAFTS, 'K')],
    fills: [{ set: [capsule(...SHAFT_TL, 2.1)] }, { set: [capsule(...SHAFT_BR, 2.1)] }, { set: [[[11.2,2.8],[11.2,11.2],[2.8,11.2],[2.8,8.8],[8.8,8.8],[8.8,2.8]]] }, { set: [[[21.2,12.8],[21.2,15.2],[15.2,15.2],[15.2,21.2],[12.8,21.2],[12.8,12.8]]] }],
    cutouts: [],
  }))
}
