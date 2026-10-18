// forge/hand/halloween/rakhi.mjs - a big eight-petal pumpkin-orange flower medallion with a witch-purple heart and a candle-light jewel, tied on two clean
// purple strands that each end in a bead and a short fringe. Replaces the generated muddy cluster where the small medallion and diagonal thread blurred together.
// Roles: petals c1 -> c2, heart c3 -> edge, jewel tint/accent, strands c3, beads c1, outline ink, halo accent, shine shine, drop shadow shadow.
// Motion: flower and heart wm-k (sways about 12,12), jewel wm-s (twinkle), strands wm-a, ornaments wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'rakhi'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const num = x => Math.round(x * 100) / 100

const CX = 12, CY = 12, RING = 4.1, PETAL = 2.3
const petals = Array.from({ length: 8 }, (_, i) => {
  const a = i * Math.PI / 4 - Math.PI / 2
  return [num(CX + RING * Math.cos(a)), num(CY + RING * Math.sin(a))]
})

export default function render() {
  const out = [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12.5, r: 8.5, fx: 9.5, fy: 8.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.3, r: 3.3, fx: 11, fy: 11, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.5, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
      ['radialGradient', { id: id(3), cx: 12, cy: 12, r: 1.5, fx: 11.6, fy: 11.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.6, C.tint), st(1, C.accent)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    // drop shadow
    ['path', { d: 'M12.15 12.85L4.15 20.85M12.15 12.85L20.15 4.85', ...ROUND, stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 2.4, class: 'wm-shadow' }],
    ...petals.map(([x, y]) => ['circle', { cx: num(x + 0.15), cy: num(y + 0.85), r: PETAL, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }]),
    // two strands: ink, then purple
    ['path', { d: 'M12 12L4.4 19.6M12 12L19.6 4.4', ...ROUND, stroke: C.ink, 'stroke-width': 3, class: 'wm-a' }],
    ['path', { d: 'M12 12L4.4 19.6M12 12L19.6 4.4', ...ROUND, stroke: C.c3, 'stroke-width': 1.6, class: 'wm-a' }],
    // fringe and beads at the ends
    ['path', { d: 'M3.3 19.4L1.9 20.6M3.8 20.4L2.9 22M4.6 20.9L4.4 22.6M20.7 4.6L22.1 3.4M20.2 3.6L21.1 2M19.4 3.1L19.6 1.4', ...ROUND, stroke: C.c3, 'stroke-width': 0.9, class: 'wm-deco' }],
    ['circle', { cx: 4.4, cy: 19.6, r: 1.4, fill: C.c1, ...INK, class: 'wm-a' }],
    ['circle', { cx: 19.6, cy: 4.4, r: 1.4, fill: C.c1, ...INK, class: 'wm-a' }],
    // the flower: eight petals, each outlined, then the purple heart and the jewel
    ...petals.map(([x, y]) => ['circle', { cx: x, cy: y, r: PETAL, fill: url(0), ...INK, class: 'wm-k' }]),
    ['circle', { cx: 12, cy: 12, r: 3.3, fill: url(1), ...INK, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 1.5, fill: url(3), ...INK, 'stroke-width': 0.6, class: 'wm-s' }],
    ['path', { d: 'M9.5 6.1A2.4 2.4 0 0 1 11.1 5.3', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M5.9 9.2A2.4 2.4 0 0 1 6.8 7.6', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.6, class: 'wm-shine' }],
  ]
  return out
}
