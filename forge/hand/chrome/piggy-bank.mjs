// forge/hand/chrome/piggy-bank.mjs — a clean chrome piggy bank in side view. Every part of the animal is its own
// polished piece with a dark steel edge, so the silhouette reads at 16px: a round body, a pointed ear standing up
// behind it, a blunt snout in front, two stubby legs, a curl of tail and a coin dropping into the slot on top.
// The earlier drawing fused everything on one distance field and melted into a blob with wavy banding. Here each
// piece uses the same crisp chrome ramps as the quiet siblings (a dark edge, a light bevel, a core with a sharp
// horizon), the coin is a small warm-metal jewel (wm-s, it drops in) and only a pinprick of accent sits on it.
const r2 = n => Math.round(n * 100) / 100
const f = n => String(r2(n))
const col = (r, hex) => `var(--with-chrome-${r}, ${hex})`
const C = {
  ink: '#10131B', c1: '#8794AA', c3: '#3E4556', c4: '#CDB9A4', tint: '#DCE5F2', accent: '#FF3E9E',
  shadow: '#1A1E2A', shine: '#FFFFFF', edge: '#F4F7FC',
}
const v = r => col(r, C[r])

// shapes, each shrunk by e (inset) so edge / bevel / core stack cleanly
const ell = (cx, cy, rx, ry, e = 0) => {
  const a = rx - e, b = ry - e
  return `M${f(cx - a)} ${f(cy)}A${f(a)} ${f(b)} 0 1 1 ${f(cx + a)} ${f(cy)}A${f(a)} ${f(b)} 0 1 1 ${f(cx - a)} ${f(cy)}Z`
}
const rr = (x, y, w, h, r, e = 0) => {
  const X = x + e, Y = y + e, W = w - 2 * e, H = h - 2 * e, R = Math.max(0.2, r - e)
  return `M${f(X + R)} ${f(Y)}H${f(X + W - R)}A${f(R)} ${f(R)} 0 0 1 ${f(X + W)} ${f(Y + R)}V${f(Y + H - R)}` +
    `A${f(R)} ${f(R)} 0 0 1 ${f(X + W - R)} ${f(Y + H)}H${f(X + R)}A${f(R)} ${f(R)} 0 0 1 ${f(X)} ${f(Y + H - R)}` +
    `V${f(Y + R)}A${f(R)} ${f(R)} 0 0 1 ${f(X + R)} ${f(Y)}Z`
}
// a soft triangle (ear): corners pulled toward the centroid by e
const tri = (pts, e = 0) => {
  const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3
  const q = pts.map(p => { const dx = p[0] - cx, dy = p[1] - cy, d = Math.hypot(dx, dy); return [p[0] - dx / d * e * 1.9, p[1] - dy / d * e * 1.9] })
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  let d = ''
  for (let i = 0; i < 3; i++) {
    const p = q[i], a = q[(i + 2) % 3], b = q[(i + 1) % 3]
    const s = lerp(p, a, 0.2), t = lerp(p, b, 0.2)
    d += (i ? `L${f(s[0])} ${f(s[1])}` : `M${f(s[0])} ${f(s[1])}`) + `Q${f(p[0])} ${f(p[1])} ${f(t[0])} ${f(t[1])}`
  }
  void mid
  return d + 'Z'
}

const BODY = e => ell(11.4, 12.6, 7.6, 5.7, e)
const EAR = e => tri([[13.2, 8.6], [15.6, 4.9], [17.7, 9.6]], e)
const SNOUT = e => rr(17.5, 10.7, 4.1, 5, 1.7, e)
const LEG1 = e => rr(6.1, 16.4, 3.6, 4.5, 1.5, e)
const LEG2 = e => rr(13.1, 16.4, 3.6, 4.5, 1.5, e)
const COIN = e => ell(11.4, 3.9, 2.0, 2.0, e)

