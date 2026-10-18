// forge/hand/halloween/ungroup.mjs — two plump rounded squares, a pumpkin one top-left and a witch-purple one
// bottom-right, drifted apart with a clear gap, each wearing its own slime-green selection corners (open toward the
// other square), so the old shared frame has split into two selections. Replaces the generated drawing of two bare
// rounded squares, which read as generic layers with no sense of breaking a group apart.
// Roles: first square c1 -> c2, second square c3 -> edge, corners c4, outline ink, halo accent, shine shine, shadow shadow.
// Motion: first square wm-k, second square wm-a (nudges diagonally), corners wm-s.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'ungroup'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const r2 = v => Math.round(v * 100) / 100

// a rounded square from (x, y), side s, radius r
const sq = (x, y, s, r) => `M${r2(x + r)} ${r2(y)}H${r2(x + s - r)}A${r} ${r} 0 0 1 ${r2(x + s)} ${r2(y + r)}V${r2(y + s - r)}` +
  `A${r} ${r} 0 0 1 ${r2(x + s - r)} ${r2(y + s)}H${r2(x + r)}A${r} ${r} 0 0 1 ${r2(x)} ${r2(y + s - r)}V${r2(y + r)}A${r} ${r} 0 0 1 ${r2(x + r)} ${r2(y)}Z`
const A = [3, 3, 7], B = [14, 14, 7]     // x, y, side
const ARM = 2.3
// selection corner: the corner point and the inward direction
const bracket = (cx, cy, sx, sy) => `M${r2(cx + sx * ARM)} ${r2(cy)}H${r2(cx)}V${r2(cy + sy * ARM)}`
const FA = [1.2, 11.8], FB = [12.2, 22.8]     // the two selection frames (min, max)
const corners = [
  bracket(FA[0], FA[0], 1, 1), bracket(FA[1], FA[0], -1, 1), bracket(FA[0], FA[1], 1, -1),
  bracket(FB[1], FB[0], -1, 1), bracket(FB[0], FB[1], 1, -1), bracket(FB[1], FB[1], -1, -1),
].join('')

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 6.5, cy: 8.4, r: 7.2, fx: 4.6, fy: 5.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 17.5, cy: 19, r: 7.2, fx: 15.6, fy: 16, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: sq(A[0] + 0.15, A[1] + 0.85, A[2], 2) + sq(B[0] + 0.15, B[1] + 0.85, B[2], 2), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: sq(...A, 2), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: sq(...B, 2), fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: 'M4.1 8.2A2 2 0 0 1 6.1 5.2H8', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.7, class: 'wm-shine' }],
    ['path', { d: 'M15.1 19.2A2 2 0 0 1 17.1 16.2H19', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.7, class: 'wm-shine' }],
    ['path', { d: corners, ...ROUND, stroke: C.ink, 'stroke-width': 1.9, class: 'wm-s' }],
    ['path', { d: corners, ...ROUND, stroke: C.c4, 'stroke-width': 0.85, class: 'wm-s' }],
  ]
}
