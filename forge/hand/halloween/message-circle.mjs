// forge/hand/halloween/message-circle.mjs — a round pumpkin speech bubble with two bowed ribs and a crisp pointed tail
// at the lower left, in the style's halo, drop shadow, midnight outline and crescent shine: the same bubble as the
// generated pumpkin message-circle-more, without its dots. The generated drawing was a pale bone-white disc that
// washed out on light backgrounds and read as a plain cream circle.
// Roles: bubble c1 -> c2, ribs c2, outline ink, halo accent, shine shine, shadow shadow. Motion: one body (wm-k).
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'message-circle'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

// disc: centre (12.5, 11.25), r 9.4, the skeleton's circle grown; the tail leaves it at 120 and 150 degrees and meets
// in a softly rounded point at the lower left
const bubble = (dx, dy) => {
  const p = (x, y) => `${Math.round((x + dx) * 100) / 100} ${Math.round((y + dy) * 100) / 100}`
  return `M${p(7.8, 19.39)}A9.4 9.4 0 1 0 ${p(4.36, 15.95)}L${p(2.71, 20.57)}Q${p(2.25, 21.88)} ${p(3.51, 21.31)}Z`
}

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12.08, cy: 13.48, r: 13.23, fx: 8.94, fy: 8.27, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(2), cx: 12.08, cy: 12.88, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: bubble(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: bubble(0, 0), fill: url(0), ...INK, class: 'wm-k' }],
    // pumpkin ribs, bowed out, kept clear of the edge
    ['path', { d: 'M9.3 4.4Q6.3 11.25 9.3 18.1M15.7 4.4Q18.7 11.25 15.7 18.1', ...ROUND, stroke: C.c2, 'stroke-width': 0.55, 'stroke-opacity': 0.75, class: 'wm-k' }],
    // crescent shine on the lit upper-left shoulder
    ['path', { d: 'M19.57 6.05A8.78 8.78 0 1 0 5.93 17.07A8.78 8.78 0 0 1 19.57 6.05Z', fill: C.shine, 'fill-opacity': 0.55, class: 'wm-shine' }],
  ]
}
