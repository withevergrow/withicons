// DOCK snowman, hand-drawn: a glossy app tile of a winter sky with falling snow, and on it a bright snowman glyph with
// a dapper top hat, an orange scarf blowing to the side, stick arms and a carrot nose, standing on a snow drift.
// The tile takes c2 (so the snow body can stay c1 under every palette); top hat ink, scarf accent, carrot c4.
// Motion: tile wm-deco, snowflakes wm-deco, body wm-k, hat/scarf/arms wm-a, tile shadow wm-shadow.
const N = 'snowman'
const v = (r, h) => `var(--with-dock-${r}, ${h})`
const C = {
  c1: v('c1', '#FFFFFF'), c2: v('c2', '#3D8BFF'), c4: v('c4', '#FF8A1F'), accent: v('accent', '#FF5A4E'),
  ink: v('ink', '#1B2A4A'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1747A6'), tint: v('tint', '#D6E6FF'),
}
const f = n => +n.toFixed(2)
const circ = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
const id = n => `wg-dock-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a = 1) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const lin = (n, x1, y1, x2, y2, s) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, s]
const rad = (n, cx, cy, r, s) => ['radialGradient', { id: id(n), cx, cy, r, gradientUnits: 'userSpaceOnUse' }, s]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
// the dock squircle (same proportions as the generic tiles)
const tile = (dy = 0) => `M14.64 ${f(2 + dy)}c2.58 0 3.86 0 4.85.5a4.6 4.6 0 0 1 2.01 2.01c.5.98.5 2.27.5 4.85L22 ${f(14.64 + dy)}c0 2.58 0 3.86-.5 4.85a4.6 4.6 0 0 1 -2.01 2.01c-.98.5-2.27.5-4.85.5L9.36 ${f(22 + dy)}c-2.58 0-3.86 0-4.85-.5a4.6 4.6 0 0 1 -2.01-2.01c-.5-.98-.5-2.27-.5-4.85L2 ${f(9.36 + dy)}c0-2.58 0-3.86.5-4.85a4.6 4.6 0 0 1 2.01-2.01c.98-.5 2.27-.5 4.85-.5Z`

export function snowman() {
  const defs = ['defs', {}, [
    lin(0, 12, 3, 12, 30, [stop(0, C.c2), stop(1, C.shadow)]),
    rad(1, 12, 1, 14, [stop(0, C.shine, 0.42), stop(0.55, C.shine, 0.1), stop(1, C.shine, 0)]),
    lin(2, 12, 2, 12, 22, [stop(0, C.shine, 0.75), stop(0.3, C.shine, 0), stop(0.7, C.shadow, 0), stop(1, C.shadow, 0.55)]),
    lin(3, 9, 7, 15, 20, [stop(0, C.c1), stop(1, C.tint)]),
  ]]
  const n = [defs]
  n.push(P(tile(0.5), { fill: C.shadow, 'fill-opacity': 0.28 }, 'wm-shadow'))
  n.push(P(tile(), { fill: url(0) }, 'wm-deco'))
  n.push(P(tile(), { fill: url(1) }, 'wm-deco'))
  // falling snow
  n.push(P([[5, 6, 0.42], [7.4, 4.3, 0.3], [18.6, 5.2, 0.45], [19.6, 9.4, 0.32], [4.5, 10.4, 0.34], [17.3, 3.6, 0.26]].map(c => circ(...c)).join(''), { fill: C.shine, 'fill-opacity': 0.75 }, 'wm-deco'))
  // snow drift along the bottom of the tile
  n.push(P('M2.04 18.9 C5 18.1 8.5 18.5 12 19.1 C15.5 18.4 19 18.1 21.96 18.9 C21.9 20.2 21.4 21 19.9 21.6 C18.9 22 17.2 22 14.64 22 L9.36 22 C6.8 22 5.1 22 4.1 21.6 C2.6 21 2.1 20.2 2.04 18.9Z', { fill: C.tint }, 'wm-deco'))
  // stick arms
  n.push(P('M8.3 14.4 L5.4 12.3 M6.6 13.2 L6.4 11.7 M15.7 14.4 L18.6 12.3 M17.4 13.2 L17.6 11.7', { stroke: C.ink, 'stroke-width': 0.8, 'stroke-linecap': 'round', fill: 'none' }, 'wm-a'))
  // soft drop shadow, then the snow glyph
  n.push(P(circ(12.2, 15.9, 4.0) + circ(12.2, 10.6, 2.9), { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-shadow'))
  n.push(P(circ(12, 15.6, 4.0) + circ(12, 10.3, 2.9), { fill: url(3) }, 'wm-k'))
  n.push(P(circ(12, 15.2, 0.48) + circ(12, 17.0, 0.48), { fill: C.ink }, 'wm-k'))
  // face
  n.push(P(circ(11, 10.1, 0.42) + circ(13, 10.1, 0.42), { fill: C.ink }, 'wm-k'))
  n.push(P('M11.8 10.85 L14.3 11.35 L11.9 11.55Z', { fill: C.c4, 'stroke-linejoin': 'round' }, 'wm-k'))
  // scarf, its end blowing out to the right
  n.push(P('M9.3 12.4 C10.9 13.3 13.1 13.3 14.7 12.4 L14.95 13.6 C13.2 14.5 10.8 14.5 9.05 13.6Z', { fill: C.accent }, 'wm-a'))
  n.push(P('M13.8 13.2 C15 13.1 16 13.6 16.8 14.6 L15.6 15.5 C15.1 14.8 14.5 14.4 13.9 14.3Z', { fill: C.accent }, 'wm-a'))
  // top hat with a band
  n.push(P('M8.6 7.9 C10.4 7.3 13.6 7.3 15.4 7.9 L15.4 8.5 C13.6 8 10.4 8 8.6 8.5Z', { fill: C.ink }, 'wm-a'))
  n.push(P('M9.9 7.7 L10.1 3.9 C10.1 3.6 10.3 3.5 10.6 3.5 L13.4 3.5 C13.7 3.5 13.9 3.6 13.9 3.9 L14.1 7.7 C12.7 7.5 11.3 7.5 9.9 7.7Z', { fill: C.ink }, 'wm-a'))
  n.push(P('M10.02 6.4 C11.3 6.25 12.7 6.25 13.98 6.4 L14.03 7.1 C12.7 6.95 11.3 6.95 9.97 7.1Z', { fill: C.accent }, 'wm-a'))
  // gloss over the whole tile
  n.push(P(tile(), { fill: url(2), 'fill-opacity': 0.5 }, 'wm-shine'))
  return n
}
