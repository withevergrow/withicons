// forge/hand/sketch/toran.mjs — a toran garland: a tied string with marigold beads and three hanging mango leaves (midribs, hachure).
// ---- pen: the sketch recipe in miniature (ink 1.3 from the root, pencil 0.5 @50%, hachure 0.8 @50%) ----
const R2 = v => Math.round(v * 100) / 100
const wob = (i, s, a) => a * (0.6 * Math.sin(0.8 * i + s) + 0.4 * Math.sin(2.1 * i + s * 1.7))
// densify a polyline to ~1u steps and push every sample sideways by a slow wobble, then draw it as a quadratic
// B-spline through the midpoints; a closed loop runs on past its start with a drifting tail
function ink(pts, { closed = false, seed = 1, amp = 0.18, tail = 1.2 } = {}) {
  const P = closed ? [...pts, pts[0]] : pts, q = []
  for (let k = 0; k < P.length - 1; k++) {
    const [x0, y0] = P[k], [x1, y1] = P[k + 1], L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(L))
    if (L < 0.01) continue
    for (let j = 0; j < n; j++) q.push([x0 + (x1 - x0) * j / n, y0 + (y1 - y0) * j / n, -(y1 - y0) / L, (x1 - x0) / L])
  }
  const last = P[P.length - 1], pen = q[q.length - 1]
  q.push([last[0], last[1], pen[2], pen[3]])
  if (closed) for (let j = 1; j <= Math.round(tail); j++) { const o = q[j]; q.push([o[0] + 0.12 * j, o[1] - 0.1 * j, o[2], o[3]]) }
  const w = q.map(([x, y, nx, ny], i) => { const o = wob(i, seed, amp); return [x + nx * o, y + ny * o] })
  let d = `M${R2(w[0][0])} ${R2(w[0][1])}`
  for (let i = 1; i < w.length - 1; i++) d += `Q${R2(w[i][0])} ${R2(w[i][1])} ${R2((w[i][0] + w[i + 1][0]) / 2)} ${R2((w[i][1] + w[i + 1][1]) / 2)}`
  const z = w[w.length - 1]
  return d + `L${R2(z[0])} ${R2(z[1])}`
}
const arc = (cx, cy, r, a0, a1, n) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] })
// rounded rect, clockwise from the top-left corner's end
const rrect = (x0, y0, x1, y1, r) => [...arc(x1 - r, y0 + r, r, -90, 0, 2), ...arc(x1 - r, y1 - r, r, 0, 90, 2), ...arc(x0 + r, y1 - r, r, 90, 180, 2), ...arc(x0 + r, y0 + r, r, 180, 270, 2)]
// pencil construction line: a straight edge run out past both ends
const pencil = ([x0, y0], [x1, y1], e = 1.2) => { const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L; return `M${R2(x0 - ux * e)} ${R2(y0 - uy * e + 0.15)}L${R2(x1 + ux * e)} ${R2(y1 + uy * e - 0.1)}` }
// hachure at -38deg: a short stroke centred on (x, y), len long
const hatch = (x, y, len) => { const dx = 0.788 * len / 2, dy = 0.616 * len / 2; return `M${R2(x - dx)} ${R2(y + dy)}L${R2(x + dx)} ${R2(y - dy)}` }
const PENCIL = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }, SHADE = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const circ = (cx, cy, r, seed) => ink(arc(cx, cy, r, 200, 560, 10), { seed, amp: 0.05 })
// pointed mango leaf hanging from (x, y0) to its tip at (x, y1)
const leaf = (x, y0, y1, w) => { const L = y1 - y0, h = w / 2; return [[x, y0], [x + h * 0.8, y0 + 0.18 * L], [x + h, y0 + 0.42 * L], [x + h * 0.7, y0 + 0.7 * L], [x, y1], [x - h * 0.7, y0 + 0.7 * L], [x - h, y0 + 0.42 * L], [x - h * 0.8, y0 + 0.18 * L]] }
const LEAVES = [[5.6, 3.6, 14.5], [12, 4.2, 18.5], [18.4, 3.6, 14.5]]
export default function render() {
  let sh = ''
  for (const [x, y0, y1] of LEAVES) { const L = y1 - y0; for (const f of [0.4, 0.6]) sh += hatch(x + 0.9, y0 + f * L, 1.1) }
  return [
    ['path', { d: sh, ...SHADE }],
    ['path', { d: ink([[1.5, 2.6], [5, 3.6], [12, 4], [19, 3.6], [22.5, 2.6]], { seed: 1.3 }) 
      + circ(9.1, 4.1, 0.9, 3.7) + circ(14.9, 4.1, 0.9, 4.3), class: 'wm-k', 'stroke-width': 1.1 }],
    ['path', { d: LEAVES.map(([x, y0, y1], i) => ink(leaf(x, y0, y1, 3.8), { closed: true, seed: 5 + i, amp: 0.12, tail: 1 }) + ink([[x, y0 + 0.8], [x, y1 - 1.6]], { seed: 8 + i, amp: 0.08 })).join(''), class: 'wm-a' }],
  ]
}
