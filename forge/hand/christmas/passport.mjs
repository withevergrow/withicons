// christmas/passport: a deep cranberry booklet with a gold globe emblem (ring, meridian, equator) and two gold text bars, cream page edge and a small snow cap; the generated version was an orange card with a lemon-like circle.
import { C } from '../../styles/_christmas-core.mjs'

const N = 'passport'
const id = k => `wg-christmas-${N}-${k}`, url = k => `url(#${id(k)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const K = { stroke: C.ink, 'stroke-linejoin': 'round' }
const COVER = 'M7 2.5H17A2 2 0 0 1 19 4.5V19.5A2 2 0 0 1 17 21.5H7A2 2 0 0 1 5 19.5V4.5A2 2 0 0 1 7 2.5Z'
const SPINE = 'M7 2.5H8.4V21.5H7A2 2 0 0 1 5 19.5V4.5A2 2 0 0 1 7 2.5Z'
const GLOBE = 'M12.7 6.6a3.6 3.6 0 1 0 0 7.2a3.6 3.6 0 1 0 0 -7.2Z'
const MERID = 'M12.7 6.6C10.6 8.4 10.6 12 12.7 13.8M12.7 6.6C14.8 8.4 14.8 12 12.7 13.8M12.7 6.6V13.8M9.1 10.2H16.3'
const BAR1 = 'M9.8 16.4H15.6', BAR2 = 'M10.9 18.7H14.5'
const SNOW = 'M12.6 4.5Q12.6 2.5 14.4 2.5H17Q19 2.5 19 4.5V5.5Q18.3 5.9 17.8 5.3Q17.2 6.1 16.5 5.5Q15.7 6.2 15 5.6Q14.3 6.2 13.6 5.6Q13.1 5.9 12.6 5.3Z'

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 5, y1: 2.5, x2: 19, y2: 21.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.46)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.5, x2: 0, y2: 6.2, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: COVER, fill: C.c1, ...K, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: SPINE, fill: C.shadow, 'fill-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: GLOBE, fill: C.c3, ...K, 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: MERID, fill: 'none', stroke: C.ink, 'stroke-width': 0.5, 'stroke-opacity': 0.75, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: BAR1 + BAR2, fill: 'none', stroke: C.c3, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: COVER, fill: url(0), class: 'wm-shine' }],
    ['path', { d: SNOW, fill: url(1), ...K, 'stroke-width': 0.42, class: 'wm-deco' }],
  ]
}
