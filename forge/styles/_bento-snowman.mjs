// BENTO snowman, hand-drawn: a calm tinted tile and on it a neat, friendly snowman glyph with fluffy earmuffs on a
// headband, a scarf with a hanging end, stick arms with little mittens, coal eyes, a carrot nose and two buttons,
// outlined in the tile's deep shade. Roles: tile tint, snow c1, earmuffs + mittens c2, scarf c3, carrot c4,
// outline/coal shadow. Motion: tile wm-deco, body wm-k, earmuffs/scarf/arms wm-a.
const N = 'snowman'
const v = (r, h) => `var(--with-bento-${r}, ${h})`
const C = {
  c1: v('c1', '#FFFFFF'), c2: v('c2', '#F25F7A'), c3: v('c3', '#6366F1'), c4: v('c4', '#FF9F43'),
  tint: v('tint', '#EEF0FF'), shadow: v('shadow', '#312E81'), shine: v('shine', '#FFFFFF'),
}
const f = n => +n.toFixed(2)
const circ = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
const id = n => `wg-bento-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a = 1) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const lin = (n, x1, y1, x2, y2, s) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, s]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const TILE = 'M9.4 2H14.6C20.08 2 22 3.92 22 9.4V14.6C22 20.08 20.08 22 14.6 22H9.4C3.92 22 2 20.08 2 14.6V9.4C2 3.92 3.92 2 9.4 2Z'

export function snowman() {
  const defs = ['defs', {}, [
    lin(0, 0, 2, 0, 22, [stop(0, C.c3, 0), stop(1, C.c3, 0.17)]),
    lin(1, 2, 0, 22, 0, [stop(0, C.shine, 0), stop(0.3, C.shine, 0.95), stop(0.7, C.shine, 0.95), stop(1, C.shine, 0)]),
    lin(2, 0, 8, 0, 20, [stop(0, C.c1), stop(1, C.tint)]),
  ]]
  const line = { stroke: C.shadow, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const n = [defs]
  n.push(P(TILE, { fill: C.tint }, 'wm-deco'))
  n.push(P(TILE, { fill: url(0), stroke: C.c3, 'stroke-opacity': 0.14, 'stroke-width': 0.35 }, 'wm-deco'))
  n.push(P('M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62', { stroke: url(1), 'stroke-width': 0.5 }, 'wm-deco'))
  // little ground line
  n.push(P('M7 19.4 H17', { ...line, 'stroke-opacity': 0.25 }, 'wm-deco'))
  // stick arms with mittens
  n.push(P('M8.4 14.2 L6.2 12.6 M15.6 14.2 L17.8 12.6', { ...line, fill: 'none' }, 'wm-a'))
  n.push(P('M5 12.3 C4.7 11.5 5.3 10.9 6 11.1 C6.6 11.3 6.8 12 6.4 12.5 C6 13 5.3 12.9 5 12.3Z M19 12.3 C19.3 11.5 18.7 10.9 18 11.1 C17.4 11.3 17.2 12 17.6 12.5 C18 13 18.7 12.9 19 12.3Z', { fill: C.c2, ...line, 'stroke-width': 0.55 }, 'wm-a'))
  // the two balls, one outline
  const balls = circ(12, 15.6, 3.75) + circ(12, 10.3, 2.75)
  n.push(P(balls, { fill: C.c1, ...line, 'stroke-width': 1.0 }, 'wm-k'))
  n.push(P(balls, { fill: url(2) }, 'wm-k'))
  n.push(P(circ(12, 15.6, 0.42) + circ(12, 17.3, 0.42), { fill: C.shadow }, 'wm-k'))
  // face
  n.push(P(circ(11.05, 10.15, 0.38) + circ(12.95, 10.15, 0.38), { fill: C.shadow }, 'wm-k'))
  n.push(P('M11.8 10.85 L13.8 11.3 L11.85 11.55Z', { fill: C.c4 }, 'wm-k'))
  // scarf with a hanging end
  n.push(P('M13.2 13.3 L14.6 13.1 L15 15.6 L13.6 15.8Z', { fill: C.c3, ...line, 'stroke-width': 0.5 }, 'wm-a'))
  n.push(P('M9.3 12.2 C10.9 13 13.1 13 14.7 12.2 L14.9 13.45 C13.2 14.2 10.8 14.2 9.1 13.45Z', { fill: C.c3, ...line, 'stroke-width': 0.5 }, 'wm-a'))
  // earmuffs on a headband
  n.push(P('M9.5 9.4 C9.3 6.9 10.5 6.3 12 6.3 C13.5 6.3 14.7 6.9 14.5 9.4', { ...line, stroke: C.c2, 'stroke-width': 0.75, fill: 'none' }, 'wm-a'))
  n.push(P(circ(9.4, 9.9, 0.95) + circ(14.6, 9.9, 0.95), { fill: C.c2, ...line, 'stroke-width': 0.55 }, 'wm-a'))
  return n
}
