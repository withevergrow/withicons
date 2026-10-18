// forge/hand/halloween/avatar-monster.mjs — a one-eyed slime-green monster: two candle-orange horns, one big
// eye (white, purple iris, dark pupil, catch-light), a wide dark grin with two white fangs, stubby waving arms and a
// few darker spots. Replaces the generated blob, which read as a generic cyclops / slime.
// Roles: body c4 (rim shaded by ink), horns c1 -> c2, iris c3, fangs + eye white shine, outline ink, halo accent.
// Motion: body, horns, mouth wm-k; the eye wm-a (blinks about 12,10.25); arms wm-s.
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'avatar-monster'
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

const BODY = 'M12 4C16.7 4 19.6 7.4 19.6 12V18.4C19.6 19.9 18.5 21 17 21H7C5.5 21 4.4 19.9 4.4 18.4V12C4.4 7.4 7.3 4 12 4Z'
const HORN_L = 'M6.9 6.9C5.4 6 4.6 4.5 4.8 2.4C6.8 2.8 8.4 3.8 9.4 5.1Z'
const HORN_R = 'M17.1 6.9C18.6 6 19.4 4.5 19.2 2.4C17.2 2.8 15.6 3.8 14.6 5.1Z'
const ARM_L = 'M4.8 13.4C3.4 12.7 2 13.3 2 14.7C2 16 3.2 16.5 4.8 16Z'
const ARM_R = 'M19.2 13.4C20.6 12.7 22 13.3 22 14.7C22 16 20.8 16.5 19.2 16Z'
const MOUTH = 'M7.8 14.3C8.8 17.9 15.2 17.9 16.2 14.3Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13, r: 10, fx: 9, fy: 8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c4), st(0.6, C.c4), st(1, C.c4)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12, r: 10.5, fx: 8.5, fy: 7, gradientUnits: 'userSpaceOnUse' }, [st(0, C.ink, 0), st(0.55, C.ink, 0), st(1, C.ink, 0.34)]],
      ['linearGradient', { id: id(2), x1: 5, y1: 2, x2: 9, y2: 6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(3), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(3), class: 'wm-deco' }],
    ['path', { d: shift(HORN_L + HORN_R + ARM_L + ARM_R + BODY, 0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: HORN_L + HORN_R, fill: url(2), ...INK, class: 'wm-k' }],
    ['path', { d: ARM_L + ARM_R, fill: C.c4, ...INK, class: 'wm-s' }],
    ['path', { d: BODY, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: BODY, fill: url(1), class: 'wm-k' }],
    // spots
    ['path', { d: 'M7.4 8.6A0.6 0.6 0 1 1 8.6 8.6A0.6 0.6 0 1 1 7.4 8.6ZM15.6 7.9A0.5 0.5 0 1 1 16.6 7.9A0.5 0.5 0 1 1 15.6 7.9ZM17 11.4A0.4 0.4 0 1 1 17.8 11.4A0.4 0.4 0 1 1 17 11.4Z', fill: C.ink, 'fill-opacity': 0.22, class: 'wm-k' }],
    // the eye
    ['circle', { cx: 12, cy: 10.2, r: 3.2, fill: C.shine, ...INK, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 10.4, r: 1.75, fill: C.c3, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 10.4, r: 0.95, fill: C.ink, class: 'wm-a' }],
    ['circle', { cx: 12.65, cy: 9.7, r: 0.4, fill: C.shine, class: 'wm-a' }],
    // grin with two fangs
    ['path', { d: MOUTH, fill: C.ink, ...INK, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: 'M9 14.3L9.9 16.2L10.8 14.3ZM13.2 14.3L14.1 16.2L15 14.3Z', fill: C.shine, class: 'wm-k' }],
    // shine
    ['path', { d: 'M5.8 12C5.9 9.5 7.2 7.2 9.2 6.2', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M5.6 3.9L6.2 4.8', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
