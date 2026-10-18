// forge/hand/soft3d/donut.mjs — a ring donut lying on the desk in a gentle top-down 3/4 view: a fat golden torus with
// a see-through hole (its far inner wall in shade), a pink glaze with soft drips on the near side and a ring of
// sprinkles. The generated donut stood face-on as a flat disc (a puck that copied the cookie); this one shows the hole
// and the glaze from above so it can only be a donut. Same studio recipe as the generated food: contact shadow, wall
// in shade, shared face light, lit rim on the upper left.
// Roles (as the donut palettes): glaze c1, sprinkles c2 c3 and shine, dough c4. Motion: dough + glaze wm-k,
// sprinkles wm-a (they twinkle), shadow wm-shadow, speculars wm-shine.
const N = 'donut'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = {
  c1: v('c1', '#F27BA5'), c2: v('c2', '#F7C531'), c3: v('c3', '#57D9C9'), c4: v('c4', '#E3A65E'),
  shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130'),
}
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
// a smooth closed curve through points (Catmull-Rom as cubics)
function smooth(ps) {
  const n = ps.length, q = i => ps[(i + n) % n]
  let d = `M${f(ps[0][0])} ${f(ps[0][1])}`
  for (let i = 0; i < n; i++) {
    const p0 = q(i - 1), p1 = q(i), p2 = q(i + 1), p3 = q(i + 2)
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d + 'Z'
}

const CX = 12, CY = 11
// the torus: upper half of a flatter ellipse, lower half deeper (its round near side)
const BODY = `M2.6 ${CY}A9.4 6.8 0 0 1 21.4 ${CY}A9.4 8.2 0 0 1 2.6 ${CY}Z`
const HOLE = ell(CX, CY - 0.1, 2.9, 2)
// glaze: an ellipse with soft drips on the near (lower) side
const GLAZE = smooth(Array.from({ length: 36 }, (_, i) => {
  const t = i / 36 * Math.PI * 2, s = Math.sin(t)
  const k = 1 + Math.max(0, s) * (0.05 + 0.075 * Math.cos(5 * t + 0.6))
  return [CX + 8.15 * Math.cos(t) * (1 + Math.max(0, s) * 0.02), CY - 0.75 + 5.75 * s * k]
}))
const GLAZE_HOLE = ell(CX, CY - 0.25, 3.75, 2.65)
// sprinkles in a ring around the glaze: [angle, tilt, role]
const SPR = [[200, 40, 'c2'], [235, -30, 'shine'], [270, 10, 'c3'], [305, 50, 'c2'], [340, -20, 'shine'], [20, 35, 'c3'],
  [60, -45, 'c2'], [95, 15, 'shine'], [125, -35, 'c3'], [160, 30, 'c2']]
function sprinkles(role, dx = 0, dy = 0) {
  return SPR.filter(s => s[2] === role).map(([a, tl]) => {
    const t = a * Math.PI / 180, x = CX + 6 * Math.cos(t) + dx, y = CY - 0.6 + 4.2 * Math.sin(t) + dy
    const u = tl * Math.PI / 180, hx = 0.62 * Math.cos(u), hy = 0.62 * Math.sin(u) * 0.8
    return `M${f(x - hx)} ${f(y - hy)}L${f(x + hx)} ${f(y + hy)}`
  }).join('')
}

export default function render() {
  const n = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 0.35, y2: 1 }, [stop(0, C.shine, 0.3), stop(0.4, C.shine, 0), stop(0.6, C.shadow, 0), stop(1, C.shadow, 0.3)]],
    ['radialGradient', { id: id(1), cx: 0.33, cy: 0.25, r: 0.85 }, [stop(0, C.shine, 0.55), stop(0.4, C.shine, 0.06), stop(0.75, C.shadow, 0), stop(1, C.shadow, 0.24)]],
  ]]]
  // contact shadow
  n.push(P(ell(12.5, 19.8, 10, 2), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(12.5, 19.8, 8, 1.6), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(12.5, 19.8, 5.8, 1.15), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'))
  // dough torus with the hole knocked through
  const dough = BODY + HOLE
  n.push(P(dough, { fill: C.c4, 'fill-rule': 'evenodd' }, 'wm-k'), P(dough, { fill: url(0), 'fill-rule': 'evenodd' }, 'wm-k'))
  // the near side turns away from the light: a darker band low on the torus
  n.push(P(`M2.75 ${CY + 1}A9.3 7.2 0 0 0 21.25 ${CY + 1}A9.4 8.2 0 0 1 2.75 ${CY + 1}Z`, { fill: C.shadow, 'fill-opacity': 0.14 }, 'wm-k'))
  // the far inner wall seen through the hole
  n.push(P(`M${CX - 2.9} ${CY - 0.1}A2.9 2 0 0 1 ${CX + 2.9} ${CY - 0.1}A2.9 0.9 0 0 0 ${CX - 2.9} ${CY - 0.1}Z`, { fill: C.c4 }, 'wm-k'))
  n.push(P(`M${CX - 2.9} ${CY - 0.1}A2.9 2 0 0 1 ${CX + 2.9} ${CY - 0.1}A2.9 0.9 0 0 0 ${CX - 2.9} ${CY - 0.1}Z`, { fill: C.shadow, 'fill-opacity': 0.42 }, 'wm-k'))
  // glaze: its thickness, then the glossy top
  const glaze = GLAZE + GLAZE_HOLE
  const gw = GLAZE.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => `${x} ${f(+y + 0.55)}`) + GLAZE_HOLE
  n.push(P(gw, { fill: C.c1, 'fill-rule': 'evenodd' }, 'wm-k'), P(gw, { fill: C.shadow, 'fill-opacity': 0.3, 'fill-rule': 'evenodd' }, 'wm-k'))
  n.push(P(glaze, { fill: C.c1, 'fill-rule': 'evenodd' }, 'wm-k'), P(glaze, { fill: url(1), 'fill-rule': 'evenodd' }, 'wm-k'))
  // the glaze's lit rim (upper left) and the rim of its hole on the far side
  n.push(P(`M4.5 9C5.3 6.9 8 5.1 11.2 4.85`, { stroke: C.shine, 'stroke-width': 0.6, 'stroke-opacity': 0.75, 'stroke-linecap': 'round' }, 'wm-shine'))
  n.push(P(`M${CX - 3.3} ${CY + 0.5}C${CX - 2.2} ${CY + 1.7} ${CX + 2.2} ${CY + 1.7} ${CX + 3.3} ${CY + 0.5}`, { stroke: C.shine, 'stroke-width': 0.5, 'stroke-opacity': 0.55, 'stroke-linecap': 'round' }, 'wm-shine'))
  // sprinkles: a soft shade, then the sprinkle
  const st = w => ({ 'stroke-width': w, 'stroke-linecap': 'round' })
  n.push(P(['c2', 'c3', 'shine'].map(r => sprinkles(r, 0.15, 0.3)).join(''), { stroke: C.shadow, 'stroke-opacity': 0.22, ...st(0.8) }, 'wm-k'))
  for (const r of ['c2', 'c3', 'shine']) n.push(P(sprinkles(r), { stroke: C[r], ...st(0.8) }, 'wm-a'))
  return n
}
