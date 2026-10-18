// forge/hand/sketch/taxi.mjs — a side-view car with a big hatched roof light and a dashed checker stripe along its
// flank, replacing the generated car whose tiny roof sign left it reading as any car at 16px.
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
  const body = [[5, 18.5], ...arc(4, 17, 1.5, 90, 180, 2), ...arc(4.5, 14, 2, 180, 270, 2), [6, 12], [8.25, 8], [13.75, 8], [17.25, 12],
    ...arc(19.5, 14, 2, -90, 0, 2), ...arc(20, 17, 1.5, 0, 90, 2), [19, 18.5]]
  const sign = [[8.5, 8], [8.5, 5.75], ...arc(9.25, 5.75, 0.75, 180, 270, 2), ...arc(12.75, 5.75, 0.75, 270, 360, 2), [13.5, 8]]
  return [
    ['path', { d: hatch(11.3, 6.6, 2.2) + hatch(12.8, 6.9, 0.9), ...SHADE }],
    ['path', { d: pencil([6, 12], [17.25, 12], 1), ...PENCIL, class: 'wm-a' }],
    ['path', { d: ink(body, { seed: 1.4 }) + ink([[9.6, 18.5], [14.4, 18.5]], { seed: 2 }) + ink(arc(7.25, 18.5, 2.1, 200, 560, 12), { seed: 3, amp: 0.06 })
      + ink(arc(16.75, 18.5, 2.1, 200, 560, 12), { seed: 4, amp: 0.06 }), class: 'wm-k' }],
    ['path', { d: ink(sign, { seed: 2.5, amp: 0.06 }) + ink([[6, 12], [17.25, 12]], { seed: 5 }) + 'M4.4 14.75L5.6 14.75M7.9 14.75L9.1 14.75M11.4 14.75L12.6 14.75M14.9 14.75L16.1 14.75M18.4 14.75L19.6 14.75', class: 'wm-a' }],
  ]
}
