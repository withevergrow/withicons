// forge/hand/blueprint/component.mjs — the drafted four-diamond component symbol. The generated drawing ran chain
// centre lines through the middle of all four diamonds and scattered stray ticks on the canvas edge, so at 16-24px each
// diamond carried a crosshair and the cluster turned into a dense knot: here the four diamonds are clean object line with
// open gaps, the axes shrink to one centre mark in the empty middle, and the construction is the keyline broken clear of
// the diamond points plus the width dimension below.
const ACCENT = 'var(--with-accent, currentColor)'
const CHAIN = [2.4, 0.7, 0.4, 0.7]
const R = v => Math.round(v * 100) / 100
const P = (x, y) => `${R(x)} ${R(y)}`
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

// ink samples [x, y, clearance] that construction keeps away from
const arcInk = (cx, cy, r, a0, a1, c) => {
  const out = [], n = Math.ceil(Math.abs(a1 - a0) * Math.PI / 180 * r / 0.25)
  for (let i = 0; i <= n; i++) { const t = (a0 + (a1 - a0) * i / n) * Math.PI / 180; out.push([cx + r * Math.cos(t), cy + r * Math.sin(t), c]) }
  return out
}
const lineInk = (ax, ay, bx, by, c) => {
  const out = [], n = Math.ceil(Math.hypot(bx - ax, by - ay) / 0.25)
  for (let i = 0; i <= n; i++) out.push([ax + (bx - ax) * i / n, ay + (by - ay) * i / n, c])
  return out
}
const clear = (ink, x, y) => ink.every(([u, v, c]) => Math.hypot(x - u, y - v) > c)

// the Ø20 keyline as a chain (long dash, dot) hairline, broken wherever it would come near the ink
function keyline(ink) {
  const r = 10, L = 2 * Math.PI * r, n = Math.ceil(L / 0.1)
  const pt = s => [12 + r * Math.cos(s / r), 12 + r * Math.sin(s / r)]
  const ok = []
  for (let i = 0; i < n; i++) ok.push(clear(ink, ...pt(L * i / n)))
  const start = Math.max(0, ok.indexOf(false)), runs = []
  let s0 = -1
  for (let q = 1; q <= n; q++) {
    const i = (start + q) % n
    if (ok[i] && s0 < 0) s0 = start + q
    if ((!ok[i] || q === n) && s0 >= 0) { runs.push([L * s0 / n, L * (ok[i] ? start + q : start + q - 1) / n]); s0 = -1 }
  }
  let d = ''
  for (const [a, b] of runs) {
    if (b - a < 0.55) continue
    let s = a, k = 0
    while (s < b - 0.05) {
      const e = Math.min(b, s + CHAIN[k % 4])
      if (k % 2 === 0 && e - s > 0.3) d += `M${P(...pt(s))}A10 10 0 0 1 ${P(...pt(e))}`
      s = e; k++
    }
  }
  return d
}
const dia = (cx, cy) => `M${cx + 0.53} ${cy - 2.97}L${R(cx + 2.97)} ${R(cy - 0.53)}A.75.75 0 0 1 ${R(cx + 2.97)} ${R(cy + 0.53)}L${R(cx + 0.53)} ${R(cy + 2.97)}A.75.75 0 0 1 ${R(cx - 0.53)} ${R(cy + 2.97)}L${R(cx - 2.97)} ${R(cy + 0.53)}A.75.75 0 0 1 ${R(cx - 2.97)} ${R(cy - 0.53)}L${R(cx - 0.53)} ${R(cy - 2.97)}A.75.75 0 0 1 ${R(cx + 0.53)} ${R(cy - 2.97)}Z`
const diaInk = (cx, cy) => [
  ...lineInk(cx, cy - 3.5, cx + 3.5, cy, 1.3), ...lineInk(cx + 3.5, cy, cx, cy + 3.5, 1.3),
  ...lineInk(cx, cy + 3.5, cx - 3.5, cy, 1.3), ...lineInk(cx - 3.5, cy, cx, cy - 3.5, 1.3),
]
const INK = [...diaInk(12, 5.5), ...diaInk(18.5, 12), ...diaInk(12, 18.5), ...diaInk(5.5, 12)]

export default function render() {
  return [
    ['path', { d: keyline(INK), ...con(0.34) }],
    // centre mark in the empty middle, and the width dimension
    ['path', { d: 'M10.2 12H11.6M12.4 12H13.8M12 10.2V11.6M12 12.4V13.8', ...con(0.5) }],
    ['path', { d: 'M2.31 23H21.69M2.31 21.7V23.3M21.69 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M1.66 23.65L2.96 22.35M21.04 23.65L22.34 22.35', ...con(0.75, 0.5) }],
    ['path', { d: dia(12, 5.5) + dia(12, 18.5), class: 'wm-k' }],
    ['path', { d: dia(18.5, 12) + dia(5.5, 12), class: 'wm-a' }],
  ]
}
