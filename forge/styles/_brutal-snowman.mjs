// BRUTAL snowman, hand-drawn: a fat flat snowman in thick ink with a hard offset shadow. A loud pink beanie with an
// orange cuff and a green pompom, a blue scarf with a hanging end, chunky stick arms, a carrot nose, coal eyes and
// two coal buttons. Flat on purpose: no defs, no gradients. Roles: body c1 (snow), beanie c2, scarf c3, pompom c4,
// cuff + carrot accent, outline + shadow ink (currentColor). Motion: shadow wm-shadow, body wm-k, beanie/scarf/arms wm-a.
const v = (r, h) => r === 'ink' ? 'var(--with-brutal-ink, currentColor)' : `var(--with-brutal-${r}, ${h})`
const C = { ink: v('ink'), c1: v('c1', '#FFFFFF'), c2: v('c2', '#FF6BA8'), c3: v('c3', '#4D7CFE'), c4: v('c4', '#3DDC97'), accent: v('accent', '#FF8A3D') }
const f = n => +n.toFixed(2)
const circ = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
// shift every coordinate pair of an absolute path (M L C Q H V not used with relative arcs below)
const sh = (d, dx, dy) => Array.isArray(d) ? circ(d[0] + dx, d[1] + dy, d[2]) : dx || dy ? d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(+x + dx)} ${f(+y + dy)}`) : d
const W = 1.05, O = 1.1, X = -0.5, Y = -0.55 // ink weight, shadow offset, drawing shift (drawing + shadow centred)

const BODY = [12, 16.6, 5.4]
const HEAD = [12, 10.1, 3.7]
const ARMS = 'M7.2 14.6 L3.4 11.9 M5 13 L4.7 10.9 M16.8 14.6 L20.6 11.9 M19 13 L19.3 10.9'
const HAT = 'M8.1 7.4 C8.1 4.9 9.8 3.5 12 3.5 C14.2 3.5 15.9 4.9 15.9 7.4Z'
const CUFF = 'M7.8 6.6 L16.2 6.6 Q16.9 6.6 16.9 7.3 L16.9 8.5 Q16.9 9.2 16.2 9.2 L7.8 9.2 Q7.1 9.2 7.1 8.5 L7.1 7.3 Q7.1 6.6 7.8 6.6Z'
const POM = [12, 3.3, 1.3]
const SCARF = 'M8.2 12.2 C10.5 13.5 13.5 13.5 15.8 12.2 L16.4 14.6 C13.8 16 10.2 16 7.6 14.6Z'
const TAIL = 'M13.3 14.8 L15.7 14.3 L16.7 18.6 L14.3 19.1Z'

export function snowman() {
  const at = d => sh(d, X, Y), sd = d => sh(d, X + O, Y + O)
  const ink = { stroke: C.ink, 'stroke-width': W, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }
  const n = []
  // the hard shadow: the whole silhouette in solid ink, down-right
  n.push(['path', { d: sd(ARMS), fill: 'none', stroke: C.ink, 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-shadow' }])
  n.push(['path', { d: [BODY, HEAD, HAT, CUFF, POM, TAIL].map(sd).join(''), fill: C.ink, ...ink, class: 'wm-shadow' }])
  // stick arms
  n.push(['path', { d: at(ARMS), fill: 'none', stroke: C.ink, 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-a' }])
  // the two balls: outline both first, then fill both, so the outline is one clean silhouette
  n.push(['path', { d: at(BODY) + at(HEAD), fill: C.c1, ...ink, class: 'wm-k' }])
  n.push(['path', { d: at(BODY) + at(HEAD), fill: C.c1, class: 'wm-k' }])
  // buttons
  n.push(['path', { d: [circ(12 + X, 16.9 + Y, 0.8), circ(12 + X, 19.4 + Y, 0.8)].join(''), fill: C.ink, class: 'wm-k' }])
  // scarf
  n.push(['path', { d: at(TAIL), fill: C.c3, ...ink, class: 'wm-a' }])
  n.push(['path', { d: at(SCARF), fill: C.c3, ...ink, class: 'wm-a' }])
  // face: coal eyes, carrot, grin
  n.push(['path', { d: [circ(10.6 + X, 9.7 + Y, 0.62), circ(13.4 + X, 9.7 + Y, 0.62)].join(''), fill: C.ink, class: 'wm-k' }])
  n.push(['path', { d: at('M11.6 10.7 L14.9 11.5 L11.9 11.95Z'), fill: C.accent, stroke: C.ink, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-k' }])
  // beanie: dome, cuff, pompom
  n.push(['path', { d: at(HAT), fill: C.c2, ...ink, class: 'wm-a' }])
  n.push(['path', { d: at('M10.3 4.5 L10.3 6.6 M12 3.9 L12 6.6 M13.7 4.5 L13.7 6.6'), fill: 'none', stroke: C.ink, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-a' }])
  n.push(['path', { d: at(CUFF), fill: C.accent, ...ink, class: 'wm-a' }])
  n.push(['path', { d: at(POM), fill: C.c4, ...ink, class: 'wm-a' }])
  return n
}
