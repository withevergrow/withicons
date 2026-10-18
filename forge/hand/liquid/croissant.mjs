// forge/hand/liquid/croissant.mjs — a croissant as five plump rolls of glass fanned along a thick crescent: a fat
// clear-blue roll in the middle, a violet roll either side of it, and a small clear-blue horn curling down at each end.
// The rolls are slices of one crescent, parted by a clean 1u channel and each bulging a little past the line of the
// crescent, so the outer edge scallops like laminated dough; the violet / clear alternation gives the strong tonal step
// the generated blob lacked (one crescent with hairline grooves, which read as a vague shell).
// Same glass recipe as the generator (_liquid-core.mjs build); only the geometry is drawn here.
import { build } from '../../styles/_liquid-core.mjs'

const CX = 12, CY = 15.6 // centre of the crescent's ellipse
const EA = 8.4, EB = 6.4 // its half-width and half-height (the spine is wider than tall)
const PHI = 105 * Math.PI / 180 // the spine runs 105 degrees either side of straight up
const GAP = 1.0          // channel between rolls (u is -1 .. 1 along the spine)
const SPAN = 30          // length of the whole spine, so GAP / SPAN is the gap as a share of u (-1 .. 1)
// full width of the crescent at u: slim horns, a fat middle
const width = u => 3.6 + 4.2 * Math.pow(Math.max(0, 1 - u * u), 0.8)
// a point on the crescent at u, pushed out along the normal by d
const at = (u, d) => {
  const a = u * PHI, nx = EB * Math.sin(a), ny = -EA * Math.cos(a), l = Math.hypot(nx, ny)
  return [CX + EA * Math.sin(a) + nx / l * d, CY - EB * Math.cos(a) + ny / l * d]
}
// round the sharp corners of a polygon: each corner is replaced by a quadratic curve that starts and ends r along
// its two edges (nearly straight joints are left alone)
const roundPoly = (ring, r) => {
  const out = [], n = ring.length
  for (let i = 0; i < n; i++) {
    const p = ring[(i + n - 1) % n], v = ring[i], q = ring[(i + 1) % n]
    const a = [p[0] - v[0], p[1] - v[1]], b = [q[0] - v[0], q[1] - v[1]], la = Math.hypot(...a), lb = Math.hypot(...b)
    const cos = (a[0] * b[0] + a[1] * b[1]) / (la * lb)
    if (cos < -0.9) { out.push(v); continue }
    const ra = Math.min(r, la * 0.45), rb = Math.min(r, lb * 0.45)
    const p0 = [v[0] + a[0] / la * ra, v[1] + a[1] / la * ra], p1 = [v[0] + b[0] / lb * rb, v[1] + b[1] / lb * rb]
    for (let k = 0; k <= 6; k++) {
      const t = k / 6, w0 = (1 - t) * (1 - t), w1 = 2 * t * (1 - t), w2 = t * t
      out.push([w0 * p0[0] + w1 * v[0] + w2 * p1[0], w0 * p0[1] + w1 * v[1] + w2 * p1[1]])
    }
  }
  return out
}
// one roll between u0 and u1: its outer edge bulges, its inner edge stays on the crescent
function roll(u0, u1, plate) {
  const a = u0 + GAP / SPAN / 2, b = u1 - GAP / SPAN / 2, N = 10
  const outer = [], inner = []
  for (let i = 0; i <= N; i++) {
    const u = a + (b - a) * i / N, bulge = 0.7 * Math.sin(Math.PI * i / N)
    outer.push(at(u, width(u) / 2 + bulge)); inner.push(at(u, -width(u) / 2))
  }
  const ring = roundPoly([...outer, ...inner.reverse()], 1.3)
  // the hidden line: a short run along the core of the roll, ending 1.5u inside each end so its stroke stays in the roll
  const m = 1.5 / SPAN * 2, line = []
  for (let i = 0; i <= 3; i++) line.push(at(a + m + (b - a - 2 * m) * i / 3, 0.3))
  return { set: [ring], plate, line }
}

function skeleton(name, parts) {
  const lines = [], fills = []
  for (const p of parts) {
    lines.push({ pts: p.line, closed: true, plate: p.plate, pathId: 'p' })
    fills.push({ subs: p.set.map(r => ({ pts: r, closed: true })), set: p.set })
  }
  return { name, paths: [], cutouts: [], lines, fills }
}

export default function render(icon) {
  const B = [-1, -0.62, -0.25, 0.25, 0.62, 1]
  return build(skeleton((icon && icon.name) || 'croissant', [
    roll(B[0], B[1], 'K'), roll(B[1], B[2], 'A'), roll(B[2], B[3], 'K'), roll(B[3], B[4], 'A'), roll(B[4], B[5], 'K'),
  ]))
}
