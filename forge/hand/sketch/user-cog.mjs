// forge/hand/sketch/user-cog.mjs: person at the left, and a large six-tooth cog with a hollow centre at the lower
// right, spaced clear of the shoulders.
const R = (v) => Math.round(v * 100) / 100
const smooth = (pts) => {
  let d = `M${R(pts[0][0])} ${R(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]
    d += `Q${R(pts[i][0])} ${R(pts[i][1])} ${R(m[0])} ${R(m[1])}`
  }
  const l = pts[pts.length - 1]
  return d + `L${R(l[0])} ${R(l[1])}`
}
// hand-wobbled arc (angles in degrees, SVG orientation); a full circle overshoots slightly like a pencil loop
const arc = (cx, cy, r, a0, a1, ph = 0) => {
  const n = Math.max(6, Math.round(Math.abs(a1 - a0) / 18))
  const pts = []
  for (let i = 0; i <= n; i++) {
    const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180
    const rr = r * (1 + 0.025 * Math.sin(a * 3 + ph))
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  }
  return smooth(pts)
}
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
const gear = (cx, cy, ro, rv) => {
  const pts = []
  for (let k = 0; k < 6; k++) {
    const c = k * 60 - 90
    for (const [da, rr] of [[-25, rv], [-14, ro], [14, ro], [25, rv]]) {
      const a = (c + da) * Math.PI / 180
      pts.push(`${R(cx + rr * Math.cos(a))} ${R(cy + rr * Math.sin(a))}`)
    }
  }
  return 'M' + pts.join('L') + 'Z'
}
export default function render() {
  const head = arc(9, 8, 3.8, -90, 272, 0.6)
  const body = 'M2.8 21.4Q2.7 15.8 9 15.7Q10.8 15.9 12 16.5'
  const cog = gear(18.1, 17.5, 4.3, 3.1)
  return [
    ['path', { d: 'M5 20.4L6.6 18.6', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(head + body), ...GHOST, class: 'wm-k' }],
    ['path', { d: head + body, class: 'wm-k' }],
    ['path', { d: g(cog), ...GHOST, class: 'wm-s' }],
    ['path', { d: cog, class: 'wm-s' }],
    ['circle', { cx: 18.1, cy: 17.5, r: 1.3, class: 'wm-s' }],
  ]
}
