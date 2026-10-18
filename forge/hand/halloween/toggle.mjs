// forge/hand/halloween/toggle.mjs — a crisp witch-purple pill track with a ribbed pumpkin knob resting at the on end,
// ink rims, the knob's drop on the track and lit edges. The generated drawing wobbled the track and hung slime goo off
// its bottom, so it read as a slime blob; here the track is a true pill and the knob is clearly offset inside it.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), C3 = V('c3', '#8B55E0')
const C4 = V('c4', '#86D13A'), ACCENT = V('accent', '#FFB52E'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const EDGE = V('edge', '#7344C9'), TINT = V('tint', '#FFF1B8')
const id = n => `wg-halloween-toggle-${n}`
const r2 = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`

// the track: a 19 x 11 pill, end radius 5.5
const track = (dx = 0, dy = 0) => `M${r2(8 + dx)} ${r2(6.5 + dy)}H${r2(16 + dx)}A5.5 5.5 0 0 1 ${r2(16 + dx)} ${r2(17.5 + dy)}` +
  `H${r2(8 + dx)}A5.5 5.5 0 0 1 ${r2(8 + dx)} ${r2(6.5 + dy)}Z`
// the knob: concentric with the right end cap, 2u inside the track wall
const KX = 16, KY = 12, KR = 3.5

// the style's tiny bat (wings spread, half span r), from _halloween-core.mjs batD
function batD(x, y, r) {
  const P = [[0, -0.12], [0.1, -0.36], [0.17, -0.12], [0.42, -0.36], [0.78, -0.42], [1, -0.16]]
  const S = [[1, -0.16], [0.86, 0.02], [0.66, 0.0], [0.56, 0.2], [0.4, 0.12], [0.24, 0.34], [0.12, 0.2], [0, 0.32]]
  const p = ([u, v], m = 1) => r2(x + u * r * m) + ' ' + r2(y + v * r)
  let d = 'M' + p([0, -0.12])
  for (const q of P.slice(1)) d += 'L' + p(q)
  for (let k = 1; k < S.length; k += 2) d += 'Q' + p(S[k]) + ' ' + p(S[k + 1] || S[k])
  const Sm = [...S].reverse()
  for (let k = 1; k < Sm.length; k += 2) d += 'Q' + p(Sm[k], -1) + ' ' + p(Sm[k + 1] || Sm[k], -1)
  for (const q of [...P].reverse().slice(1)) d += 'L' + p(q, -1)
  return d + 'Z'
}

export default function render() {
  const ink = { stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      // 0: the track, witch purple lit from the upper left
      ['radialGradient', { id: id(0), cx: 12, cy: 13.04, r: 12.54, fx: 8.96, fy: 9.66, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C3 }], ['stop', { offset: 0.45, 'stop-color': C3 }], ['stop', { offset: 1, 'stop-color': EDGE }]]],
      // 1: the pumpkin knob
      ['radialGradient', { id: id(1), cx: 16, cy: 12.6, r: 4.9, fx: 14.8, fy: 10.6, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      // 2: the halo
      ['radialGradient', { id: id(2), cx: 12, cy: 12.5, r: 11.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.3 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.13 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(2)})`, class: 'wm-deco' }],
    ['path', { d: track(0.15, 0.85), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: track(), fill: `url(#${id(0)})`, ...ink, class: 'wm-k' }],
    // the track's lit upper-left shoulder, round the left end and along the top
    ['path', { d: 'M3.54 10.38A4.75 4.75 0 0 1 8 7.25H11', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.45, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // the knob: its drop on the track, the pumpkin, ribs, stem and lit shoulder (all part A, so it slides as one)
    ['path', { d: disc(KX + 0.15, KY + 0.85, KR), fill: SHADOW, 'fill-opacity': 0.4, class: 'wm-a' }],
    ['path', { d: 'M15.4 8.9Q15.3 7.7 16.1 7.3Q16.8 7.3 16.6 8Q16.3 8.4 16.6 8.9Z', fill: C4, stroke: INK, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: disc(KX, KY, KR), fill: `url(#${id(1)})`, ...ink, class: 'wm-a' }],
    ['path', { d: 'M14.8 8.8Q13.9 12 14.8 15.2M17.2 8.8Q18.1 12 17.2 15.2', fill: 'none', stroke: C2, 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-opacity': 0.75, class: 'wm-a' }],
    ['path', { d: 'M13.6 10.9A2.7 2.7 0 0 1 14.9 9.4', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a' }],
    // the style's critter: a tiny bat in the free space over the off end
    ['path', { d: batD(6.5, 3, 1.9), fill: EDGE, stroke: INK, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(6.37, 2.9, 0.14) + disc(6.63, 2.9, 0.14), fill: TINT, class: 'wm-deco' }],
  ]
}
