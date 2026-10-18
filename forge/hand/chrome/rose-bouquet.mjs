// forge/hand/chrome/rose-bouquet.mjs: three pink enamel roses (a cupped bloom with a scalloped crown and a folded front
// petal, each in a chrome bezel) over a large silver-chrome wrapper cone tied with a pink enamel bow. The generated
// drawing read as swirl candy with a dark bow and a small wrapper; here the blooms are side-view roses, and the wrapper
// and bow stay light. Same layer recipe as the generator (_chrome-core.mjs); only the geometry is drawn here.
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const M0 = 0.7
const r2 = v => Math.round(v * 100) / 100
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)

// a cupped bloom: three scalloped petal crowns on top, a round belly; (cx, cy) is its centre, w the half width
function bloom(cx, cy, w = 3.6) {
  const pts = []
  const top = -0.3, n = 18
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = -w + 2 * w * u
    const crown = 1.7 + 1.05 * Math.abs(Math.sin(3 * Math.PI * u)) * (1 - 0.3 * Math.abs(2 * u - 1)) + (u > 0.02 && u < 0.98 ? 0 : -1.2 * (u < 0.5 ? 1 - u / 0.02 : (u - 0.98) / 0.02))
    pts.push([cx + x, cy + top - crown + 0.0])
  }
  for (let i = 1; i < 14; i++) {
    const a = Math.PI * i / 14
    pts.push([cx + w * Math.cos(a), cy + top + 3.5 * Math.sin(a)])
  }
  return pts
}
const HEADS = [[12, 4.9], [6.2, 8.8], [17.8, 8.8]]
const CONE = [[3.8, 12.2], [20.2, 12.2], [14.2, 22.6], [9.8, 22.6]]
// sample cubic segments from a start point as a polygon (no arcs)
function bez(start, segs, n = 10) {
  const pts = []
  let [x, y] = start
  for (const [x1, y1, x2, y2, x3, y3] of segs) {
    for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t; pts.push([u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3]) }
    x = x3; y = y3
  }
  return pts
}
const bloomKnot = () => Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return [12 + 1.0 * Math.cos(a), BY + 1.0 * Math.sin(a)] })
// one loop of the bow, from the knot out and back
const BY = 16.8
const BK = 0.9
const bowLoop = s => bez([12, BY], [[12 + s * 1.4 * BK, BY - 0.7 * BK, 12 + s * 2.8 * BK, BY - 1.7 * BK, 12 + s * 4.0 * BK, BY - 2.3 * BK], [12 + s * 5.3 * BK, BY - 1.2 * BK, 12 + s * 5.3 * BK, BY + 1.2 * BK, 12 + s * 4.0 * BK, BY + 2.3 * BK], [12 + s * 2.8 * BK, BY + 1.7 * BK, 12 + s * 1.4 * BK, BY + 0.7 * BK, 12, BY]])

// the paint of one piece: its own layers, ids renumbered so the pieces share one defs node
function piece(M, name, cls, defs, out) {
  const nodes = emit(layers({ T: { noGlint: true }, Af: null, Ab: null, S: null, txt: null, seam: null, ...M }), name, 0)
  const off = defs.length
  const ren = v => typeof v === 'string' ? v.replace(/(wg-chrome-[a-z-]+-)(\d+)/, (_, a, n) => a + (+n + off)) : v
  for (const n of nodes) {
    if (n[0] === 'defs') { for (const g of n[2]) defs.push(['linearGradient', { ...g[1], id: ren(g[1].id) }, g[2]]); continue }
    const a = { ...n[1] }
    if (a.fill) a.fill = ren(a.fill)
    if (cls && !(a.class === 'wm-shine' || a.class === 'wm-shadow')) a.class = cls
    out.push([n[0], a])
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'rose-bouquet'
  const heads = HEADS.map(([x, y]) => F.region([bloom(x, y).map(tf)], M0))
  const bow = F.region([bowLoop(1).map(tf)], M0)
  F.region([bowLoop(-1).map(tf)], M0, bow)
  F.region([bloomKnot().map(tf)], M0, bow)
  const cone = F.region([CONE.map(tf)], M0)
  F.union(cone, F.strokes([{ pts: [...CONE.map(tf), tf(CONE[0])], closed: false }], 1.2, M0))
  const all = F.copy(bow); for (const h of heads) F.union(all, h)
  const body = F.open(minus(cone, grow(all, K.MOAT)), 0.25)
  const defs = [], out = []
  piece({ K: body, sil: F.copy(cone) }, name, 'wm-k', defs, out)
  for (const h of heads) piece({ K: null, S: F.open(h, 0.2), sil: h }, name, 'wm-s', defs, out)
  piece({ K: null, S: F.open(bow, 0.2), sil: bow }, name, 'wm-a', defs, out)
  // a folded front petal on each bloom, in white over the enamel
  for (const [x, y] of HEADS) {
    const q = (dx, dy) => tf([x + dx, y + dy]).map(r2).join(' ')
    out.push(['path', { d: `M${q(-1.9, 0.2)}Q${q(-0.5, 1.7)} ${q(1, 0.4)}Q${q(1.8, -0.4)} ${q(1.6, -1.4)}`, stroke: col('shine'), 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', class: 'wm-shine' }])
  }
  return [['defs', {}, defs], ...out]
}
