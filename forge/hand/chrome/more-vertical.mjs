// forge/hand/chrome/more-vertical.mjs — three fat chrome balls stacked, instead of the generated pea-sized dots. One ball (a
// 1.62u disc inflated by the style's tube, 5.4u across) is modelled and painted by the generator (_chrome-core.mjs), then
// repeated at the three stops, so every ball is lit the same way and the pair more-horizontal / more-vertical is the same
// drawing turned 90 degrees (the swap animation). The ball's horizon is a sagging lens set below the centre and ending
// inside the rim, a reflection on a sphere, not a slot (a full-width bar through the centre read as a minus sign);
// the glint is a 1.2u star centred on the dark outline of the top ball's upper-left rim, like the siblings' glints.
// The gradients use bounding-box units so one gradient serves every ball. A column cannot merge
// a gradient layer into one path (its box would span all three balls), so those layers are one path per ball.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const R = 2.0, STOPS = [-8.2, 0, 8.2], AXIS = 'y'
const f = v => String(Math.round(v * 100) / 100)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

function skeleton(name) {
  const d = disc(12, 12, R), subs = parsePath(d)
  return { name, paths: [{ id: 'p0', d, plate: 'K', subs }], fills: [{ d, subs, set: setOf(subs.map(s => s.pts)) }], cutouts: [],
    lines: subs.map(x => ({ pts: x.pts, closed: x.closed, plate: 'K', pathId: 'p0' })) }
}

// where a skeleton point lands in the chrome drawing (the generator's placement)
const P = (x, y) => [(x - 12) * K.SCALE + 12 + K.TX, (y - 12) * K.SCALE + 12 + K.TY]
const [CX, CY] = P(12, 12)
const STEP = STOPS.map(s => s * K.SCALE)

// a four-point star
const star = (x, y, r, w) =>
  `M${f(x)} ${f(y - r)}Q${f(x + w)} ${f(y - w)} ${f(x + r)} ${f(y)}Q${f(x + w)} ${f(y + w)} ${f(x)} ${f(y + r)}` +
  `Q${f(x - w)} ${f(y + w)} ${f(x - r)} ${f(y)}Q${f(x - w)} ${f(y - w)} ${f(x)} ${f(y - r)}Z`

// the horizon: top edge peaks at cy+0.5, belly at cy+1.9, ends at cy+0.1 and 1.6u from the axis (about 65% of the ball),
// so both points fade inside the rim; a quadratic peaks halfway to its control, so each control sits at 2*peak - end
const lens = (cx, cy) => {
  const e = 2.15, y0 = cy + 0.75, top = cy - 0.25, belly = cy + 1.75
  return `M${f(cx - e)} ${f(y0)}Q${f(cx)} ${f(top)} ${f(cx + e)} ${f(y0)}Q${f(cx)} ${f(belly)} ${f(cx - e)} ${f(y0)}Z`
}

// move a path (absolute commands shift, relative ones ride along)
const ARGS = { M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7, Z: 0 }
function shift(d, dx, dy) {
  const toks = d.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) || []
  let cmd = '', k = 0, out = ''
  for (const t of toks) {
    if (/[A-Za-z]/.test(t)) { cmd = t; k = 0; out += t; continue }
    let v = Number(t)
    const U = cmd.toUpperCase(), n = ARGS[U] || 2, i = k++ % n
    if (cmd === U) {
      if (U === 'H') v += dx
      else if (U === 'V') v += dy
      else if (U === 'A') { if (i === 5) v += dx; if (i === 6) v += dy }
      else v += i % 2 ? dy : dx
    }
    out += (/[A-Za-z]$/.test(out) ? '' : ' ') + f(v)
  }
  return out
}
const at = (d, j) => AXIS === 'x' ? shift(d, STEP[j], 0) : shift(d, 0, STEP[j])

// the vertical extent of a path, for bounding-box gradient units
function ySpan(d) {
  let lo = Infinity, hi = -Infinity
  for (const s of parsePath(d, 0.05)) for (const p of s.pts) { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]) }
  return [lo, hi]
}

export default function render(icon) {
  const name = (icon && icon.name) || 'more-vertical'
  const Ls = layers(model(skeleton(name)))
  const ink = col('ink')
  Ls.list = Ls.list.filter(L => L.fill !== ink)
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  Ls.glint = null // the glint is drawn once, below, not on every ball
  const one = emit(Ls, name, 0)
  const defs = one[0][0] === 'defs' ? one.shift() : null
  const grad = new Map(defs ? defs[2].map(g => [g[1].id, g]) : [])
  one.splice(one.findIndex(n => n[1].class === 'wm-shine'), 0, ['path', { d: lens(CX, CY), fill: ink, class: 'wm-k' }])

  const out = []
  for (const [tag, a] of one) {
    const g = grad.get((/^url\(#(.+)\)$/.exec(a.fill) || [])[1])
    if (g) {
      // userSpace y1..y2 -> fractions of this layer's own height, so the ramp follows each copy
      const [lo, hi] = ySpan(a.d), h = hi - lo, ga = g[1]
      g[1] = { id: ga.id, x1: 0, y1: +f((ga.y1 - lo) / h), x2: 0, y2: +f((ga.y2 - lo) / h) }
    }
    // a row shares its height, so a gradient layer stays one path; a column needs one path per ball
    if (g && AXIS === 'y') for (const j of STOPS.keys()) out.push([tag, { ...a, d: at(a.d, j) }])
    else out.push([tag, { ...a, d: STOPS.map((_, j) => at(a.d, j)).join('') }])
  }
  const [gx, gy] = AXIS === 'x' ? [CX + STEP[0], CY] : [CX, CY + STEP[0]]
  out.push(['path', { d: star(gx - 2.35, gy - 2.35, 1.4, 0.34), fill: col('shine'), class: 'wm-shine' }])
  // a small bright reflection on every ball, so each stays a lit sphere at 16px
  for (const j of STOPS.keys()) { const [bx, by] = AXIS === 'x' ? [CX + STEP[j], CY] : [CX, CY + STEP[j]]; out.push(['circle', { cx: f(bx - 1.1), cy: f(by - 1.35), r: 0.6, fill: col('shine'), class: 'wm-shine' }]) }
  return defs ? [defs, ...out] : out
}
