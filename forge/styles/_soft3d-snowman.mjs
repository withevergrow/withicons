// SOFT 3D snowman, hand-drawn (not the generic solid): a glossy, chubby studio-lit snowman with a big red Santa hat,
// a fluffy white trim and a holly sprig, big glossy black eyes, rosy cheeks, a small carrot nose, a striped scarf with
// a fringed end, little twig arms and two coal buttons. Roles: body c1, hat + berries c2, holly c3, carrot c4,
// scarf accent (stripes c2), coal/eyes/twigs ink, shading shine/shadow. Motion: body wm-k, hat/scarf/arms wm-a.
const N = 'snowman'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = {
  c1: v('c1', '#F4F7FB'), c2: v('c2', '#E5483F'), c3: v('c3', '#2F9E55'), c4: v('c4', '#F28A2E'),
  accent: v('accent', '#F5A524'), ink: v('ink', '#2A2E36'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130'),
  tint: v('tint', '#DCE8F5'), twig: v('ink', '#6B4A33'),
}
const f = n => +n.toFixed(2)
const circ = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`
const id = n => `wg-soft3d-${N}-${n}`
const url = n => `url(#${id(n)})`
const stop = (o, c, a = 1) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const rad = (n, cx, cy, r, stops) => ['radialGradient', { id: id(n), cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]

// geometry
const HEAD = [12, 10.4, 3.75], BODY = [12, 16.7, 5.05]
const ballShade = (n, [x, y, r]) => rad(n, x - r * 0.42, y - r * 0.5, r * 1.75, [
  stop(0, C.shine, 0.95), stop(0.28, C.shine, 0.15), stop(0.6, C.tint, 0.1), stop(0.85, C.shadow, 0.22), stop(1, C.shadow, 0.4)])

export function snowman() {
  const defs = ['defs', {}, [
    ballShade(0, BODY), ballShade(1, HEAD),
    lin(2, 9, 2.5, 15, 8.5, [stop(0, C.shine, 0.4), stop(0.45, C.shine, 0), stop(1, C.shadow, 0.35)]),     // hat
    lin(3, 12, 5.8, 12, 8.4, [stop(0, C.shine, 0.9), stop(0.5, C.shine, 0), stop(1, C.shadow, 0.28)]),     // fur trim
    lin(4, 8, 12.4, 16, 15, [stop(0, C.shine, 0.35), stop(0.5, C.shine, 0), stop(1, C.shadow, 0.3)]),      // scarf
    ballShade(6, [18.35, 6.35, 1.2]),
    rad(5, 12, 21.6, 6.6, [stop(0, C.shadow, 0.3), stop(0.6, C.shadow, 0.12), stop(1, C.shadow, 0)]),       // contact shadow
  ]]
  const n = [defs]
  // ground
  n.push(P(ell(12, 21.55, 6.6, 1.25), { fill: url(5) }, 'wm-shadow'))
  // twig arms (behind the body)
  const twig = { stroke: C.twig, 'stroke-width': 0.85, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }
  n.push(P('M7.6 15.4 L3.6 12.7 M5.1 13.7 L4.6 11.9 M5.1 13.7 L3.2 14', twig, 'wm-a'))
  n.push(P('M16.4 15.4 L20.4 12.7 M18.9 13.7 L19.4 11.9 M18.9 13.7 L20.8 14', twig, 'wm-a'))
  // body ball + head (solid snow, then light)
  for (const [i, b] of [[0, BODY], [1, HEAD]]) {
    n.push(P(circ(...b), { fill: C.c1 }, 'wm-k'))
    n.push(P(circ(...b), { fill: url(i) }, 'wm-k'))
  }
  // soft occlusion where the head sits on the body
  n.push(P('M8.6 12.6 C10.4 13.9 13.6 13.9 15.4 12.6 C14.4 14.3 9.6 14.3 8.6 12.6Z', { fill: C.shadow, 'fill-opacity': 0.12 }, 'wm-k'))
  // coal buttons
  for (const y of [16.3, 18.7]) {
    n.push(P(circ(12, y, 0.68), { fill: C.ink }, 'wm-k'))
    n.push(P(circ(11.78, y - 0.24, 0.2), { fill: C.shine, 'fill-opacity': 0.85 }, 'wm-shine'))
  }
  // scarf: a chubby wrapped band + a hanging end with a fringe, orange with red stripes
  const band = 'M8.45 12.3 C10.2 13.5 13.8 13.5 15.55 12.3 C15.9 12.9 15.9 13.7 15.45 14.25 C13.6 15.35 10.4 15.35 8.55 14.25 C8.1 13.7 8.1 12.9 8.45 12.3Z'
  const tail = 'M13.2 14.2 L15.35 13.85 L16.15 17.9 L14.05 18.3 Z'
  n.push(P(tail, { fill: C.accent }, 'wm-a'))
  n.push(P('M13.5 15.55 L15.62 15.2 L15.82 16.2 L13.7 16.55Z', { fill: C.c2 }, 'wm-a'))
  n.push(P(tail, { fill: url(4) }, 'wm-a'))
  n.push(P('M14.35 18.25 L14.5 19.15 M15.05 18.12 L15.2 19 M15.75 17.98 L15.9 18.85', { stroke: C.accent, 'stroke-width': 0.42, 'stroke-linecap': 'round', fill: 'none' }, 'wm-a'))
  n.push(P(band, { fill: C.accent }, 'wm-a'))
  n.push(P('M10.1 13.05 L11.1 13.2 L11.05 14.95 L10 14.8Z M12.95 13.2 L13.95 13.05 L14 14.8 L12.95 14.95Z', { fill: C.c2 }, 'wm-a'))
  n.push(P(band, { fill: url(4) }, 'wm-a'))
  // face: big glossy eyes, rosy cheeks, carrot nose, smile
  for (const x of [10.55, 13.45]) {
    n.push(P(ell(x, 10.15, 0.66, 0.82), { fill: C.ink }, 'wm-k'))
    n.push(P(circ(x - 0.2, 9.85, 0.26), { fill: C.shine }, 'wm-shine'))
    n.push(P(circ(x + 0.22, 10.45, 0.11), { fill: C.shine, 'fill-opacity': 0.8 }, 'wm-shine'))
  }
  n.push(P(ell(9.45, 11.55, 0.72, 0.42), { fill: C.c2, 'fill-opacity': 0.38 }, 'wm-k'))
  n.push(P(ell(14.55, 11.55, 0.72, 0.42), { fill: C.c2, 'fill-opacity': 0.38 }, 'wm-k'))
  n.push(P('M11.55 11.05 C11.9 10.7 12.45 10.75 12.6 11.05 L14.3 11.65 C14.45 11.75 14.4 11.85 14.25 11.85 L12.4 11.75 C11.95 11.75 11.45 11.45 11.55 11.05Z', { fill: C.c4 }, 'wm-k'))
  n.push(P('M11.75 11.05 C12 10.9 12.3 10.92 12.45 11.05', { stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.18, 'stroke-linecap': 'round', fill: 'none' }, 'wm-shine'))
  n.push(P('M11.15 12.3 C11.6 12.7 12.4 12.7 12.85 12.3', { stroke: C.ink, 'stroke-width': 0.36, 'stroke-linecap': 'round', fill: 'none' }, 'wm-k'))
  // Santa hat: a big red cone flopping to the right, a white pompom, a fluffy trim and a holly sprig
  const hat = 'M8.1 7.4 C7.9 4.6 9.7 2.3 12.6 2.2 C15.2 2.1 17.4 3.2 18.6 5.6 C18.9 6.2 18.5 6.6 18 6.3 C17.2 5.6 16.5 5.4 16.1 5.9 C16.3 6.4 16.2 6.9 15.95 7.4Z'
  n.push(P(hat, { fill: C.c2 }, 'wm-a'))
  n.push(P(hat, { fill: url(2) }, 'wm-a'))
  n.push(P('M9.4 5.9 C9.5 4.4 10.6 3.2 12.2 3', { stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.4, 'stroke-linecap': 'round', fill: 'none' }, 'wm-shine'))
  const pom = [18.35, 6.35, 1.2]
  n.push(P(circ(...pom), { fill: C.c1 }, 'wm-a'))
  n.push(P(circ(...pom), { fill: url(6) }, 'wm-a'))
  const trim = 'M7.75 7.2 C7.6 6.2 8.5 5.9 9.1 6.1 C9.6 5.6 10.4 5.6 10.9 5.95 C11.4 5.55 12.6 5.55 13.1 5.95 C13.6 5.6 14.4 5.6 14.9 6.1 C15.5 5.9 16.4 6.2 16.25 7.2 C16.6 7.9 16.1 8.6 15.4 8.5 C14.9 8.9 14.1 8.9 13.6 8.6 C13.1 8.95 10.9 8.95 10.4 8.6 C9.9 8.9 9.1 8.9 8.6 8.5 C7.9 8.6 7.4 7.9 7.75 7.2Z'
  n.push(P(trim, { fill: C.c1 }, 'wm-a'))
  n.push(P(trim, { fill: url(3) }, 'wm-a'))
  // holly sprig on the trim: two leaves and three berries
  n.push(P('M9.55 6.55 C8.7 5.6 7.6 5.7 7.05 6.05 C7.45 6.2 7.5 6.6 7.3 6.85 C8.1 7.15 9 7.05 9.55 6.55Z M9.55 6.55 C9.3 5.35 9.9 4.5 10.55 4.2 C10.5 4.65 10.85 4.85 11.1 4.85 C11 5.75 10.4 6.4 9.55 6.55Z', { fill: C.c3 }, 'wm-a'))
  n.push(P('M9.55 6.55 L7.6 6.25 M9.55 6.55 L10.6 4.75', { stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 0.16, fill: 'none' }, 'wm-a'))
  for (const [x, y] of [[9.35, 6.95], [10.05, 6.65], [9.85, 7.4]]) {
    n.push(P(circ(x, y, 0.36), { fill: C.c2 }, 'wm-a'))
    n.push(P(circ(x - 0.1, y - 0.12, 0.11), { fill: C.shine, 'fill-opacity': 0.9 }, 'wm-shine'))
  }
  // glossy speculars on the two balls
  n.push(P(ell(9.3, 15.7, 0.85, 0.5), { fill: C.shine, 'fill-opacity': 0.7 }, 'wm-shine'))
  n.push(P(ell(16.3, 5.95, 0.42, 0.28), { fill: C.shine, 'fill-opacity': 0.5 }, 'wm-shine'))
  return n
}
