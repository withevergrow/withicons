// forge/hand/chrome/external-link.mjs — an open chrome tube box (gap at its top-right corner) and a chrome tube arrow
// running from the box's middle out through that gap, all at the chevrons' tube weight. The earlier solid slab read as
// a photo/landscape icon at 24 and 16px, its horizon broke across the slot and the pale arrow merged into the box.
// Here every straight run (four box sides, the shaft, the head's two arms) carries the style's chrome world across its
// own width, mitred at the corners exactly like chrome chevron-left, so no band ends inside a body; the empty inside
// of the box carries the "leaving" idea. Shadow, edge, bevel, sheen and glint are the style's own (_chrome-core).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement and the chevrons' tube weight
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, W = 3.05, BEVEL = 0.5
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const r2 = v => Math.round(v * 100) / 100
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
// the half-plane nx*x + ny*y < c (output units) as a clamped signed-distance field
function half(nx, ny, c) {
  const G = F.field(1)
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) G[j * F.N + i] = Math.max(-2, Math.min(2, nx * i * F.H + ny * j * F.H - c))
  return G
}
// keep the side n.(X - P) < 0 of a line through skeleton point P
const cutAt = (P, nx, ny) => { const [x, y] = tf(P), L = Math.hypot(nx, ny); return [nx / L, ny / L, (nx * x + ny * y) / L] }
// a wedge at skeleton point P between directions a and b (degrees, screen angles, a < b, span < 180)
function wedge(P, a, b) {
  const ua = [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180)], ub = [Math.cos(b * Math.PI / 180), Math.sin(b * Math.PI / 180)]
  return [cutAt(P, ua[1], -ua[0]), cutAt(P, -ub[1], ub[0])]
}
const st = (o, r) => ['stop', { offset: o, 'stop-color': col(r) }]
// the chevrons' chrome world across a tube: sky, a hard dark horizon, warm ground, bright bounce
const WORLD = [st(0, 'shine'), st(0.22, 'tint'), st(0.44, 'c1'), st(0.46, 'ink'), st(0.58, 'ink'), st(0.585, 'c3'), st(0.84, 'c4'), st(1, 'shine')]
// the arrow a step darker (gunmetal) so it separates from the box at 16px
const GUN = [st(0, 'tint'), st(0.2, 'c1'), st(0.44, 'c2'), st(0.46, 'ink'), st(0.6, 'ink'), st(0.605, 'c3'), st(0.84, 'c1'), st(1, 'tint')]
const frameOf = l => l.cls === 'wm-shadow' || l.cls === 'wm-shine' || l.fill === col('shadow') || (Array.isArray(l.fill) && l.fill[0] === 'bevel')

// box: open rectangle, gap at the top-right corner
const BOX = 'M9.5 7 H3.5 V20.5 H17 V14.5'
const TL = [3.5, 7], BL = [3.5, 20.5], BR = [17, 20.5]
const BOX_ARMS = [
  { cut: [cutAt(TL, -1, 1)], from: [9.5, 7], to: TL },
  { cut: [cutAt(TL, 1, -1), cutAt(BL, 1, 1)], from: TL, to: BL },
  { cut: [cutAt(BL, -1, -1), cutAt(BR, 1, -1)], from: BL, to: BR },
  { cut: [cutAt(BR, -1, 1)], from: BR, to: [17, 14.5] },
]
// arrow: shaft from the box's middle to the corner, open square head, three runs meeting at the tip C
const C = [20.5, 3.5]
const ARROW = 'M10 14 L20.5 3.5 M14.5 3.5 H20.5 V9.5'
const ARROW_ARMS = [
  { cut: wedge(C, 157.5, 315), from: C, to: [14.5, 3.5] },
  { cut: wedge(C, 112.5, 157.5), from: C, to: [10, 14] },
  { cut: wedge(C, -45, 112.5), from: C, to: [20.5, 9.5] },
]

export default function render(icon) {
  const name = (icon && icon.name) || 'external-link'
  const K = F.open(F.strokes(lines(BOX), W, M0), 0.32)
  const Ab = F.open(F.strokes(lines(ARROW), W, M0), 0.32)
  const sil = F.copy(K); F.union(sil, Ab)
  const L0 = layers({ T: {}, K, Af: null, Ab, S: null, sil, txt: null, seam: null })
  const frame = L0.list.filter(frameOf)
  const h = W / 2 - BEVEL, grads = [], body = []
  const lay = (Fd, arms, cls, world) => {
    const core = F.offset(F.copy(Fd), BEVEL)
    for (const { cut, from, to } of arms) {
      const G = F.copy(core)
      for (const c of cut) F.intersect(G, half(...c))
      const loops = F.contour(G).filter(l => l.length > 2)
      const [vx, vy] = tf(from), [ex, ey] = tf(to), L = Math.hypot(ex - vx, ey - vy)
      let nx = (vy - ey) / L, ny = (ex - vx) / L
      if (ny > 0 || (ny === 0 && nx > 0)) { nx = -nx; ny = -ny }
      const mx = (vx + ex) / 2, my = (vy + ey) / 2, k = grads.length
      grads.push(['linearGradient', { id: '', x1: r2(mx + nx * h), y1: r2(my + ny * h), x2: r2(mx - nx * h), y2: r2(my - ny * h), gradientUnits: 'userSpaceOnUse' }, world])
      body.push({ loops, fill: 'url(#ARM' + k + ')', cls, q: 'body' })
    }
  }
  lay(Ab, ARROW_ARMS, 'wm-a', GUN)
  lay(K, BOX_ARMS, 'wm-k', WORLD)
  const shine = frame.filter(l => l.cls === 'wm-shine'), rest = frame.filter(l => l.cls !== 'wm-shine')
  const out = emit({ list: [...rest, ...body, ...shine], glint: L0.glint }, name, 0)
  if (out[0][0] !== 'defs') out.unshift(['defs', {}, []])
  const defs = out[0][2], base = defs.length
  grads.forEach((g, i) => { g[1].id = 'wg-chrome-' + name + '-' + (base + i) })
  defs.push(...grads)
  for (const n of out) if (n[1] && typeof n[1].fill === 'string') n[1].fill = n[1].fill.replace(/^url\(#ARM(\d+)\)$/, (m, k) => 'url(#wg-chrome-' + name + '-' + (base + +k) + ')')
  return out
}
