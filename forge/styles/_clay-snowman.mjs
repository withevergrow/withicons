// CLAY snowman, hand-drawn: a plump matte-clay snowman on a little snow mound. A chunky knit beanie (ribbed, with a
// fat cuff and a pompom), a soft teal scarf with a hanging end, round clay twig arms, rosy cheeks, a carrot nose,
// three candy buttons. Matte light from the upper left (broad soft highlight, side wall, ground shadow).
// Roles: snow c1, beanie c2, scarf c3, carrot + buttons c4, cuff accent, coal ink, light shine/shadow/tint.
// Motion: body wm-k, beanie/scarf/arms wm-a, mound + shadow wm-shadow.
const N = 'snowman'
const v = (r, h) => `var(--with-clay-${r}, ${h})`
const C = {
  c1: v('c1', '#F7F8FC'), c2: v('c2', '#FF5C7A'), c3: v('c3', '#2EC4B6'), c4: v('c4', '#FF9A3C'), accent: v('accent', '#FFD84A'),
  ink: v('ink', '#2A1D5C'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#24166B'), tint: v('tint', '#DCE3FF'), twig: v('ink', '#7A4E2D'),
}
const f = n => +n.toFixed(2)
const circ = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`
const id = n => `wg-clay-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a = 1) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const rad = (n, cx, cy, r, s) => ['radialGradient', { id: id(n), cx, cy, r, gradientUnits: 'userSpaceOnUse' }, s]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
// matte clay light: soft broad highlight upper left, a gentle roll into shade lower right
const matte = (n, x, y, r) => rad(n, x - r * 0.45, y - r * 0.55, r * 1.9, [
  stop(0, C.shine, 0.55), stop(0.35, C.shine, 0.08), stop(0.7, C.shadow, 0.06), stop(1, C.shadow, 0.34)])

