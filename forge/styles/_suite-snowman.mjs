// SUITE snowman, hand-drawn: a polished product-suite colour icon. A classic snowman in crisp layered gradients:
// a ribbed beanie with a pompom, coal-dot eyes, a carrot nose and a dotted coal smile, a scarf with a hanging end,
// Y-shaped twig arms and two coal buttons; a diagonal light/shade split on every surface like the suite set.
// Roles: snow c1 (shaded to tint), beanie c2, scarf accent, carrot c4, coal ink, light shine/shadow.
// Motion: body wm-k, beanie/scarf/arms wm-a, ground wm-shadow.
const N = 'snowman'
const v = (r, h) => `var(--with-suite-${r}, ${h})`
const C = {
  c1: v('c1', '#FFFFFF'), c2: v('c2', '#7B61F0'), c4: v('c4', '#FF8A1F'), accent: v('accent', '#FF5D5D'),
  ink: v('ink', '#1E2A4A'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#0B1E5B'), tint: v('tint', '#CFDDF6'), twig: v('ink', '#6B4A33'),
}
const f = n => +n.toFixed(2)
const circ = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`
const id = n => `wg-suite-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a = 1) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const lin = (n, x1, y1, x2, y2, s) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, s]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const split = (n, x1, y1, x2, y2) => lin(n, x1, y1, x2, y2, [stop(0, C.shine, 0.3), stop(0.5, C.shine, 0), stop(0.5, C.shadow, 0), stop(1, C.shadow, 0.24)])

export function snowman() {
  const defs = ['defs', {}, [
    lin(0, 8, 6, 16, 22, [stop(0, C.c1), stop(1, C.tint)]),
    split(1, 7, 11, 17, 22), split(2, 8.5, 2.5, 15.5, 8.5), split(3, 8, 12, 16, 15),
  ]]
  const n = [defs]
  n.push(P(ell(12, 21.4, 5.6, 0.7), { fill: C.shadow, 'fill-opacity': 0.14 }, 'wm-shadow'))
  // Y-shaped twig arms
  n.push(P('M7.4 14.6 L4 12 L3.2 10.4 M4 12 L2.6 12.3 M16.6 14.6 L20 12 L20.8 10.4 M20 12 L21.4 12.3', { stroke: C.twig, 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }, 'wm-a'))
  // snow: body + head with a hairline edge so it reads on white
  const balls = circ(12, 16.4, 5) + circ(12, 10.1, 3.6)
  n.push(P(balls, { fill: C.shadow, 'fill-opacity': 0.16, stroke: C.shadow, 'stroke-opacity': 0.16, 'stroke-width': 0.6 }, 'wm-k'))
  n.push(P(balls, { fill: url(0) }, 'wm-k'))
  n.push(P(balls, { fill: url(1) }, 'wm-k'))
  n.push(P(circ(12, 16.3, 0.62) + circ(12, 18.6, 0.62), { fill: C.ink }, 'wm-k'))
  // face: coal eyes, carrot, a dotted coal smile
  n.push(P(circ(10.7, 9.6, 0.5) + circ(13.3, 9.6, 0.5), { fill: C.ink }, 'wm-k'))
  n.push(P('M11.75 10.4 C12 10.15 12.4 10.2 12.5 10.45 L14.7 11.1 L12.3 11.2 C11.9 11.15 11.6 10.75 11.75 10.4Z', { fill: C.c4 }, 'wm-k'))
  n.push(P([[10.5, 11.6], [11.2, 12.1], [12, 12.3], [12.8, 12.1], [13.5, 11.6]].map(([x, y]) => circ(x, y, 0.24)).join(''), { fill: C.ink }, 'wm-k'))
  // scarf + hanging end
  const tail = 'M13.6 13.8 L15.4 13.4 L16.2 17.2 L14.4 17.6Z'
  const band = 'M8.4 12.5 C10.2 13.6 13.8 13.6 15.6 12.5 L15.9 14 C13.9 15.2 10.1 15.2 8.1 14Z'
  for (const d of [tail, band]) { n.push(P(d, { fill: C.accent }, 'wm-a')); n.push(P(d, { fill: url(3) }, 'wm-a')) }
  n.push(P('M14.15 16.4 L15.95 16', { stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.35, fill: 'none' }, 'wm-a'))
  // beanie with ribs and a pompom
  const dome = 'M8.5 7.6 C8.4 4.9 10 3.5 12 3.5 C14 3.5 15.6 4.9 15.5 7.6Z'
  const cuff = 'M8.2 6.9 L15.8 6.9 Q16.4 6.9 16.4 7.5 L16.4 7.9 Q16.4 8.5 15.8 8.5 L8.2 8.5 Q7.6 8.5 7.6 7.9 L7.6 7.5 Q7.6 6.9 8.2 6.9Z'
  for (const d of [dome, cuff]) { n.push(P(d, { fill: C.c2 }, 'wm-a')); n.push(P(d, { fill: url(2) }, 'wm-a')) }
  n.push(P('M9 7.7 H15', { stroke: C.shadow, 'stroke-opacity': 0.2, 'stroke-width': 0.3, 'stroke-dasharray': '0.01 0.7', 'stroke-linecap': 'round', fill: 'none' }, 'wm-a'))
  n.push(P(circ(12, 3.1, 1.05), { fill: C.c1 }, 'wm-a'))
  n.push(P(circ(12, 3.1, 1.05), { fill: url(2) }, 'wm-a'))
  return n
}
