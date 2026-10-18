// forge/hand/halloween/arrow-left-right.mjs — a witch-purple double arrow built like its arrow-left/right siblings (filled
// triangle heads, a slim bar, ink rim, drop shadow, lit upper edges), replacing the generated bone-white one whose big
// rounded heads and short bar read as a bone or an "H". Heads are plate A (wm-a) so the pulse still plays on them.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C3 = V('c3', '#8B55E0'), EDGE = V('edge', '#7344C9'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-arrow-left-right-${n}`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const f = v => Math.round(v * 100) / 100
const poly = pts => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z'
const move = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy])
// inset a convex polygon (clockwise on screen) by d
function inset(pts, d) {
  const n = pts.length, lines = []
  for (let i = 0; i < n; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % n], l = Math.hypot(bx - ax, by - ay)
    const nx = -(by - ay) / l, ny = (bx - ax) / l // inward normal for a clockwise ring (y down)
    lines.push([ax + nx * d, ay + ny * d, bx - ax, by - ay])
  }
  return lines.map((L, i) => {
    const P = lines[(i + n - 1) % n]
    const den = P[2] * L[3] - P[3] * L[2]
    const t = ((L[0] - P[0]) * L[3] - (L[1] - P[1]) * L[2]) / den
    return [P[0] + P[2] * t, P[1] + P[3] * t]
  })
}

export default function render() {
  // the drawn edge (the ink line is centred on it, as in the generated arrows)
  const bar = [[7, 11], [17, 11], [17, 13], [7, 13]]
  const headL = [[2.5, 12], [8.25, 6.25], [8.25, 17.75]]
  const headR = [[21.5, 12], [15.75, 17.75], [15.75, 6.25]]
  const I = 0.36 // half the 0.72 ink rim
  const rim = { fill: INK, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
  const lit = { fill: 'none', stroke: SHINE, 'stroke-opacity': 0.5, 'stroke-width': 0.4, 'stroke-linecap': 'round' }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12.92, r: 12.87, fx: 9.04, fy: 9.93, gradientUnits: 'userSpaceOnUse' }, [st(0, C3), st(0.45, C3), st(1, EDGE)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.58, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, ACCENT, 0.36), st(0.55, ACCENT, 0.162), st(1, ACCENT, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: [bar, headL, headR].map(p => poly(move(p, 0.15, 0.85))).join(''), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // ink rims first, then the purple cores on top, so bar and heads join without a seam
    ['path', { d: poly(bar), ...rim, class: 'wm-k' }],
    ['path', { d: poly(headL) + poly(headR), ...rim, class: 'wm-a' }],
    ['path', { d: poly(inset(bar, I)), fill: `url(#${id(0)})`, class: 'wm-k' }],
    ['path', { d: poly(inset(headL, I)) + poly(inset(headR, I)), fill: `url(#${id(0)})`, class: 'wm-a' }],
    // lit upper edges: the bar's top, each head's upper slope
    ['path', { d: 'M8.9 11.72H15.1', ...lit, class: 'wm-shine' }],
    ['path', { d: 'M4.05 11.55L7.55 8.05M16.6 7.95L19.4 10.75', ...lit, class: 'wm-shine' }],
  ]
}
