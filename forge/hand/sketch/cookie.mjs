// forge/hand/sketch/cookie.mjs — hand-redrawn for sketch: clean gaps where parts cross, hatch kept out of the way
const r2 = (n) => Math.round(n * 100) / 100
const wob = (x, y, a, p) => [x + a * Math.sin(y * 1.7 + p), y + a * Math.cos(x * 1.3 + p * 1.3)]
// segs: ['M',x,y] ['L',x,y] ['Q',cx,cy,x,y] ['C',x1,y1,x2,y2,x,y]; straight lines bow slightly, like a pencil line
function pen(segs, a, p) {
  let d = ''
  let cx = 0
  let cy = 0
  const w = (x, y) => { const q = wob(x, y, a, p); return r2(q[0]) + ' ' + r2(q[1]) }
  for (const s of segs) {
    if (s[0] === 'M') d += 'M' + w(s[1], s[2])
    else if (s[0] === 'L') {
      const dx = s[1] - cx
      const dy = s[2] - cy
      const len = Math.hypot(dx, dy) || 1
      const b = Math.min(len * 0.035, 0.32) * (a > 0.2 ? 2 : 1) * (Math.sin(cx * 2.1 + cy * 0.7 + p) > 0 ? 1 : -1)
      d += 'Q' + w((cx + s[1]) / 2 - (dy / len) * b, (cy + s[2]) / 2 + (dx / len) * b) + ' ' + w(s[1], s[2])
    } else if (s[0] === 'Q') d += 'Q' + w(s[1], s[2]) + ' ' + w(s[3], s[4])
    else d += 'C' + w(s[1], s[2]) + ' ' + w(s[3], s[4]) + ' ' + w(s[5], s[6])
    cx = s[s.length - 2]
    cy = s[s.length - 1]
  }
  return d
}
const pt = (cx, cy, rx, ry, a) => [cx + rx * Math.cos((a * Math.PI) / 180), cy + ry * Math.sin((a * Math.PI) / 180)]
function arc(cx, cy, rx, ry, a0, a1) {
  const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / 90))
  const out = []
  for (let i = 0; i < n; i++) {
    const s = a0 + ((a1 - a0) * i) / n
    const e = a0 + ((a1 - a0) * (i + 1)) / n
    const k = (4 / 3) * Math.tan(((e - s) * Math.PI) / 720)
    const sr = (s * Math.PI) / 180
    const er = (e * Math.PI) / 180
    const p0 = pt(cx, cy, rx, ry, s)
    const p1 = pt(cx, cy, rx, ry, e)
    out.push(['C', p0[0] - k * rx * Math.sin(sr), p0[1] + k * ry * Math.cos(sr), p1[0] + k * rx * Math.sin(er), p1[1] - k * ry * Math.cos(er), p1[0], p1[1]])
  }
  return out
}
// split a cubic at t (de Casteljau); returns [first, second] as [p0,c1,c2,p3]
function split(c, t) {
  const l = (a, b) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const [p0, p1, p2, p3] = c
  const a = l(p0, p1)
  const b = l(p1, p2)
  const cc = l(p2, p3)
  const d = l(a, b)
  const e = l(b, cc)
  const m = l(d, e)
  return [[p0, a, d, m], [m, e, cc, p3]]
}
const hatch = (lines) => ['path', { d: lines.map((q) => 'M' + r2(q[0]) + ' ' + r2(q[1]) + 'L' + r2(q[2]) + ' ' + r2(q[3])).join(''), 'stroke-width': 0.8, 'stroke-opacity': 0.5 }]
const ghost = (d) => ['path', { d, 'stroke-width': 0.5, 'stroke-opacity': 0.5 }]
export default function render() {
  // outline: three deep scoops (the bite) then the big round body
  const body = [
    ['M', 13.1, 3.6],
    ['Q', 13.3, 8, 16.4, 5.4],
    ['Q', 15.3, 9.3, 19.6, 8.4],
    ['Q', 17.3, 11.1, 20.5, 12.4],
    ...arc(11.5, 12.5, 9, 9, -0.6, 280.2),
  ]
  // chips: rounded irregular blobs, scattered unevenly so the cookie never reads as a face
  const blob = (v) => {
    const m = v.map((q, i) => [(q[0] + v[(i + 1) % v.length][0]) / 2, (q[1] + v[(i + 1) % v.length][1]) / 2])
    let d = 'M' + r2(m[v.length - 1][0]) + ' ' + r2(m[v.length - 1][1])
    for (let i = 0; i < v.length; i++) d += 'Q' + r2(v[i][0]) + ' ' + r2(v[i][1]) + ' ' + r2(m[i][0]) + ' ' + r2(m[i][1])
    return d
  }
  const chips = [
    [[7, 7.8], [9.4, 7.3], [9.9, 9.5], [7.4, 10]],
    [[13, 12.2], [15.3, 11.6], [15.7, 13.6], [13.4, 14]],
    [[7.4, 15.2], [9.7, 14.9], [10.4, 17.1], [8, 17.6]],
    [[14.3, 17.4], [16.4, 17], [16.7, 18.9], [14.6, 19.2]],
  ]
  return [
    hatch([[10.4, 20.2, 12.6, 18.3], [12.6, 20.6, 14, 19.4]]),
    ghost(pen(body, 0.3, 2)),
    ['path', { d: pen(body, 0.1, 0), class: 'wm-k' }],
    ['path', { d: chips.map(blob).join(''), fill: 'currentColor', 'stroke-width': 0.6, class: 'wm-a' }],
  ]
}
