// forge/hand/sketch/plane-landing.mjs — a descending airliner with a fuller fuselage and broad swept wings in one
// marker outline over a pencil runway, replacing the thin generated plane whose needle wings vanished at 16px.
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
export default function render() {
  const plane = [[19.18, 11.89], ...arc(18.6, 13.5, 1.71, -70, 110, 4).slice(1), [14.4, 13.79], [8.6, 18.9], [7.4, 18.85], [6.4, 18.2],
    [10.2, 12.26], [6.4, 10.88], [5.1, 9.9], [5.6, 4.6], [6.4, 4.45], [6.9, 4.9], [7.9, 7.78],
    [11.2, 8.98], [11.8, 2.4], [13.1, 2.5], [14.15, 3.15], [15.4, 10.5]]
  return [
    ['path', { d: hatch(15.9, 13.0, 1.4) + hatch(17.6, 13.7, 1.1), ...SHADE }],
    ['path', { d: pencil([2.5, 21.5], [21.5, 21.5], 0.6), ...PENCIL, class: 'wm-a' }],
    ['path', { d: ink(plane, { closed: true, seed: 0.7, amp: 0.1, tail: 1 }), class: 'wm-k' }],
    ['path', { d: ink([[2.6, 21.5], [21.4, 21.5]], { seed: 3 }), class: 'wm-a' }],
  ]
}
