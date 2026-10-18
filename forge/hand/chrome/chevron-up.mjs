// forge/hand/chrome/chevron-up.mjs — a bent chrome tube pointing up, its reflection running along each arm.
// The generated drawing's horizon fell low and thin across the short glyph, leaving pale sky over beige ground with
// almost no dark, so the chevron washed out on white at 24 and 16px. Here the tube is a touch fatter and each arm
// carries the style's chrome world across its own width (sky on its upper side, a hard dark horizon down its middle,
// warm ground, a bright bounce), meeting in a mitre at the peak, the way chrome chevron-down's horizon follows its
// arms. Shadow, edge, bevel, sheen and glint are the style's own (_chrome-core layers/emit).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement (drawing scaled about the centre, lifted for the shadow) and a chrome tube a little fatter
// than the generator's pure-line tube (2.9)
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
const st = (o, r) => ['stop', { offset: o, 'stop-color': col(r) }]
// the style's chrome world in one ramp across the tube: sky, a hard dark horizon, warm ground, bright bounce
const WORLD = [st(0, 'shine'), st(0.22, 'tint'), st(0.44, 'c1'), st(0.46, 'ink'), st(0.58, 'ink'), st(0.585, 'c3'), st(0.84, 'c4'), st(1, 'shine')]
const frameOf = l => l.cls === 'wm-shadow' || l.cls === 'wm-shine' || l.fill === col('shadow') || (Array.isArray(l.fill) && l.fill[0] === 'bevel')

// shadow, dark edge, light bevel, sheen and glint come from the style's own recipe over the whole glyph; the chrome
// core is laid arm by arm (each arm clipped to its side of the joint's bisectors), its reflection banded along the arm
function tubes(name, d, arms) {
  const full = F.open(F.strokes(lines(d), W, M0), 0.32)
  const L0 = layers({ T: {}, K: full, Af: null, Ab: null, S: null, sil: full, txt: null, seam: null })
  const frame = L0.list.filter(frameOf)
  for (const l of frame) if (!l.cls) l.cls = 'wm-k'
  const core = F.offset(F.copy(full), BEVEL), h = W / 2 - BEVEL, grads = [], body = []
  arms.forEach(({ cut, from, to }, k) => {
    const G = F.copy(core)
    for (const c of cut) F.intersect(G, half(...c))
    const loops = F.contour(G).filter(l => l.length > 2)
    const [vx, vy] = tf(from), [ex, ey] = tf(to), L = Math.hypot(ex - vx, ey - vy)
    let nx = (vy - ey) / L, ny = (ex - vx) / L
    if (ny > 0 || (ny === 0 && nx > 0)) { nx = -nx; ny = -ny }
    const mx = (vx + ex) / 2, my = (vy + ey) / 2
    grads.push(['linearGradient', { id: '', x1: r2(mx + nx * h), y1: r2(my + ny * h), x2: r2(mx - nx * h), y2: r2(my - ny * h), gradientUnits: 'userSpaceOnUse' }, WORLD])
    body.push({ loops, fill: 'url(#ARM' + k + ')', cls: 'wm-k', q: 'body' })
  })
  const out = emit({ list: [...frame.filter(l => l.cls !== 'wm-shine'), ...body, ...frame.filter(l => l.cls === 'wm-shine')], glint: L0.glint }, name, 0)
  if (out[0][0] !== 'defs') out.unshift(['defs', {}, []])
  const defs = out[0][2], base = defs.length
  grads.forEach((g, i) => { g[1].id = 'wg-chrome-' + name + '-' + (base + i) })
  defs.push(...grads)
  for (const n of out) if (n[1] && typeof n[1].fill === 'string') n[1].fill = n[1].fill.replace(/^url\(#ARM(\d+)\)$/, (m, k) => 'url(#wg-chrome-' + name + '-' + (base + +k) + ')')
  return out
}

export default function render(icon) {
  const [cx] = tf([12, 9])
  return tubes((icon && icon.name) || 'chevron-up', 'M6 15 L12 9 L18 15', [
    { cut: [[1, 0, cx]], from: [12, 9], to: [6, 15] },
    { cut: [[-1, 0, -cx]], from: [12, 9], to: [18, 15] },
  ])
}
