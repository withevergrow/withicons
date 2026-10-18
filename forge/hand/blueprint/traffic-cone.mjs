// forge/hand/blueprint/traffic-cone.mjs — the drafted traffic cone on a wide base slab with one reflective band whose
// edges wrap round the cone (the generated drawing stood two straight single rungs on a bare ground line, so the cone
// read as a letter A or a ladder at 16px): the slab overhangs the cone on both sides, the band is a clear stripe
// between two edges that sag like a ring round a round body, and a tip overhang of the axis, a faint keyline and one
// dimension line keep the drafting behind the ink.
const ACCENT = 'var(--with-accent, currentColor)'
const CHAIN = [2.4, 0.7, 0.4, 0.7]
const R = v => Math.round(v * 100) / 100
const P = (x, y) => `${R(x)} ${R(y)}`
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

// the object's ink as sampled polylines; construction keeps 1.3u clear of it
const segs = [
  [[2.5, 18], [21.5, 18]], [[21.5, 18], [21.5, 21]], [[21.5, 21], [2.5, 21]], [[2.5, 21], [2.5, 18]],
  [[5.17, 18], [10, 3.5]], [[10, 3.5], [14, 3.5]], [[14, 3.5], [18.83, 18]],
  [[8, 9.5], [12, 10.25], [16, 9.5]], [[7, 12.5], [12, 13.4], [17, 12.5]],
]
const ink = segs.flatMap(pl => pl.slice(1).flatMap((b, j) => { const a = pl[j]
  const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.2), o = []
  for (let i = 0; i <= n; i++) o.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n])
  return o
}))
const clear = (x, y, c = 1.3) => ink.every(([u, v]) => Math.hypot(x - u, y - v) > c)

function chain(pt, L, seg, c) {
  const n = Math.ceil(L / 0.1), ok = []
  for (let i = 0; i <= n; i++) { const p = pt(L * i / n); ok.push(clear(p[0], p[1], c) && p[0] > 0.7 && p[0] < 23.3 && p[1] > 0.7 && p[1] < 23.3) }
  const runs = []
  let s0 = -1
  for (let i = 0; i <= n; i++) {
    if (ok[i] && s0 < 0) s0 = i
    if ((!ok[i] || i === n) && s0 >= 0) { runs.push([L * s0 / n, L * (ok[i] ? i : i - 1) / n]); s0 = -1 }
  }
  let d = ''
  for (const [a, b] of runs) {
    if (b - a < 0.55) continue
    let s = a, k = 0
    while (s < b - 0.05) {
      const e = Math.min(b, s + CHAIN[k % 4])
      if (k % 2 === 0 && e - s > 0.3) d += seg(s, e)
      s = e; k++
    }
  }
  return d
}
const chainCircle = (cx, cy, r, c) => {
  const pt = s => [cx + r * Math.cos(s / r - Math.PI / 2), cy + r * Math.sin(s / r - Math.PI / 2)]
  return chain(pt, 2 * Math.PI * r, (a, b) => `M${P(...pt(a))}A${r} ${r} 0 0 1 ${P(...pt(b))}`, c)
}
const chainLine = (ax, ay, bx, by, c) => {
  const L = Math.hypot(bx - ax, by - ay), pt = s => [ax + (bx - ax) * s / L, ay + (by - ay) * s / L]
  return chain(pt, L, (a, b) => `M${P(...pt(a))}L${P(...pt(b))}`, c)
}

export default function render() {
  return [
    // faint Ø20 keyline, broken clear of the cone and the slab
    ['path', { d: chainCircle(12, 12, 10, 1.6), ...con(0.3) }],
    // the cone's axis of symmetry, as an overhang above the tip only (inside the body it read as a rung)
    ['path', { d: chainLine(12, 0.9, 12, 2.2, 1.2), ...con(0.5) }],
    // one dimension line under the slab
    ['path', { d: 'M2.5 23H21.5M2.5 22.2V23.4M21.5 22.2V23.4', ...con(0.5) }],
    ['path', { d: 'M2 23.5L3 22.5M21 23.5L22 22.5', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // base slab and cone body
    ['path', { d: 'M2.5 18H21.5V21H2.5ZM5.17 18L10 3.5H14L18.83 18', class: 'wm-k' }],
    // the reflective band, drawn by both edges
    ['path', { d: 'M8 9.5A11.04 11.04 0 0 0 16 9.5M7 12.5A14.34 14.34 0 0 0 17 12.5', class: 'wm-a' }],
  ]
}
