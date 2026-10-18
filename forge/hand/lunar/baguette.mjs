// forge/hand/lunar/baguette.mjs — a red lacquer baguette with a gentle bow and tapered ends, three long diagonal
// gold-foil scores opened into pointed leaf cuts, and the paper-cut gold line inside its crust; the generated loaf
// was a straight even capsule with round pill slots, so it read as a sausage.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const P = (x, y) => `${r2(x)} ${r2(y)}`
const glint = (x, y, r) => {
  const w = r * 0.09
  return `M${P(x, y - r)}Q${P(x + w, y - w)} ${P(x + r, y)}Q${P(x + w, y + w)} ${P(x, y + r)}` +
    `Q${P(x - w, y + w)} ${P(x - r, y)}Q${P(x - w, y - w)} ${P(x, y - r)}z`
}
// a closed smooth loop through points (Catmull-Rom as cubics)
function loop(pts) {
  const n = pts.length, at = i => pts[(i + n) % n]
  let d = `M${P(...pts[0])}`
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
    d += `C${P(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)} ${P(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)} ${P(...p2)}`
  }
  return d + 'Z'
}

// the loaf's axis: a quadratic bow from the lower-left tip to the upper-right tip
const A0 = [3.6, 20.4], A1 = [10.6, 10.6], A2 = [20.4, 3.6]
const axis = t => [(1 - t) ** 2 * A0[0] + 2 * t * (1 - t) * A1[0] + t * t * A2[0], (1 - t) ** 2 * A0[1] + 2 * t * (1 - t) * A1[1] + t * t * A2[1]]
const tangent = t => {
  const x = 2 * (1 - t) * (A1[0] - A0[0]) + 2 * t * (A2[0] - A1[0]), y = 2 * (1 - t) * (A1[1] - A0[1]) + 2 * t * (A2[1] - A1[1])
  const l = Math.hypot(x, y)
  return [x / l, y / l]
}
// half-width: full through the middle, tapering to blunt points
const half = t => 3.25 * Math.pow(Math.max(0, 1 - Math.abs(2 * t - 1) ** 3), 0.5)

function outline(inset, tA, tB, n) {
  const L = [], R = []
  for (let k = 0; k <= n; k++) {
    const s = k / n, t = tA + (tB - tA) * (1 - Math.cos(Math.PI * s)) / 2
    const c = axis(t), [tx, ty] = tangent(t), h = Math.max(0, half(t) - inset)
    L.push([c[0] - ty * h, c[1] + tx * h]); R.push([c[0] + ty * h, c[1] - tx * h])
  }
  // drop the duplicated tip points when the loop is pointed
  const right = R.reverse()
  if (inset === 0) { right.shift(); right.pop() }
  return L.concat(right)
}

// a leaf-shaped score cut across the loaf at axis position t
function score(t, len, w, ang) {
  const c = axis(t), [tx, ty] = tangent(t)
  const ca = Math.cos(ang), sa = Math.sin(ang)
  const dx = tx * ca - ty * sa, dy = tx * sa + ty * ca, nx = -dy, ny = dx
  const a = [c[0] - dx * len / 2, c[1] - dy * len / 2], b = [c[0] + dx * len / 2, c[1] + dy * len / 2]
  return `M${P(...a)}Q${P(c[0] + nx * w * 2, c[1] + ny * w * 2)} ${P(...b)}Q${P(c[0] - nx * w * 2, c[1] - ny * w * 2)} ${P(...a)}Z`
}

export default function render(icon) {
  const id = n => `wg-lunar-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const outer = outline(0, 0, 1, 34)
  // the paper-cut line, ending where the crust gets too thin to hold it
  let tA = 0
  while (half(tA) < 1.5) tA += 0.005
  const inner = outline(1.05, tA, 1 - tA, 30)
  const scores = [0.3, 0.5, 0.7].map(t => score(t, 5.4, 0.8, -0.62)).join('')
  // glint on the upper-left-most point of the rim
  let g = outer[0], gs = Infinity
  for (const p of outer) { const s = p[0] + p[1] * 1.15; if (s < gs) { gs = s; g = p } }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 2.2, x2: 0, y2: 21.8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 2.2, y1: 2.2, x2: 21.8, y2: 21.8, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    ['path', { d: loop(outer), fill: url(0), stroke: url(1), 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: loop(inner), fill: 'none', stroke: C.accent, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['path', { d: scores, fill: url(1), stroke: C.c2, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: glint(g[0] + 0.15, g[1] + 0.15, 0.95), fill: C.shine, class: 'wm-shine' }],
  ]
}
