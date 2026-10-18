// forge/hand/blueprint/user-plus.mjs — the drafted person with a plus badge that reads at 16px (the generated drawing
// drew a small plus at the figure's weight with the Ø20 keyline brushing its right arm, and crossed chain axes through
// the small head so it read as a crosshair): the plus is larger and a touch heavier (1.4), the keyline breaks wide around
// it, the head is a clean circle, and the rings and dimension line stay on the figure.
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
  ...arcInk(6.5, 19.5, 4.5, 180, 270, 1.3), ...lineInk(6.5, 15, 10.5, 15, 1.3), ...arcInk(10.5, 19.5, 4.5, 270, 360, 1.3),
  [2, 21, 1.8], [15, 21, 1.8],
]

// the badge, centred on the motion origin (19, 10)
const BADGE = 'M19 7.25V12.75M16.25 10H21.75'
const BADGE_INK = [...lineInk(19, 7.25, 19, 12.75, 2.1), ...lineInk(16.25, 10, 21.75, 10, 2.1)]
const RIGHT = 21.75

export default function render() {
  return [
    ['path', { d: keyline([...FIGURE, ...BADGE_INK]), ...con(0.34) }],
    ['path', { d: `M3.1 23H13.9M16.1 23H${RIGHT}M${RIGHT} 21.2V23.3`, ...con(0.5) }],
    ['path', { d: `M1.35 23.65L2.65 22.35M${R(RIGHT - 0.65)} 23.65L${R(RIGHT + 0.65)} 22.35`, ...con(0.75, 0.5) }],
    ['path', { d: 'M12.25 7.5A3.75 3.75 0 0 1 4.75 7.5A3.75 3.75 0 0 1 12.25 7.5ZM2 19.43A4.5 4.5 0 0 1 6.5 15H10.5A4.5 4.5 0 0 1 15 19.43', class: 'wm-k' }],
    ['path', { d: BADGE, 'stroke-width': 1.4, class: 'wm-s' }],
    ['path', { d: ring(2, 21) + ring(15, 21), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
