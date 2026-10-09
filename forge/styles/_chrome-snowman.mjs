// CHROME snowman, hand-drawn: a polished liquid-metal snowman. Two mirror-chrome balls reflecting a bright sky above
// a dark horizon band, a tall gloss-black top hat with a candy-metal band, a candy-metal scarf blowing to the side,
// thin steel twig arms, black-pearl eyes and buttons and a warm metal carrot nose.
// Roles: metal shine/tint/shadow/edge (sky, mid, horizon, floor), hat ink, scarf + hat band c2, carrot c4.
// Motion: body wm-k, hat/scarf/arms wm-a, reflections wm-shine, ground wm-shadow.
const N = 'snowman'
const v = (r, h) => `var(--with-chrome-${r}, ${h})`
const C = {
  c2: v('c2', '#D9384A'), c4: v('c4', '#F59A3B'), ink: v('ink', '#1E2230'), shine: v('shine', '#FFFFFF'),
  tint: v('tint', '#DCE5F2'), edge: v('edge', '#F4F7FC'), shadow: v('shadow', '#3E4556'), mid: v('c3', '#8794AA'),
}
const f = n => +n.toFixed(2)
const circ = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`
const id = n => `wg-chrome-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a = 1) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const lin = (n, x1, y1, x2, y2, s) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, s]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
// a mirror ball: bright sky, a dark horizon a little below the middle, a lighter floor
const mirror = (n, y0, y1) => lin(n, 0, y0, 0, y1, [stop(0, C.shine), stop(0.4, C.tint), stop(0.54, C.mid), stop(0.58, C.shadow), stop(0.8, C.mid), stop(1, C.edge)])

export function snowman() {
  const defs = ['defs', {}, [
    mirror(0, 11.3, 21.3), mirror(1, 6.5, 13.7),
    lin(2, 0, 2.8, 0, 8.6, [stop(0, C.mid), stop(0.25, C.ink), stop(0.7, C.ink), stop(0.85, C.shadow), stop(1, C.ink)]),
    lin(3, 0, 12.2, 0, 15.4, [stop(0, C.shine, 0.85), stop(0.35, C.c2), stop(0.75, C.c2), stop(1, C.ink, 0.6)]),
    lin(4, 3, 0, 21, 0, [stop(0, C.shadow), stop(0.5, C.shine), stop(1, C.shadow)]),
  ]]
  const n = [defs]
  n.push(P(ell(12, 21.5, 5.4, 0.7), { fill: C.ink, 'fill-opacity': 0.18 }, 'wm-shadow'))
  // steel twig arms
  const arms = 'M7.3 14.8 L3.9 12.3 M5.5 13.5 L5.2 11.5 M16.7 14.8 L20.1 12.3 M18.5 13.5 L18.8 11.5'
  n.push(P(arms, { stroke: C.shadow, 'stroke-width': 1.05, 'stroke-linecap': 'round', fill: 'none' }, 'wm-a'))
  n.push(P(arms, { stroke: url(4), 'stroke-width': 0.4, 'stroke-linecap': 'round', fill: 'none' }, 'wm-a'))
  // mirror balls with a dark metal edge
  for (const [i, [x, y, r]] of [[0, [12, 16.3, 5]], [1, [12, 10.1, 3.6]]]) {
    n.push(P(circ(x, y, r), { fill: url(i), stroke: C.shadow, 'stroke-width': 0.4 }, 'wm-k'))
  }
  // sky reflections
  n.push(P('M8.3 14.4 C8.9 12.9 10.2 12.1 11.4 11.9 C10.4 12.6 9.6 13.4 9.1 14.6Z M9.4 8.9 C9.8 7.9 10.6 7.3 11.4 7.2 C10.8 7.7 10.4 8.3 10.1 9Z', { fill: C.shine, 'fill-opacity': 0.9 }, 'wm-shine'))
  // black pearls
  for (const [x, y, r] of [[10.7, 9.6, 0.5], [13.3, 9.6, 0.5], [12, 17.4, 0.6], [12, 19.4, 0.55]]) {
    n.push(P(circ(x, y, r), { fill: C.ink }, 'wm-k'))
    n.push(P(circ(x - r * 0.35, y - r * 0.35, r * 0.32), { fill: C.shine, 'fill-opacity': 0.85 }, 'wm-shine'))
  }
  // warm metal carrot
  n.push(P('M11.7 10.4 L14.8 11.1 L11.8 11.5Z', { fill: C.c4, stroke: C.ink, 'stroke-opacity': 0.4, 'stroke-width': 0.15, 'stroke-linejoin': 'round' }, 'wm-k'))
  n.push(P('M11.9 10.65 L13.8 11.05', { stroke: C.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.18, 'stroke-linecap': 'round', fill: 'none' }, 'wm-shine'))
  // candy-metal scarf blowing to the right
  const scarf = 'M8.4 12.5 C10.2 13.5 13.8 13.5 15.6 12.5 L15.9 14 C13.9 15.1 10.1 15.1 8.1 14Z M14.3 13.6 C15.8 13.4 17 14 18 15.2 L16.7 16.3 C16 15.4 15.3 14.9 14.5 14.8Z'
  n.push(P(scarf, { fill: url(3), stroke: C.ink, 'stroke-opacity': 0.35, 'stroke-width': 0.2, 'stroke-linejoin': 'round' }, 'wm-a'))
  // gloss-black top hat with a candy band
  n.push(P('M7.9 7.4 C10.3 6.7 13.7 6.7 16.1 7.4 L16.1 8.2 C13.7 7.6 10.3 7.6 7.9 8.2Z', { fill: url(2), stroke: C.shadow, 'stroke-width': 0.2 }, 'wm-a'))
  n.push(P('M9.7 7.2 L9.9 3.2 C9.9 2.9 10.1 2.8 10.4 2.8 L13.6 2.8 C13.9 2.8 14.1 2.9 14.1 3.2 L14.3 7.2 C12.8 7 11.2 7 9.7 7.2Z', { fill: url(2), stroke: C.shadow, 'stroke-width': 0.2 }, 'wm-a'))
  n.push(P('M9.8 5.8 C11.2 5.65 12.8 5.65 14.2 5.8 L14.25 6.6 C12.8 6.45 11.2 6.45 9.75 6.6Z', { fill: url(3) }, 'wm-a'))
  n.push(P('M10.6 3.3 L10.5 5.4', { stroke: C.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.3, 'stroke-linecap': 'round', fill: 'none' }, 'wm-shine'))
  return n
}
