// forge/hand/rangoli/door-closed.mjs — a warm orange door slab with one soft panel, a dark knob and a small rangoli
// flower on top, standing on a light threshold.
import { col } from '../../styles/_rangoli-core.mjs'

const N = 'door-closed'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const door = dy => `M5 ${20.6 + dy}V${6.6 + dy}A2.6 2.6 0 0 1 7.6 ${4 + dy}H16.4A2.6 2.6 0 0 1 19 ${6.6 + dy}V${20.6 + dy}Z`
const petals = [[12, 1.6], [13.4, 2.8], [10.6, 2.8]]

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 9, cy: 8, r: 17, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: door(0.6), fill: col('shadow'), 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: door(0), fill: url(0), class: 'wm-k' }],
    ['path', { d: 'M3.6 20.2H20.4A1 1 0 0 1 20.4 22.2H3.6A1 1 0 0 1 3.6 20.2Z', fill: url(0), class: 'wm-k' }],
    ['path', { d: 'M8.6 7.6H13.4A1 1 0 0 1 14.4 8.6V16.4A1 1 0 0 1 13.4 17.4H8.6A1 1 0 0 1 7.6 16.4V8.6A1 1 0 0 1 8.6 7.6Z', fill: col('shadow'), 'fill-opacity': 0.22, class: 'wm-k' }],
    ['circle', { cx: 16.4, cy: 13, r: 1.2, fill: col('ink'), class: 'wm-a' }],
    ...petals.map(([x, y]) => ['circle', { cx: x, cy: y, r: 1, fill: col('accent'), class: 'wm-deco' }]),
    ['circle', { cx: 12, cy: 2.8, r: 0.7, fill: col('c1'), class: 'wm-deco' }],
    ['path', { d: 'M5.7 14V6.7A1.9 1.9 0 0 1 7.4 4.75', fill: 'none', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
