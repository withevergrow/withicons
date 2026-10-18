// forge/hand/sketch/edit.mjs — hand-redrawn for sketch: clean gaps where parts cross, hatch kept out of the way
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
  // square with its top-right corner opened for the pencil
  const sq = [
    ['M', 12.5, 5],
    ['L', 5.6, 5],
    ['Q', 3.5, 5, 3.5, 7.1],
    ['L', 3.5, 18.4],
    ['Q', 3.5, 20.5, 5.6, 20.5],
    ['L', 16.9, 20.5],
    ['Q', 19, 20.5, 19, 18.4],
    ['L', 19, 12],
  ]
  // pencil on the 45 degree axis, tip down-left: body, round end cap, eraser band, filled lead
  const pencil = [
    ['M', 7.8, 16.2],
    ['L', 8.79, 12.67],
    ['L', 16.93, 4.53],
    ...arc(18.2, 5.8, 1.8, 1.8, 225, 405),
    ['L', 11.33, 15.21],
    ['L', 7.8, 16.2],
  ]
  const band = [['M', 15.13, 6.33], ['L', 17.67, 8.87]]
  const lead = [['M', 7.8, 16.2], ['L', 8.2, 14.76], ['L', 9.24, 15.8], ['L', 7.8, 16.2]]
  return [
    hatch([[11.4, 19.1, 15.7, 15.4], [14.4, 19.3, 17, 17.1]]),
    ghost(pen(sq, 0.3, 2)),
    ['path', { d: pen(sq, 0.1, 0), class: 'wm-k' }],
    ghost(pen(pencil, 0.3, 4)),
    ['path', { d: pen(pencil, 0.1, 1) + pen(band, 0.1, 1), class: 'wm-a' }],
    ['path', { d: pen(lead, 0.05, 1), fill: 'currentColor', 'stroke-width': 0.8, class: 'wm-a' }],
  ]
}
