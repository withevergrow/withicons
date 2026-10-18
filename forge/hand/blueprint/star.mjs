// forge/hand/blueprint/star.mjs — the drafted five-point star with solid mitred points, set out on its true
// circumscribed circle (the generated drawing broke all five points open for control rings, so the tips read blunt and
// beaded at 16px): the chain circle through the five tips (centre 12,12.6 on the motion origin, r8.75, so the 1.25
// mitred tips stay inside 2.2-21.8 and match heart and lock in size) is the construction a draughtsman uses to set out
// a star, with the family's width dimension below, 2u clear of the lower tips' miters; no centre mark (read as a plus).
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const C = [12, 12.6], R = 8.75, RI = 0.4747, CLR = 1.3, DASH = [2.4, 0.7, 0.4, 0.7]
const r2 = v => Math.round(v * 100) / 100
// tips and notches alternate every 36 degrees from the top tip; notch radius keeps the original proportions
const STAR = Array.from({ length: 10 }, (_, k) => {
  const r = k % 2 ? R * RI : R, t = -Math.PI / 2 + k * Math.PI / 5
  return [r2(C[0] + r * Math.cos(t)), r2(C[1] + r * Math.sin(t))]
})

function segDist(p, a, b) {
  const abx = b[0] - a[0], aby = b[1] - a[1], apx = p[0] - a[0], apy = p[1] - a[1]
  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / (abx * abx + aby * aby)))
  return Math.hypot(apx - abx * t, apy - aby * t)
}
const clear = p => STAR.every((a, i) => segDist(p, a, STAR[(i + 1) % STAR.length]) >= CLR)

// the circle as chain dashes, one run between each pair of tips, each run starting its pattern afresh
function keyline() {
  const P = t => [C[0] + R * Math.cos(t), C[1] + R * Math.sin(t)]
  const N = 1440, ok = []
  for (let k = 0; k < N; k++) ok.push(clear(P(k / N * 2 * Math.PI)))
  const start = ok.indexOf(false), runs = []
  let s0 = -1
  for (let q = 1; q <= N; q++) {
    const k = (start + q) % N
    if (ok[k]) { if (s0 < 0) s0 = start + q } else if (s0 >= 0) { runs.push([s0, start + q - 1]); s0 = -1 }
  }
  let d = ''
  for (const [i, j] of runs) {
    const t0 = i / N * 2 * Math.PI, L = (j - i) / N * 2 * Math.PI * R
    for (let s = 0, n = 0; s < L - 1e-6; n++) {
      const len = DASH[n % 4]
      if (n % 2 === 0) {
        const e = Math.min(L, s + len)
        if (e - s > 0.3) {
          const A = P(t0 + s / R), B = P(t0 + e / R)
          d += `M${r2(A[0])} ${r2(A[1])}` + (e - s > 1 ? `A${R} ${R} 0 0 1 ` : 'L') + `${r2(B[0])} ${r2(B[1])}`
        }
      }
      s += len
    }
  }
  return d
}

export default function render() {
  return [
    ['path', { d: 'M2.5 23H21.5M2.5 21.7V23.3M21.5 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: keyline(), ...con(0.34) }],
    ['path', { d: 'M' + STAR.map(p => p.join(' ')).join('L') + 'Z' }],
  ]
}
