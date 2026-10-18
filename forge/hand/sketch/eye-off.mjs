// forge/hand/sketch/eye-off.mjs — hand-redrawn for sketch: clean gaps where parts cross, hatch kept out of the way
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
  // eye outline as four cubics; point-symmetric about (12,12), so the gap around the slash is the same on both sides
  const U1 = [[2.6, 12], [5.2, 7.6], [8.5, 5.6], [12, 5.6]]
  const U2 = [[12, 5.6], [15.5, 5.6], [18.8, 7.6], [21.4, 12]]
  const L1 = [[2.6, 12], [5.2, 16.4], [8.5, 18.4], [12, 18.4]]
  const L2 = [[21.4, 12], [18.8, 16.4], [15.5, 18.4], [12, 18.4]]
  const cub = (c) => ['C', c[1][0], c[1][1], c[2][0], c[2][1], c[3][0], c[3][1]]
  const rev = (c) => [c[3], c[2], c[1], c[0]]
  const m = (c) => ['M', c[0][0], c[0][1]]
  const u1a = split(U1, 0.38)[0]
  const u1b = split(U1, 0.66)[1]
  const l2a = split(L2, 0.38)[0]
  const l2b = split(L2, 0.66)[1]
  // piece below-left of the slash: upper-left lid down to the corner, lower lid round to the bottom, up the lower-right lid
  const A = [m(rev(u1a)), cub(rev(u1a)), cub(L1).slice(0, 0).length ? cub(L1) : cub(L1), cub(rev(l2b))]
  A.splice(2, 1, cub(L1))
  // piece above-right of the slash
  const B = [m(u1b), cub(u1b), cub(U2), cub(l2a)]
  const slash = [['M', 3.6, 3.6], ['L', 20.4, 20.4]]
  const pupil = arc(14.2, 9.2, 1.7, 1.7, 0, 360)
  const pup = [['M', 15.9, 9.2], ...pupil]
  return [
    ghost(pen(A, 0.3, 2) + pen(B, 0.3, 2)),
    ['path', { d: pen(A, 0.1, 0) + pen(B, 0.1, 0), class: 'wm-k' }],
    ['path', { d: pen(pup, 0.06, 0), fill: 'currentColor', 'stroke-width': 0.6, class: 'wm-a' }],
    ghost(pen(slash, 0.28, 5)),
    ['path', { d: pen(slash, 0.1, 3), 'stroke-width': 1.5, class: 'wm-s' }],
  ]
}
