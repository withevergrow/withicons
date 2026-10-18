// forge/hand/solid/dragon-head.mjs — dragon head redrawn for solid as one bold silhouette: a broad horned skull
// tapering to a long snout, two big swept-back horns, two slanted eye cutouts and nostrils. No fangs, whiskers or
// spikes, so it reads at 16px. Head wm-k (holes by reverse winding), horns wm-a (sway).
const r = n => Math.round(n * 100) / 100
// a shape: [start, [c1, c2, end], ...] or [p] for a line
function d(shape, wantSign) {
  const pts = [shape[0], ...shape.slice(1).map(s => s[s.length - 1])]
  let a = 0
  for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1] }
  let s = shape
  if (Math.sign(a) !== wantSign) {
    const segs = shape.slice(1), start = segs[segs.length - 1].at(-1)
    const out = [start]
    for (let i = segs.length - 1; i >= 0; i--) {
      const to = i === 0 ? shape[0] : segs[i - 1].at(-1)
      out.push(segs[i].length === 3 ? [segs[i][1], segs[i][0], to] : [to])
    }
    s = out
  }
  const f = p => `${r(p[0])} ${r(p[1])}`
  return 'M' + f(s[0]) + s.slice(1).map(g => g.length === 3 ? `C${f(g[0])} ${f(g[1])} ${f(g[2])}` : `L${f(g[0])}`).join('') + 'Z'
}
const mx = shape => shape.map((g, i) => i === 0 ? [24 - g[0], g[1]] : g.map(p => [24 - p[0], p[1]]))
const circ = (cx, cy, rr) => { const k = rr * 0.5523; return [[cx + rr, cy], [[cx + rr, cy + k], [cx + k, cy + rr], [cx, cy + rr]], [[cx - k, cy + rr], [cx - rr, cy + k], [cx - rr, cy]], [[cx - rr, cy - k], [cx - k, cy - rr], [cx, cy - rr]], [[cx + k, cy - rr], [cx + rr, cy - k], [cx + rr, cy]]] }

const HEAD = [[12, 4.6],
  [[15.6, 4.6], [18.6, 6.6], [18.6, 10.4]], [[18.6, 13], [17.4, 14.6], [16.6, 16]],
  [[16.3, 18.5], [16.4, 21.8], [12, 21.8]], [[7.6, 21.8], [7.7, 18.5], [7.4, 16]],
  [[6.6, 14.6], [5.4, 13], [5.4, 10.4]], [[5.4, 6.6], [8.4, 4.6], [12, 4.6]]]
const EYE = [[13.4, 10.6], [[17, 9]], [[17, 11], [16.1, 12.2], [14.8, 12.2]], [[13.9, 12.2], [13.4, 11.5], [13.4, 10.6]]]
const NOSE = [[12.9, 18.2], [[13.9, 17.8]], [[14.2, 18.9]], [[13.2, 19.2]]]
const HORN = [[14.6, 5.4], [[15.4, 2.8], [18, 1.4], [21.6, 1.2]], [[19.6, 2.8], [18.6, 5], [18.4, 8]], [[17.6, 6.6], [16.2, 5.6], [14.6, 5.4]]]

export default function render() {
  const head = [d(HEAD, 1), d(EYE, -1), d(mx(EYE), -1), d(NOSE, -1), d(mx(NOSE), -1)].join('')
  return [
    ['path', { d: head, class: 'wm-k' }],
    ['path', { d: d(HORN, 1) + d(mx(HORN), 1), class: 'wm-a' }],
  ]
}
