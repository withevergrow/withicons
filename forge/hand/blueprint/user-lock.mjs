// forge/hand/blueprint/user-lock.mjs — the drafted person with a padlock badge that reads at 16px. The generated drawing
// drew the padlock nearly as tall as the figure (shackle up to y10) with a centre mark crossing it, so the lock swallowed
// the person and the two shapes ran into one cluster at 24px: here the padlock is a compact badge (7 x 5.5 body, small
// shackle) tucked bottom-right with a 3.7u gap from the shoulder ring, a keyhole so it reads as a lock, the head is a
// clean circle, and the construction keeps to the broken keyline, the shoulder's rings and the dimension line.
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

const FIGURE = [
  ...arcInk(8.5, 7.5, 3.75, 0, 360, 1.3),
  ...arcInk(6.5, 19.5, 4.5, 180, 270, 1.3), ...lineInk(6.5, 15, 10.5, 15, 1.3),
  [2, 21, 1.8], [11.3, 15, 1.8],
]
// padlock: body 15..22 x 15.5..21 (r1), shackle r1.75 about (18.5, 13.75). The whole badge box (x 14..23, y 11.5..22)
// counts as ink on a 0.5 grid, so the keyline breaks once over the badge and never leaves a fragment inside it.
const LOCK = [
  ...lineInk(15, 15.5, 22, 15.5, 1.5), ...lineInk(22, 15.5, 22, 21, 1.5), ...lineInk(15, 15.5, 15, 21, 1.5), ...lineInk(15, 21, 22, 21, 1.5),
  ...arcInk(18.5, 13.75, 1.75, 180, 360, 1.5), [16.75, 14.75, 1.5], [20.25, 14.75, 1.5],
]
for (let x = 14; x <= 23; x += 0.5) for (let y = 11.5; y <= 22; y += 0.5) LOCK.push([x, y, 0.6])

export default function render() {
  return [
    ['path', { d: keyline([...FIGURE, ...LOCK]), ...con(0.34) }],
    ['path', { d: 'M3.1 23H22M22 21.9V23.3', ...con(0.5) }],
    ['path', { d: 'M1.35 23.65L2.65 22.35M21.35 23.65L22.65 22.35', ...con(0.75, 0.5) }],
    // the person: head and the near shoulder, stopped short of the badge
    ['path', { d: 'M12.25 7.5A3.75 3.75 0 0 1 4.75 7.5A3.75 3.75 0 0 1 12.25 7.5ZM2 20.2V19.5A4.5 4.5 0 0 1 6.5 15H10.5', class: 'wm-k' }],
    ['path', { d: ring(2, 21) + ring(11.3, 15), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
    // the padlock badge: shackle (moves), a 7 x 5.5 body and a solid round keyhole (dot plus tapered slot) that stays
    // open inside the body at 16px
    ['path', { d: 'M16.75 15.5V13.75A1.75 1.75 0 0 1 20.25 13.75V15.5', class: 'wm-a' }],
    ['path', { d: 'M16 15.5H21A1 1 0 0 1 22 16.5V20A1 1 0 0 1 21 21H16A1 1 0 0 1 15 20V16.5A1 1 0 0 1 16 15.5Z', class: 'wm-s' }],
    ['path', { d: 'M19.3 17.9A.8.8 0 0 1 17.7 17.9A.8.8 0 0 1 19.3 17.9ZM18.15 18.4H18.85L19.05 19.65H17.95Z', fill: 'currentColor', stroke: 'none', class: 'wm-s' }],
  ]
}
