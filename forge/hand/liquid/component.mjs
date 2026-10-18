// forge/hand/liquid/component.mjs — four crisp glass diamonds around an open centre, alternating clear blue (top,
// bottom) and violet (left, right). The generated diamonds were soft pebbles that nearly touched, so the four read
// as one quilted square; here each is a true rhombus with a tight corner radius, and the gaps between neighbours are
// a clean 1.4u channel (a cross of light through the middle) so they stay four separate parts at 16px.
// Same glass recipe as the generator (_liquid-core.mjs build); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const cx = r => [r.reduce((a, p) => a + p[0], 0) / r.length, r.reduce((a, p) => a + p[1], 0) / r.length]
// a skeleton the liquid model expects: each piece's fill is its exact shape, its (hidden) line sits inside it
function skeleton(name, parts, cutLines = []) {
  const lines = [], fills = []
  for (const p of parts) {
    // the hidden line sits well inside the fill (the stroke then adds nothing): the ring pulled halfway in, or a given polyline
    const rings = p.line ? [p.line] : p.set.map(r => { const c = cx(r); return r.map(q => [c[0] + (q[0] - c[0]) * 0.5, c[1] + (q[1] - c[1]) * 0.5]) })
    for (const r of rings) lines.push({ pts: r, closed: !p.line, plate: p.plate, pathId: 'p' })
    fills.push({ subs: p.set.map(r => ({ pts: r, closed: true })), set: p.set })
  }
  const cutouts = cutLines.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths: [], cutouts, lines, fills }
}

const R = 4.7 // half-diagonal
const C = 6.3 // centre offset from the middle of the icon
const RC = 0.85 // corner radius
const BOW = 0.3 // each edge bows out a touch (the control point), so no edge runs parallel to the light
// rhombus of half-diagonal R at (x, y), corners rounded with radius RC (tangent length RC on a 90 degree corner)
function diamond(x, y) {
  const V = [[x, y - R], [x + R, y], [x, y + R], [x - R, y]]
  const un = v => { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l] }
  const f = v => v.map(n => n.toFixed(3)).join(' ')
  // tangent points of every rounded corner, then the (slightly bowed) edge between corners, then the corner arc
  const T = V.map((p, i) => {
    const a = V[(i + 3) % 4], b = V[(i + 1) % 4], da = un([a[0] - p[0], a[1] - p[1]]), db = un([b[0] - p[0], b[1] - p[1]])
    return [[p[0] + da[0] * RC, p[1] + da[1] * RC], [p[0] + db[0] * RC, p[1] + db[1] * RC]]
  })
  let d = 'M' + f(T[0][0])
  for (let i = 0; i < 4; i++) {
    const n = (i + 1) % 4
    d += 'A' + RC + ' ' + RC + ' 0 0 1 ' + f(T[i][1])
    const m = [(T[i][1][0] + T[n][0][0]) / 2, (T[i][1][1] + T[n][0][1]) / 2], o = un([m[0] - x, m[1] - y])
    d += 'Q' + f([m[0] + o[0] * BOW, m[1] + o[1] * BOW]) + ' ' + f(T[n][0])
  }
  return setOf(parsePath(d + 'Z', 0.04).map(q => q.pts))
}

export default function render(icon) {
  return build(skeleton((icon && icon.name) || 'component', [
    { set: diamond(12, 12 - C), plate: 'K' },
    { set: diamond(12 + C, 12), plate: 'A' },
    { set: diamond(12, 12 + C), plate: 'K' },
    { set: diamond(12 - C, 12), plate: 'A' },
  ]))
}
