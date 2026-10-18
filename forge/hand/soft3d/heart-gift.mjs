// forge/hand/soft3d/heart-gift.mjs — a plain front-facing gift box: a red body with a pink heart in the middle of
// its front, a wider lid with a gold ribbon band, and a gold two-loop bow on top. The generated drawing was a tilted
// red chest with a padlock-like heart and no clear bow; this one is the line design (box, lid, bow, centred heart)
// in the studio recipe of the soft3d set: contact shadow, shaded wall to the lower right, shared diagonal light, lit
// rims on the upper left.
// Roles: box c1, heart c2, ribbon + bow c3, dark red c4. Motion: box wm-k, bow wm-a, heart wm-s, shadow, speculars.
const N = 'heart-gift'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls = 'wm-k') => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
// circle, clockwise
const circ = (x, y, r) => `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 1 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 1 ${f(x - r)} ${f(y)}Z`
// rounded rect, clockwise
const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}L${f(x + w - r)} ${f(y)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}L${f(x + w)} ${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}L${f(x + r)} ${f(y + h)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}L${f(x)} ${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`
// scale by k then move by dx, dy (absolute M L C Q A Z paths only)
const tf = (d, k, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 < 2 ? x * k : i % 7 === 5 ? x * k + dx : i % 7 === 6 ? x * k + dy : x) : x * k + (i % 2 ? dy : dx)).map(f).join(' '))
const mv = (d, dx, dy) => tf(d, 1, dx, dy)
const about = (d, k, cx, cy) => tf(d, k, cx * (1 - k), cy * (1 - k))
const wall = (d, dx, dy, n = 3) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')
const C = {}
const out = []
// an extruded block: its wall (colour + shade), then the lit face
function blk(d, col, o = {}) {
  const { dx = 0.8, dy = 0.8, n = 3, g = 0, cls = 'wm-k', rule } = o
  const ex = rule ? { 'fill-rule': rule } : {}
  if (dx || dy) { const W = wall(d, dx, dy, n); out.push(P(W, { fill: col, ...ex }, cls), P(W, { fill: C.shadow, 'fill-opacity': o.ws ?? 0.34, ...ex }, cls)) }
  out.push(P(d, { fill: col, ...ex }, cls))
  if (g >= 0) out.push(P(d, { fill: url(g), ...ex }, cls))
}
const light = (d, w = 0.55, op = 0.6, cls = 'wm-shine') => out.push(P(d, { stroke: C.shine, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cls))
const dark = (d, w = 0.55, op = 0.25, cls = 'wm-k') => out.push(P(d, { stroke: C.shadow, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cls))
const soft = (d, op = 0.22, cls = 'wm-k', dx = 0.3, dy = 0.4) => out.push(P(mv(d, dx, dy), { fill: C.shadow, 'fill-opacity': op }, cls))
const GRADS = [
  ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, 'S', 0.34), stop(0.42, 'S', 0), stop(0.62, 'D', 0), stop(1, 'D', 0.22)]],
  ['radialGradient', { id: id(1), cx: 0.35, cy: 0.3, r: 0.75 }, [stop(0, 'S', 0.5), stop(0.45, 'S', 0), stop(1, 'D', 0.3)]],
  ['linearGradient', { id: id(2), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, 'S', 0.3), stop(0.35, 'S', 0), stop(0.6, 'D', 0), stop(1, 'D', 0.32)]],
]
const defs = () => ['defs', {}, GRADS.map(([t, a, ss]) => [t, a, ss.map(s => stop(s[1].offset, s[1]['stop-color'] === 'S' ? C.shine : C.shadow, s[1]['stop-opacity']))])]
const shadowEll = (x, y, rx, ry) => [[1, 1], [0.8, 0.8], [0.58, 0.58]].forEach(([a, b], i) =>
  out.push(P(ell(x, y, rx * a, ry * b), { fill: C.shadow, 'fill-opacity': [0.06, 0.08, 0.11][i] }, 'wm-shadow')))
Object.assign(C, { c1: v('c1', '#D7263D'), c2: v('c2', '#FFC2CC'), c3: v('c3', '#E8B53A'), c4: v('c4', '#8A1028'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') })

const BODY = rr(4.4, 10.8, 15.2, 9.6, 1.7)
const LID = rr(3.2, 7.8, 17.6, 4, 1.5)
const BAND = rr(10.7, 7.8, 2.6, 4, 0.4)
const LOOP_L = 'M12 7.3C9 8 5.2 7 5.2 4.6C5.2 2.6 7.6 2.4 9 3.6C10.4 4.8 11.6 6 12 7.3Z'
const LOOP_R = 'M12 7.3C15 8 18.8 7 18.8 4.6C18.8 2.6 16.4 2.4 15 3.6C13.6 4.8 12.4 6 12 7.3Z'
const HEART = 'M12 19.2C8.5 16.9 8.5 13.4 10.5 12.8C11.4 12.6 11.8 13.2 12 13.7C12.2 13.2 12.6 12.6 13.5 12.8C15.5 13.4 15.5 16.9 12 19.2Z'

export default function render() {
  out.length = 0
  shadowEll(12.3, 21.4, 9.2, 1.2)
  blk(BODY, C.c1, { dx: 0.8, dy: 0.8 })
  // the lid casts a soft shade on the body
  out.push(P('M4.4 12.4L19.6 12.4L19.6 14L4.4 14Z', { fill: C.shadow, 'fill-opacity': 0.14 }, 'wm-k'))
  blk(LID, C.c1, { dx: 0.8, dy: 0.8 })
  out.push(P(rr(3.2, 11, 17.6, 0.8, 0.4), { fill: C.shadow, 'fill-opacity': 0.14 }, 'wm-k'))
  // ribbon band over the lid
  out.push(P(BAND, { fill: C.c3 }, 'wm-k'), P(BAND, { fill: url(2) }, 'wm-k'))
  // bow
  blk(LOOP_L, C.c3, { dx: 0.5, dy: 0.5, g: 1, cls: 'wm-a' })
  blk(LOOP_R, C.c3, { dx: 0.5, dy: 0.5, g: 1, cls: 'wm-a' })
  out.push(P('M10 5.4Q9 4.4 7.7 4.7M14 5.4Q15 4.4 16.3 4.7', { stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 0.6, 'stroke-linecap': 'round' }, 'wm-a'))
  blk(circ(12, 7.2, 1.35), C.c3, { dx: 0.4, dy: 0.4, g: 1, cls: 'wm-a' })
  // heart
  out.push(P(mv(HEART, 0.35, 0.45), { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-s'))
  out.push(P(HEART, { fill: C.c2 }, 'wm-s'), P(HEART, { fill: url(1) }, 'wm-s'))
  // lights
  light('M5.4 10.9L5.4 17.8', 0.55, 0.5)
  light('M4.4 9.2Q4.4 8.6 5.4 8.6L9 8.6', 0.55, 0.65)
  light('M6.2 4Q6.7 3.4 7.8 3.4', 0.45, 0.8, 'wm-a')
  light('M9.8 13.6Q10.2 13.2 10.8 13.3', 0.4, 0.85, 'wm-s')
  dark('M19.4 12.6L19.4 19.2', 0.5, 0.14)
  return [defs(), ...out]
}
