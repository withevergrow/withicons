// forge/hand/blueprint/zap-off.mjs: the drafted bolt struck through. The bolt outline is one closed polygon clipped back
// evenly from a single slash (computed, so both sides of the break are the same width), the slash stays one unbroken
// stroke, and the only construction is a faint dimension line below, clear of the ink.
const ACCENT = 'var(--with-accent, currentColor)'
const R = v => Math.round(v * 100) / 100
const GAP = 3.4 // |y - x| clearance either side of the slash (the slash is y = x)
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

const BOLT = [[13, 4.5], [6.5, 13.5], [11.5, 13.5], [11, 19.5], [17.5, 10.5], [12.5, 10.5]]

// clip a closed polygon outline to the region |y - x| >= GAP, returning open polylines
function clip(pts) {
  const f = ([x, y]) => y - x
  const sides = []
  const n = pts.length
  const out = []
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], fa = f(a), fb = f(b)
    // parameter ranges where |f| >= GAP along a->b
    const ts = [0, 1]
    for (const g of [GAP, -GAP]) { const t = (g - fa) / (fb - fa); if (t > 0 && t < 1) ts.push(t) }
    ts.sort((p, q) => p - q)
    for (let k = 0; k < ts.length - 1; k++) {
      const t0 = ts[k], t1 = ts[k + 1], tm = (t0 + t1) / 2
      if (Math.abs(fa + (fb - fa) * tm) >= GAP) {
        out.push([[a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]])
      }
    }
  }
  // chain consecutive segments into polylines
  const lines = []
  for (const [p, q] of out) {
    const last = lines[lines.length - 1]
    const e = last && last[last.length - 1]
    if (e && Math.hypot(e[0] - p[0], e[1] - p[1]) < 1e-6) last.push(q)
    else lines.push([p, q])
  }
  // close the wrap-around if first and last join
  if (lines.length > 1) {
    const f0 = lines[0][0], l = lines[lines.length - 1], e = l[l.length - 1]
    if (Math.hypot(e[0] - f0[0], e[1] - f0[1]) < 1e-6) { l.push(...lines[0].slice(1)); lines.shift() }
  }
  return lines
}

export default function render() {
  const d = clip(BOLT).map(l => 'M' + l.map(([x, y]) => `${R(x)} ${R(y)}`).join('L')).join('')
  return [
    ['path', { d: 'M5.5 22.4H18.5M5.5 21.9V22.9M18.5 21.9V22.9', ...con(0.5) }],
    ['path', { d, class: 'wm-k' }],
    ['path', { d: 'M3.5 3.5L20.5 20.5', 'stroke-width': 1.5, class: 'wm-s' }],
  ]
}
