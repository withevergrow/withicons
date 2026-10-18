// forge/hand/halloween/minimize.mjs — exit fullscreen as two chunky pumpkin arrows (round-ended shafts, solid rounded
// heads whose square corners meet at the centre), ink rim and lit edges, on a fainter, tighter halo: the generated glow
// was as loud as the arrows and blurred the inward read. No critter, like the redrawn maximize, so the pair morphs cleanly.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-minimize-${n}`
const r2 = v => Math.round(v * 100) / 100

// upper-right arrow: head triangle (13.5,10.5) right-angle corner, (13.5,3.5), (20.5,10.5) with 1u round corners;
// a 3u shaft leaves the long edge at its middle and ends in a round cap at (20.25,3.75). The lower-left arrow is the
// same outline turned half a circle about the centre (x,y) -> (24-x, 24-y).
const OUT = [
  ['M', 13.5, 9.5], ['L', 13.5, 4.5], ['Q', 13.5, 3.5, 14.21, 4.21],
  ['L', 15.94, 5.94], ['L', 19.19, 2.69], ['A', 1.5, 21.31, 4.81],
  ['L', 18.06, 8.06], ['L', 19.79, 9.79], ['Q', 20.5, 10.5, 19.5, 10.5],
  ['L', 14.5, 10.5], ['Q', 13.5, 10.5, 13.5, 9.5], ['Z'],
]
function arrowD(turn, dx = 0, dy = 0) {
  const P = (x, y) => turn ? [24 - x + dx, 24 - y + dy] : [x + dx, y + dy]
  let d = ''
  for (const s of OUT) {
    if (s[0] === 'Z') { d += 'Z'; continue }
    if (s[0] === 'A') { const [x, y] = P(s[2], s[3]); d += `A${s[1]} ${s[1]} 0 0 1 ${r2(x)} ${r2(y)}`; continue }
    if (s[0] === 'Q') { const [a, b] = P(s[1], s[2]), [x, y] = P(s[3], s[4]); d += `Q${r2(a)} ${r2(b)} ${r2(x)} ${r2(y)}`; continue }
    const [x, y] = P(s[1], s[2]); d += `${s[0]}${r2(x)} ${r2(y)}`
  }
  return d
}
// the closing Z of OUT is a zero-length segment (the Q above ends where M started)
const body = (dx = 0, dy = 0) => arrowD(false, dx, dy) + arrowD(true, dx, dy)

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.4, r: 12.4, fx: 9, fy: 8.6, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.5, r: 10.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.22 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.09 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: body(0.15, 0.85), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: body(), fill: `url(#${id(0)})`, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // lit edges: each head's upper-left side and each shaft's upper side
    ['path', { d: 'M14.15 5.4L14.15 9.2M16.6 6.1L18.9 3.8M5.4 14.15L9.2 14.15M6.1 16.6L3.8 18.9',
      fill: 'none', stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.42, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
