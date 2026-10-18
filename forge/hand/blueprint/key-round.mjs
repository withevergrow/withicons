// forge/hand/blueprint/key-round.mjs — the drafted round-bow key, proportioned so the bit is the second read. The
// generated drawing crossed the bow with chain centre lines and shrank the hole to a speck; a first hand pass then grew
// the bow to r6.5 with a short handle, which mirrored blueprint's own search icon (a lens on a stick). Here the bow is a
// compact r5 ring on the motion's rock origin (15,9) with a centred r2 key-ring hole that stays open at 16px, the shaft
// runs 11u to a control ring at the tip, and two 2.8u teeth cut 3.5u apart make the bit, as in the 'key' sibling.
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
const INK = [
  ...arcInk(15, 9, 5, 0, 360, 1.3),
  ...lineInk(11.46, 12.54, 3, 21, 1.3), ...lineInk(4.25, 19.75, 2.25, 17.75, 1.3), ...lineInk(6.75, 17.25, 4.75, 15.25, 1.3),
  [3, 21, 1.8],
]

export default function render() {
  return [
    ['path', { d: keyline(INK), ...con(0.34) }],
    ['path', { d: 'M3 23H20M20 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M19.35 23.65L20.65 22.35', ...con(0.75, 0.5) }],
    // bow, shaft and the two cut teeth
    ['path', { d: 'M20 9A5 5 0 0 1 10 9A5 5 0 0 1 20 9ZM11.46 12.54L3.57 20.43M4.25 19.75L2.25 17.75M6.75 17.25L4.75 15.25', class: 'wm-k' }],
    // the centred key-ring hole (open ring, 2.75u clear inside)
    ['path', { d: 'M17 9A2 2 0 0 1 13 9A2 2 0 0 1 17 9Z', class: 'wm-a' }],
    ['path', { d: ring(3, 21), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
