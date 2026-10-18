// forge/hand/soft3d/cookie.mjs — a thick golden-baked cookie standing face-on with a big clean bite out of the upper
// right and four fat dark chocolate chips. The generated cookie was a flat disc with pale specks and a nibble that
// read like the donut; this one has a deep baked wall, a crisp scalloped bite and dark raised chips so it reads as a
// cookie at 16px. Same studio recipe as the generated soft3d food: contact shadow, shaded wall to the lower right,
// face with the shared diagonal light, lit rim on the upper left.
// Roles: dough c1, chips c2, shine/shadow. Motion: body wm-k, chips wm-a, shadow wm-shadow, speculars wm-shine.
const N = 'cookie'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#E3A65E'), c2: v('c2', '#5A3622'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
// move an absolute path (M L C Q A Z only) by dx, dy
const mv = (d, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x) : x + (i % 2 ? dy : dx)).map(f).join(' '))
// the extruded wall: copies of the face stepping back to (dx, dy)
const wall = (d, dx, dy, n = 4) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')

// circle-circle intersections
function cc([x1, y1], r1, [x2, y2], r2) {
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy), a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - a * a))
  const mx = x1 + a * dx / d, my = y1 + a * dy / d
  return [[mx + h * dy / d, my - h * dx / d], [mx - h * dy / d, my + h * dx / d]]
}
const O = [11.4, 12], R = 8.6
const at = (deg, dist) => [O[0] + dist * Math.cos(deg * Math.PI / 180), O[1] + dist * Math.sin(deg * Math.PI / 180)]
const BA = at(-62, R + 0.7), BB = at(-28, R + 0.7), RB = 2.7 // two bite scallops on the upper right rim
const [a1, a2] = cc(O, R, BA, RB), [b1, b2] = cc(O, R, BB, RB), [q1, q2] = cc(BA, RB, BB, RB)
const near = (ps, p) => ps.slice().sort((u, w) => Math.hypot(u[0] - p[0], u[1] - p[1]) - Math.hypot(w[0] - p[0], w[1] - p[1]))[0]
const pA = near([a1, a2], at(-90, R)), pB = near([b1, b2], at(0, R)), pQ = near([q1, q2], O)
const pt = p => `${f(p[0])} ${f(p[1])}`
const BODY = `M${pt(pB)}A${R} ${R} 0 1 1 ${pt(pA)}A${RB} ${RB} 0 0 0 ${pt(pQ)}A${RB} ${RB} 0 0 0 ${pt(pB)}Z`
const CHIPS = [
  'M6.6 9.4C7 8.2 8.7 8 9.5 8.9C10.2 9.8 9.6 11.2 8.4 11.3C7.2 11.4 6.3 10.5 6.6 9.4Z',
  'M12.6 11.6C13.2 10.6 14.8 10.8 15.2 11.9C15.6 13 14.6 14 13.5 13.8C12.6 13.6 12.1 12.5 12.6 11.6Z',
  'M7.4 15.4C8 14.4 9.6 14.5 10 15.6C10.4 16.7 9.3 17.7 8.2 17.4C7.3 17.1 6.9 16.2 7.4 15.4Z',
  'M14 16.9C14.5 16.1 15.8 16.2 16.1 17.1C16.4 18 15.6 18.8 14.7 18.6C13.9 18.4 13.6 17.6 14 16.9Z',
  'M10.4 5.6C10.8 5 11.8 5.1 12 5.8C12.2 6.5 11.5 7.1 10.8 6.9C10.2 6.7 10.1 6.1 10.4 5.6Z',
]

export default function render() {
  const n = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.22)]],
    ['radialGradient', { id: id(1), cx: 0.35, cy: 0.3, r: 0.75 }, [stop(0, C.shine, 0.5), stop(0.45, C.shine, 0), stop(1, C.shadow, 0.3)]],
  ]]]
  // contact shadow
  n.push(P(ell(12.6, 21.1, 9.4, 1.5), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(12.6, 21.1, 7.5, 1.2), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(12.6, 21.1, 5.4, 0.86), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'))
  // baked wall
  const W = wall(BODY, 1.05, 1.0, 9)
  n.push(P(W, { fill: C.c1 }, 'wm-k'), P(W, { fill: C.shadow, 'fill-opacity': 0.34 }, 'wm-k'))
  // face
  n.push(P(BODY, { fill: C.c1 }, 'wm-k'), P(BODY, { fill: url(0) }, 'wm-k'))
  // rim light (upper left) and soft dark rim (lower right)
  const ri = R - 0.45
  const rp = deg => pt(at(deg, ri))
  n.push(P(`M${rp(160)}A${ri} ${ri} 0 0 1 ${rp(255)}`, { stroke: C.shine, 'stroke-width': 0.62, 'stroke-opacity': 0.6, 'stroke-linecap': 'round' }, 'wm-shine'))
  n.push(P(`M${rp(15)}A${ri} ${ri} 0 0 1 ${rp(110)}`, { stroke: C.shadow, 'stroke-width': 0.62, 'stroke-opacity': 0.22, 'stroke-linecap': 'round' }, 'wm-k'))
  // bite edge: a darker crumb line along the scallops
  n.push(P(`M${pt(pA)}A${RB} ${RB} 0 0 0 ${pt(pQ)}A${RB} ${RB} 0 0 0 ${pt(pB)}`, { stroke: C.shadow, 'stroke-width': 0.55, 'stroke-opacity': 0.28, 'stroke-linecap': 'round' }, 'wm-k'))
  // chips: a soft contact shade, the chip, its rounded light
  const chips = CHIPS.join('')
  n.push(P(mv(chips, 0.3, 0.4), { fill: C.shadow, 'fill-opacity': 0.24 }, 'wm-k'))
  n.push(P(chips, { fill: C.c2 }, 'wm-a'), P(chips, { fill: url(1) }, 'wm-a'))
  n.push(P('M7.4 9.3L7.9 8.9M13.2 11.6L13.6 11.3M8.1 15.3L8.6 14.9M14.5 16.9L14.9 16.7', { stroke: C.shine, 'stroke-width': 0.5, 'stroke-opacity': 0.7, 'stroke-linecap': 'round' }, 'wm-shine'))
  return n
}
