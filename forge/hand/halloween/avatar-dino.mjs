// forge/hand/halloween/avatar-dino.mjs — a friendly slime-green dinosaur in profile, facing right: a big round head
// with a long snout, a large eye with a catch-light, a nostril, a smile with one tooth, a blush spot and three bold
// candle-orange back spikes down the neck. Replaces the generated blob, where the eye, mouth and spikes were lost.
// Roles: body c4 (rim shaded by ink), spikes c1 -> c2, tooth + eye light shine, blush c1, outline ink, halo accent.
// Motion: head + neck wm-k; spikes wm-a (sway about 8.5,21.5).
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'avatar-dino'
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

// head and neck: back of the neck up the left, domed head, long snout to the right, jaw, throat, front of the neck
const BODY = 'M5.5 20.6C5.5 17 6.1 13.2 7 9.8C7.8 5.8 10.3 3.2 13.8 3.2C16.4 3.2 17.9 4 19.2 5C20.9 5.1 22 6.2 22 7.9V9.9C22 11.5 20.8 12.6 19.2 12.6H15.4C14 12.6 13.2 13.4 13.2 14.8V20.6C13.2 21.1 12.8 21.4 12.3 21.4H6.4C5.9 21.4 5.5 21.1 5.5 20.6Z'
const SPIKES = 'M6.6 16.8L2.6 15.2L6.2 11.4Z' +
  'M7.4 10.2L3.4 8.3L7.9 5.4Z' +
  'M9.6 5.6L8.6 1.6L13 3.6Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 14, cy: 11, r: 11, fx: 12, fy: 6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c4), st(0.6, C.c4), st(1, C.c4)]],
      ['radialGradient', { id: id(1), cx: 13, cy: 11, r: 11, fx: 11, fy: 5.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.ink, 0), st(0.55, C.ink, 0), st(1, C.ink, 0.34)]],
      ['linearGradient', { id: id(2), x1: 2, y1: 2, x2: 9, y2: 15, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(3), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(3), class: 'wm-deco' }],
    ['path', { d: shift(SPIKES + BODY, 0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: SPIKES, fill: url(2), ...INK, class: 'wm-a' }],
    ['path', { d: BODY, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: BODY, fill: url(1), class: 'wm-k' }],
    // eye, nostril, blush
    ['circle', { cx: 15.2, cy: 7.3, r: 1.7, fill: C.ink, class: 'wm-k' }],
    ['circle', { cx: 15.75, cy: 6.7, r: 0.55, fill: C.shine, class: 'wm-shine' }],
    ['circle', { cx: 20.1, cy: 7.1, r: 0.5, fill: C.ink, class: 'wm-k' }],
    ['circle', { cx: 13.4, cy: 10.3, r: 1.05, fill: C.c1, 'fill-opacity': 0.55, class: 'wm-k' }],
    // smile with a tooth
    ['path', { d: 'M21.2 10C19.6 11 17.6 10.9 16.2 10', ...ROUND, stroke: C.ink, 'stroke-width': 0.7, class: 'wm-k' }],
    ['path', { d: 'M18.1 10.6L19.2 10.7L18.65 11.7Z', fill: C.shine, stroke: C.ink, 'stroke-width': 0.35, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // shine along the lit head and neck
    ['path', { d: 'M8.9 9.6C9.5 6.9 11.2 5.2 13.3 4.8', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M7.2 14.4C7 16.2 6.9 17.8 7 19.2', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.4, 'stroke-width': 0.55, class: 'wm-shine' }],
  ]
}
