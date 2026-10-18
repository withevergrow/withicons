// forge/hand/halloween/hammer.mjs — a claw hammer in the style's witch-purple head and pumpkin-orange handle, redrawn with
// a compact rectangular head (flat striking face, short curled claw) on a long slim handle, replacing the generated
// drawing whose oversized hooked head read as a blob or a pick at 16px; no bat, so the hammer owns the frame.
// Drawn upright in a local frame, then turned 45° so the head sits top-right and the grip bottom-left, like the skeleton.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), C3 = V('c3', '#8B55E0'), EDGE = V('edge', '#7344C9')
const ACCENT = V('accent', '#FFB52E'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-hammer-${n}`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const f = v => Math.round(v * 100) / 100
const K = Math.SQRT1_2
const TX = -1.4, TY = 1.5
// local (upright) -> icon frame: 45° clockwise about (12,12), then centred
const T = (x, y) => [12 + K * (x - 12) - K * (y - 12) + TX, 12 + K * (x - 12) + K * (y - 12) + TY]
// path from [cmd, ...xy pairs] in the local frame
const P = (cmds, dx = 0, dy = 0) => cmds.map(([c, ...v]) => {
  let s = c
  for (let i = 0; i < v.length; i += 2) { const [x, y] = T(v[i], v[i + 1]); s += (i ? ' ' : '') + f(x + dx) + ' ' + f(y + dy) }
  return s
}).join('')

const HEAD = [
  ['M', 6.6, 3.5], ['L', 15, 3.5],
  ['C', 17.6, 3.5, 19.8, 5.2, 20.4, 8.6],                     // claw, outer curl
  ['C', 20.55, 9.4, 19.55, 9.75, 19.25, 9.05],                // claw tip
  ['C', 18.6, 7.55, 17.1, 7, 15, 7], ['L', 15, 8.5],          // claw, inner curl back to the head
  ['L', 6.6, 8.5], ['C', 6, 8.5, 5.6, 8.1, 5.6, 7.5],         // striking face
  ['L', 5.6, 4.5], ['C', 5.6, 3.9, 6, 3.5, 6.6, 3.5], ['Z'],
]
const HANDLE = [
  ['M', 10.6, 8], ['L', 13.4, 8], ['L', 13.4, 20.1],
  ['C', 13.4, 20.87, 12.77, 21.5, 12, 21.5], ['C', 11.23, 21.5, 10.6, 20.87, 10.6, 20.1], ['Z'],
]

export default function render() {
  const rim = { stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
  const lit = { fill: 'none', stroke: SHINE, 'stroke-linecap': 'round', 'stroke-width': 0.42 }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 14.5, cy: 11.1, r: 9.24, fx: 12.6, fy: 7.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C3), st(0.45, C3), st(1, EDGE)]],
      ['radialGradient', { id: id(1), cx: 8.5, cy: 15.5, r: 7.7, fx: 6.9, fy: 12.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C1), st(0.5, C1), st(1, C2)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.85, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, ACCENT, 0.36), st(0.55, ACCENT, 0.162), st(1, ACCENT, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(2)})`, class: 'wm-deco' }],
    ['path', { d: P(HEAD, 0.15, 0.85) + P(HANDLE, 0.15, 0.85), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // the wooden grip (plate A) under the iron head
    ['path', { d: P(HANDLE), fill: `url(#${id(1)})`, ...rim, class: 'wm-a' }],
    ['path', { d: P([['M', 11.2, 9.6], ['L', 11.2, 19.8]]), ...lit, 'stroke-opacity': 0.55, class: 'wm-shine' }],
    ['path', { d: P(HEAD), fill: `url(#${id(0)})`, ...rim, class: 'wm-k' }],
    // lit shoulders: the striking face and the top of the head
    ['path', { d: P([['M', 6.2, 7.2], ['L', 6.2, 4.75], ['C', 6.2, 4.35, 6.45, 4.1, 6.85, 4.1], ['L', 12.5, 4.1]]), ...lit, 'stroke-opacity': 0.5, class: 'wm-shine' }],
  ]
}
