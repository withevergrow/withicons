// forge/hand/halloween/maximize.mjs — two chunky pumpkin arrows flying out to opposite corners, each one piece: a
// round-ended 2.6u shaft and a broad rounded right-angle head, with the ink outline, drop shadow and a shine on each
// head's lit edge; the generated pair carried a spider dangling in the top-left corner, clutter right where the
// arrow's tip must read. Paint (body gradient, halo, rim, shadow, lit edges) matches the hand-drawn minimize exactly, so
// the toggle pair differs only in arrow direction and morphs without a colour jump.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const C = { ink: V('ink', '#1D1029'), c1: V('c1', '#FF9F2E'), c2: V('c2', '#E5530F'), accent: V('accent', '#FFB52E'),
  shadow: V('shadow', '#2A1642'), shine: V('shine', '#FFF6E2') }

const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const r2 = v => Math.round(v * 100) / 100

// the top-right arrow: head corner (20.5, 3.5), legs 7u, hypotenuse x - y = 10; shaft half width 1.3 ending at (14, 10) as in the skeleton
const TR = [
  ['M', 16.08, 6.08], ['L', 14.21, 4.21], ['Q', 13.5, 3.5, 14.5, 3.5], ['L', 19.5, 3.5], ['Q', 20.5, 3.5, 20.5, 4.5],
  ['L', 20.5, 9.5], ['Q', 20.5, 10.5, 19.79, 9.79], ['L', 17.92, 7.92], ['L', 14.92, 10.92], ['A', 14.92, 10.92, 13.08, 9.08], ['Z'],
]
// draw it, optionally turned half a turn about the centre (the bottom-left arrow)
function arrowD(flip, dx = 0, dy = 0) {
  const p = (x, y) => flip ? [24 - x + dx, 24 - y + dy] : [x + dx, y + dy]
  let d = ''
  for (const [c, ...v] of TR) {
    if (c === 'Z') { d += 'Z'; continue }
    if (c === 'A') { const [x, y] = p(v[2], v[3]); d += `A1.3 1.3 0 0 1 ${r2(x)} ${r2(y)}`; continue }
    const pts = []
    for (let i = 0; i < v.length; i += 2) pts.push(p(v[i], v[i + 1]).map(r2).join(' '))
    d += c + pts.join(' ')
  }
  return d
}

export default function render(icon) {
  const id = n => `wg-halloween-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const both = (dx, dy) => arrowD(false, dx, dy) + arrowD(true, dx, dy)
  return [
    ['defs', {}, [
      // body: pumpkin, lit centre (c1) to deep edge (c2), as minimize
      ['radialGradient', { id: id(0), cx: 12, cy: 13.4, r: 12.4, fx: 9, fy: 8.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      // halo: the same faint, tight glow as minimize
      ['radialGradient', { id: id(1), cx: 12, cy: 12.5, r: 10.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.22), st(0.55, C.accent, 0.09), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(1), class: 'wm-deco' }],
    ['path', { d: both(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: both(0, 0), fill: url(0), stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // lit edges, as minimize: each head's lit leg (top leg up right, left leg down left) and each shaft's upper side
    ['path', { d: 'M15.3 4.15L19.1 4.15M14.1 8.98L16 7.08M4.15 19.1L4.15 15.3M9 14.08L7.1 15.98',
      fill: 'none', stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.42, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
