// RETRO hand-drawn snowman (forge/icons/snowman.json stays the base; this replaces only Retro's drawing).
// A 70s ski-lodge patch: cream snowballs in a chunky ink outline, a coral bobble beanie banded with sunset stripes
// and an orange bobble, a teal scarf with a cream-striped hanging end, coal dot eyes, an orange carrot nose,
// a dotted coal smile, Y-shaped twig arms, two coal buttons and the hard brown offset print shadow.
// Stripe slots in order of first appearance: body retro-1 (c1), beanie retro-3 (c2), scarf retro-4 (c3),
// stripes / bobble / nose retro-2 (c4); coal is the fixed letter brown, the shadow --with-retro-shadow.
// the retro.mjs PALETTE defaults (kept in step with it)
const PALETTE = { 1: '#F4B53F', 2: '#EF7D2D', 3: '#DE4B3A', 4: '#178A86', shadow: '#6B3323', letter: '#2A160E' }

const f = v => +v.toFixed(2)
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
const paint = (k, hex) => `var(--with-retro-${k}, ${hex || PALETTE[k]})`

// a horizontal band [y0, y1] of the beanie dome (half ellipse centre (cx, cy), radii rx, ry), as a polygon
function domeBand(cx, cy, rx, ry, y0, y1) {
  const xAt = y => rx * Math.sqrt(Math.max(0, 1 - ((cy - y) / ry) ** 2))
  const L = [], R = []
  const n = 6
  for (let i = 0; i <= n; i++) { const y = y0 + (y1 - y0) * i / n, x = xAt(y); L.push([cx - x, y]); R.push([cx + x, y]) }
  const pts = [...L, ...R.reverse()]
  return 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z'
}

const HEAD = [12, 9.6, 3.7], BODY = [12, 16.6, 5]
const HAT = { cx: 12, cy: 7.6, rx: 3.9, ry: 4.1 }
const balls = (x = 0, y = 0) => disc(HEAD[0] + x, HEAD[1] + y, HEAD[2]) + disc(BODY[0] + x, BODY[1] + y, BODY[2])
const hatD = (x = 0, y = 0) => `M${f(HAT.cx - HAT.rx + x)} ${f(HAT.cy + y)}A${HAT.rx} ${HAT.ry} 0 0 1 ${f(HAT.cx + HAT.rx + x)} ${f(HAT.cy + y)}Z`
const ARMS = 'M7.3 14.9L3.9 12.4M3.9 12.4L3.6 10.4M3.9 12.4L2.1 12.2M16.7 14.9L20.1 12.4M20.1 12.4L20.4 10.4M20.1 12.4L21.9 12.2'
const SCARF_D = 'M8.4 12.4Q12 14.2 15.6 12.4L16 14.2Q12 16.2 8 14.2Z' + 'M13.4 14.8L15.6 14.4L16.2 18.4L14 18.7Z'

export function retroSnowman() {
  const sh = 0.9
  const fill = (d, k, hex, cls) => ['path', cls ? { d, fill: paint(k, hex), class: cls } : { d, fill: paint(k, hex) }]
  const line = (d, w, cls) => ['path', cls ? { d, fill: 'none', stroke: 'currentColor', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }
    : { d, fill: 'none', stroke: 'currentColor', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }]
  return [
    // the hard offset print shadow (balls + beanie + bobble)
    ['path', { d: balls(sh, sh) + hatD(sh, sh) + disc(12 + sh, 3.25 + sh, 1.35), fill: paint('shadow'), stroke: paint('shadow'), 'stroke-width': 1.6, class: 'wm-shadow' }],
    // twig arms in ink, behind the body
    line(ARMS, 1.3, 'wm-a'),
    // cream snowballs, each with its chunky ink outline (the head sits over the body)
    fill(disc(...BODY), 1, '#FFF3D9'),
    line(disc(...BODY), 1.5),
    fill(disc(...HEAD), 1, '#FFF3D9'),
    line(disc(...HEAD), 1.5),
    // beanie (coral) with sunset stripes and an orange bobble
    fill(hatD(), 3, null, 'wm-a'),
    // scarf (teal)
    fill(SCARF_D, 4, null, 'wm-a'),
    fill(domeBand(HAT.cx, HAT.cy, HAT.rx, HAT.ry, 5.5, 6.5) + domeBand(HAT.cx, HAT.cy, HAT.rx, HAT.ry, 7.0, 7.6) + disc(12, 3.25, 1.35), 2, null, 'wm-a'),
    ['path', { d: 'M14 16.1L15.95 15.75M14.25 17.4L16.15 17.05', fill: 'none', stroke: paint(1, '#FFF3D9'), 'stroke-width': 0.6, class: 'wm-a' }],
    // carrot nose
    fill('M11.9 9.6L15.2 10.3L11.9 10.85Z', 2),
    // chunky ink outlines
    line(hatD() + disc(12, 3.25, 1.35), 1.2, 'wm-a'),
    line(SCARF_D, 1.0, 'wm-a'),
    line('M11.9 9.6L15.2 10.3L11.9 10.85Z', 0.6),
    // coal: eyes, dotted smile, two buttons (the fixed dark letter brown, dark on cream in both themes)
    ['path', { d: disc(10.5, 8.95, 0.55) + disc(13.5, 8.95, 0.55) +
      disc(10.45, 11.25, 0.3) + disc(11.2, 11.75, 0.3) + disc(12, 11.9, 0.3) + disc(12.8, 11.75, 0.3) + disc(13.55, 11.25, 0.3) +
      disc(11.4, 17, 0.72) + disc(11.4, 19.4, 0.72), fill: paint('letter') }],
  ]
}