export default function render(icon) {
  const name = (icon && icon.name) || 'piggy-bank'
  const G = n => `wg-chrome-${name}-${n}`
  const U = n => `url(#${G(n)})`
  const stop = (o, r) => ['stop', { offset: o, 'stop-color': v(r) }]
  const lin = (n, y0, y1, stops) => ['linearGradient', { id: G(n), x1: 0, y1: y0, x2: 0, y2: y1, gradientUnits: 'userSpaceOnUse' }, stops]
  const defs = ['defs', {}, [
    lin(0, 4.5, 21, [stop(0, 'edge'), stop(0.42, 'tint'), stop(0.56, 'c1'), stop(0.78, 'c4'), stop(1, 'edge')]),
    lin(1, 5, 20.5, [stop(0, 'shine'), stop(0.24, 'tint'), stop(0.5, 'c1'), stop(0.57, 'c3'), stop(0.84, 'c4'), stop(1, 'shine')]),
    lin(2, 2.4, 5.4, [stop(0, 'shine'), stop(0.3, 'tint'), stop(0.62, 'c1'), stop(1, 'c4')]),
    lin(4, 16.4, 20.9, [stop(0, 'tint'), stop(0.5, 'c1'), stop(1, 'c3')]),
    lin(3, 8, 17, [stop(0, 'c3'), stop(0.5, 'shadow'), stop(1, 'ink')]),
  ]]
  const piece = (shape, cls = 'wm-k', bev = 0.22, core = 0.6, cg = 1) => [
    ['path', { d: shape(0), fill: v('shadow'), class: cls }],
    ['path', { d: shape(bev), fill: U(0), class: cls }],
    ['path', { d: shape(core), fill: U(cg), class: cls }],
  ]
  const star = (x, y, s) => `M${f(x)} ${f(y - s)}Q${f(x + s * 0.2)} ${f(y - s * 0.2)} ${f(x + s)} ${f(y)}Q${f(x + s * 0.2)} ${f(y + s * 0.2)} ${f(x)} ${f(y + s)}Q${f(x - s * 0.2)} ${f(y + s * 0.2)} ${f(x - s)} ${f(y)}Q${f(x - s * 0.2)} ${f(y - s * 0.2)} ${f(x)} ${f(y - s)}Z`

  const nodes = [defs]
  // cast shadow
  nodes.push(['path', { d: ell(12, 21.4, 8.6, 1.0), fill: v('shadow'), 'fill-opacity': 0.2, class: 'wm-shadow' }])
  // tail: a steel curl behind the body
  const TAIL = 'M4.6 12.2C2.9 12.2 2.3 10.4 3.4 9.7C4.4 9.2 5.1 10.2 4.5 10.9'
  nodes.push(['path', { d: TAIL, stroke: v('shadow'), 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', class: 'wm-k' }])
  nodes.push(['path', { d: TAIL, stroke: U(1), 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', class: 'wm-k' }])
  // legs and ear sit behind the body, snout in front
  nodes.push(...piece(LEG1, 'wm-k', 0.22, 0.6, 4), ...piece(LEG2, 'wm-k', 0.22, 0.6, 4),...piece(EAR, 'wm-k', 0.2, 0.55))
  nodes.push(...piece(BODY))
  nodes.push(...piece(SNOUT, 'wm-k', 0.22, 0.55))
  // dark inlays: coin slot, eye, nostril
  nodes.push(['path', { d: rr(8.9, 8.5, 4.9, 1.3, 0.65), fill: U(3), class: 'wm-k' }])
  nodes.push(['circle', { cx: 15.5, cy: 11, r: 0.75, fill: U(3), class: 'wm-k' }])
  nodes.push(['path', { d: ell(20.1, 13.2, 0.5, 0.8), fill: U(3), class: 'wm-k' }])
  // sheen: a crisp white sickle on the upper left of the body
  nodes.push(['path', { d: 'M5.4 10.9A6.6 4.5 0 0 1 8.6 8.5A7.2 5.6 0 0 0 6 12.6Z', fill: v('shine'), 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the coin: a small warm-metal jewel dropping into the slot
  nodes.push(['path', { d: COIN(0), fill: v('shadow'), class: 'wm-s' }])
  nodes.push(['path', { d: COIN(0.22), fill: U(0), class: 'wm-s' }])
  nodes.push(['path', { d: COIN(0.6), fill: U(2), class: 'wm-s' }])
  nodes.push(['path', { d: ell(11.4, 3.9, 0.5, 0.5), fill: v('accent'), class: 'wm-s' }])
  // glint
  nodes.push(['path', { d: star(6.6, 9.2, 1.4), fill: v('shine'), class: 'wm-shine' }])
  return nodes
}
