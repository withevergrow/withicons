// forge/hand/halloween/bread.mjs — a bâtard loaf: one rounded oval with a continuous crust outline, a golden dome
// that darkens toward the base, and three bold diagonal slashes cut across the top. One body + few big cuts keeps it
// a loaf at 16px (the old crown-over-block read as a muffin or sushi).
// Roles: crust c1 -> c2 (lit upper left), cuts tint, outline ink, halo accent, shine shine.
// Motion: loaf wm-k, slashes wm-a (the cuts pulse), shine wm-shine.
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'bread'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
function shift(d, dx, dy) {
  return d.replace(/([MLHVCQAZ])([^MLHVCQAZ]*)/g, (_, c, args) => {
    const v = args.trim() ? args.trim().split(/[\s,]+/).map(Number) : []
    return c + v.map((x, i) => c === 'H' ? num(x + dx) : c === 'V' ? num(x + dy) : num(i % 2 ? x + dy : x + dx)).join(' ')
  })
}

const LOAF = 'M12 5.6C17.6 5.6 22 8.4 22 12.7C22 16.6 18.4 19 12 19C5.6 19 2 16.6 2 12.7C2 8.4 6.4 5.6 12 5.6Z'
const cut = cx => `M${num(cx - 2.8)} 15C${num(cx - 2.6)} 12.6 ${num(cx - 0.9)} 9.4 ${num(cx + 2)} 7.9C${num(cx + 2.2)} 10.6 ${num(cx + 0.5)} 13.6 ${num(cx - 2.8)} 15Z`
const CUTS = cut(7.2) + cut(12) + cut(16.8)

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 10, r: 12.5, fx: 8, fy: 7, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.5, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(1), class: 'wm-deco' }],
    ['path', { d: shift(LOAF, 0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: LOAF, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: CUTS, fill: C.tint, ...INK, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: 'M3.7 11.2C4 9.6 5.2 8.4 7 7.6', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.6, class: 'wm-shine' }],
  ]
}