const BODY = [12, 16.4, 5.0], HEAD = [12, 10.3, 3.55]
export function snowman() {
  const defs = ['defs', {}, [
    matte(0, ...BODY), matte(1, ...HEAD), matte(2, 12, 6.2, 4.2), matte(3, 12, 13.6, 4.4), matte(4, 12, 2.9, 1.25),
    rad(5, 12, 21.2, 7.5, [stop(0, C.shadow, 0.28), stop(0.7, C.shadow, 0.08), stop(1, C.shadow, 0)]),
  ]]
  const n = [defs]
  // snow mound + soft ground shadow
  n.push(P(ell(12, 21.3, 7.6, 1.35), { fill: url(5) }, 'wm-shadow'))
  n.push(P('M5.2 21.4 C5.6 19.9 8 19.3 12 19.3 C16 19.3 18.4 19.9 18.8 21.4 C16.8 22 7.2 22 5.2 21.4Z', { fill: C.tint }, 'wm-shadow'))
  // round clay twig arms (a dark tube + a lit core)
  const arms = 'M7.4 15 L3.9 12.4 M5.5 13.6 L5.2 11.6 M16.6 15 L20.1 12.4 M18.5 13.6 L18.8 11.6'
  n.push(P(arms, { stroke: C.twig, 'stroke-width': 1.2, 'stroke-linecap': 'round', fill: 'none' }, 'wm-a'))
  n.push(P(arms, { stroke: C.shine, 'stroke-opacity': 0.22, 'stroke-width': 0.4, 'stroke-linecap': 'round', fill: 'none' }, 'wm-a'))
  // the body: side wall (darker clay just under the face), then the lit face
  for (const [i, [x, y, r]] of [[0, BODY], [1, HEAD]]) {
    n.push(P(circ(x + 0.25, y + 0.35, r), { fill: C.tint }, 'wm-k'))
    n.push(P(circ(x + 0.25, y + 0.35, r), { fill: C.shadow, 'fill-opacity': 0.22 }, 'wm-k'))
    n.push(P(circ(x, y, r), { fill: C.c1 }, 'wm-k'))
    n.push(P(circ(x, y, r), { fill: url(i) }, 'wm-k'))
  }
  // three candy buttons
  for (const y of [15.9, 17.6, 19.3]) {
    n.push(P(circ(12, y, 0.62), { fill: C.c4 }, 'wm-k'))
    n.push(P(circ(11.8, y - 0.2, 0.2), { fill: C.shine, 'fill-opacity': 0.75 }, 'wm-shine'))
  }
  // scarf: a soft roll around the neck + a hanging end with a fringe
  const tail = 'M15.4 13.6 C15.8 15 16 16.3 15.7 17.6 L13.8 17.4 C14 16.2 13.8 15 13.4 14Z'
  n.push(P(tail, { fill: C.c3 }, 'wm-a'))
  n.push(P(tail, { fill: url(3) }, 'wm-a'))
  n.push(P('M15.45 17.6 L15.5 18.4 M14.75 17.55 L14.75 18.35 M14.05 17.45 L14 18.25', { stroke: C.c3, 'stroke-width': 0.42, 'stroke-linecap': 'round', fill: 'none' }, 'wm-a'))
  const roll = 'M8.2 12.6 C10 13.8 14 13.8 15.8 12.6 C16.4 13.1 16.4 14.2 15.7 14.6 C13.7 15.6 10.3 15.6 8.3 14.6 C7.6 14.2 7.6 13.1 8.2 12.6Z'
  n.push(P(roll, { fill: C.c3 }, 'wm-a'))
  n.push(P(roll, { fill: url(3) }, 'wm-a'))
  // face
  n.push(P(circ(10.65, 10.15, 0.5) + circ(13.35, 10.15, 0.5), { fill: C.ink }, 'wm-k'))
  n.push(P(circ(10.5, 9.98, 0.16) + circ(13.2, 9.98, 0.16), { fill: C.shine }, 'wm-shine'))
  n.push(P(ell(9.6, 11.45, 0.62, 0.38) + ell(14.4, 11.45, 0.62, 0.38), { fill: C.c2, 'fill-opacity': 0.35 }, 'wm-k'))
  n.push(P('M11.6 10.95 C11.9 10.6 12.5 10.6 12.6 11 L14.6 11.6 C14.75 11.7 14.7 11.8 14.55 11.8 L12.3 11.75 C11.85 11.7 11.45 11.4 11.6 10.95Z', { fill: C.c4 }, 'wm-k'))
  n.push(P('M11.2 12.25 C11.6 12.6 12.4 12.6 12.8 12.25', { stroke: C.ink, 'stroke-width': 0.34, 'stroke-linecap': 'round', fill: 'none' }, 'wm-k'))
  // knit beanie: ribbed dome, fat cuff, pompom
  const dome = 'M8.4 8 C8.2 5.1 9.9 3.6 12 3.6 C14.1 3.6 15.8 5.1 15.6 8Z'
  n.push(P(dome, { fill: C.c2 }, 'wm-a'))
  n.push(P(dome, { fill: url(2) }, 'wm-a'))
  n.push(P('M10.3 4.5 C10 5.6 10 6.7 10.2 7.7 M12 3.9 V7.7 M13.7 4.5 C14 5.6 14 6.7 13.8 7.7', { stroke: C.shadow, 'stroke-opacity': 0.18, 'stroke-width': 0.35, 'stroke-linecap': 'round', fill: 'none' }, 'wm-a'))
  const cuff = 'M8.1 6.9 C10.5 6.4 13.5 6.4 15.9 6.9 C16.6 7 16.7 8.6 15.9 8.8 C13.5 9.3 10.5 9.3 8.1 8.8 C7.3 8.6 7.4 7 8.1 6.9Z'
  n.push(P(cuff, { fill: C.accent }, 'wm-a'))
  n.push(P(cuff, { fill: url(2) }, 'wm-a'))
  n.push(P(circ(12, 2.9, 1.25), { fill: C.accent }, 'wm-a'))
  n.push(P(circ(12, 2.9, 1.25), { fill: url(4) }, 'wm-a'))
  // broad soft highlights
  n.push(P(ell(9.0, 16.0, 0.85, 0.55), { fill: C.shine, 'fill-opacity': 0.55 }, 'wm-shine'))
  n.push(P(ell(10, 4.9, 0.75, 0.4), { fill: C.shine, 'fill-opacity': 0.4 }, 'wm-shine'))
  return n
}
