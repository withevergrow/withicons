// LIQUID snowman, hand-drawn: a snowman blown from clear liquid glass. Two refractive glass balls with a bright rim,
// a caustic glow at the bottom and a long specular streak; a glass bobble hat and a glass scarf in tinted glass,
// coal eyes and buttons and a carrot nose floating inside, thin glass twig arms, a few glass snowflakes around.
// Roles: glass c1, hat c2, scarf c4, carrot accent, coal ink, shine/shadow light. Motion: body wm-k, hat/scarf/arms
// wm-a, flakes wm-deco, caustic wm-shadow.
const N = 'snowman'
const v = (r, h) => `var(--with-liquid-${r}, ${h})`
const C = {
  c1: v('c1', '#4A9DFF'), c2: v('c2', '#A77BFF'), c4: v('c4', '#FF7EC1'), accent: v('accent', '#FF9A3C'),
  ink: v('ink', '#1C2B4A'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#0C1A3A'),
}
const f = n => +n.toFixed(2)
const circ = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`
const id = n => `wg-liquid-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a = 1) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const lin = (n, x1, y1, x2, y2, s) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, s]
const rad = (n, cx, cy, r, s) => ['radialGradient', { id: id(n), cx, cy, r, gradientUnits: 'userSpaceOnUse' }, s]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const glass = (n, col, y0, y1) => lin(n, 7, y0, 17, y1, [stop(0, col, 0.24), stop(0.6, col, 0.5), stop(1, col, 0.8)])

export function snowman() {
  const defs = ['defs', {}, [
    glass(0, C.c1, 6, 22), glass(1, C.c2, 2.5, 8.5), glass(2, C.c4, 12, 18),
    lin(3, 7, 6, 17, 21, [stop(0, C.shine), stop(1, C.shine, 0.15)]),
    rad(4, 10, 13, 7, [stop(0, C.shine, 0.75), stop(1, C.shine, 0)]),
    lin(5, 7, 18, 14, 23, [stop(0, C.shadow, 0.08), stop(1, C.c4, 0.3)]),
  ]]
  const n = [defs]
  // caustic glow on the ground
  n.push(P(ell(12.6, 21.5, 5.6, 0.95), { fill: url(5) }, 'wm-shadow'))
  // flakes
  n.push(P('M4.2 5.2 V7.2 M3.2 6.2 H5.2 M19.8 4 V5.6 M19 4.8 H20.6 M20.4 17.6 V19 M19.7 18.3 H21.1', { stroke: C.c1, 'stroke-opacity': 0.6, 'stroke-width': 0.45, 'stroke-linecap': 'round', fill: 'none' }, 'wm-deco'))
  // glass twig arms
  const arms = 'M7.4 14.8 L4.2 12.4 M5.6 13.4 L5.4 11.6 M16.6 14.8 L19.8 12.4 M18.4 13.4 L18.6 11.6'
  n.push(P(arms, { stroke: C.c1, 'stroke-opacity': 0.6, 'stroke-width': 1.1, 'stroke-linecap': 'round', fill: 'none' }, 'wm-a'))
  n.push(P(arms, { stroke: C.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.3, 'stroke-linecap': 'round', fill: 'none' }, 'wm-a'))
  // the glass balls: tinted body, inner glow, a dark refracted edge, a bright rim
  const balls = circ(12, 16.3, 5) + circ(12, 10.1, 3.6)
  n.push(P(balls, { fill: url(0) }, 'wm-k'))
  n.push(P(balls, { fill: url(4) }, 'wm-k'))
  n.push(P(balls, { stroke: C.shadow, 'stroke-opacity': 0.4, 'stroke-width': 0.4, fill: 'none' }, 'wm-k'))
  n.push(P(circ(12, 16.3, 4.7) + circ(12, 10.1, 3.3), { stroke: url(3), 'stroke-width': 0.4, fill: 'none' }, 'wm-k'))
  // coal and carrot floating inside the glass
  n.push(P(circ(10.7, 9.7, 0.45) + circ(13.3, 9.7, 0.45) + circ(12, 16.4, 0.55) + circ(12, 18.5, 0.55), { fill: C.ink, 'fill-opacity': 0.85 }, 'wm-k'))
  n.push(P('M11.7 10.6 L14.6 11.25 L11.8 11.55Z', { fill: C.accent }, 'wm-k'))
  n.push(P('M10.9 12 C11.5 12.45 12.5 12.45 13.1 12', { stroke: C.ink, 'stroke-opacity': 0.75, 'stroke-width': 0.3, 'stroke-linecap': 'round', fill: 'none' }, 'wm-k'))
  // glass scarf + end
  const scarf = 'M8.4 12.6 C10.2 13.6 13.8 13.6 15.6 12.6 L15.9 14.1 C13.9 15.2 10.1 15.2 8.1 14.1Z M13.7 14.3 L15.4 13.9 L16.1 17.3 L14.4 17.7Z'
  n.push(P(scarf, { fill: url(2) }, 'wm-a'))
  n.push(P(scarf, { stroke: C.shine, 'stroke-opacity': 0.75, 'stroke-width': 0.3, 'stroke-linejoin': 'round', fill: 'none' }, 'wm-a'))
  // glass bobble hat
  const hat = 'M8.4 7.5 C8.3 4.9 9.9 3.6 12 3.6 C14.1 3.6 15.7 4.9 15.6 7.5 C13.3 7 10.7 7 8.4 7.5Z' + circ(12, 2.9, 1.05)
  n.push(P(hat, { fill: url(1) }, 'wm-a'))
  n.push(P(hat, { stroke: C.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.3, 'stroke-linejoin': 'round', fill: 'none' }, 'wm-a'))
  n.push(P('M8.2 7.3 C10.6 6.7 13.4 6.7 15.8 7.3 L15.8 8.4 C13.4 7.9 10.6 7.9 8.2 8.4Z', { fill: url(1), stroke: C.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.3 }, 'wm-a'))
  // long specular streaks
  n.push(P('M8.3 15.2 C8.5 13.9 9.3 13.1 10.2 12.8 M9.4 9.3 C9.6 8.6 10 8.2 10.5 8', { stroke: C.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.45, 'stroke-linecap': 'round', fill: 'none' }, 'wm-shine'))
  return n
}
