// forge/hand/rangoli/camera-off.mjs — the whole orange camera (top bump, lens ring, shutter dot) with a violet slash
// laid over it on a pale halo, so the camera stays readable and the slash still means "off".
import { col } from '../../styles/_rangoli-core.mjs'
import { sparkle } from '../../styles/_rangoli-motifs.mjs'

const N = 'camera-off'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const body = dy => `M4.2 ${6.6 + dy}H7.6L8.9 ${4.3 + dy}A1.2 1.2 0 0 1 9.9 ${3.7 + dy}H14.1A1.2 1.2 0 0 1 15.1 ${4.3 + dy}L16.4 ${6.6 + dy}H19.8A2.2 2.2 0 0 1 22 ${8.8 + dy}V${18.4 + dy}A2.2 2.2 0 0 1 19.8 ${20.6 + dy}H4.2A2.2 2.2 0 0 1 2 ${18.4 + dy}V${8.8 + dy}A2.2 2.2 0 0 1 4.2 ${6.6 + dy}Z`

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7, cy: 7, r: 22, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: body(0.6), fill: col('shadow'), 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: body(0), fill: url(0), class: 'wm-k' }],
    ['circle', { cx: 12, cy: 13.6, r: 4.6, fill: col('tint'), class: 'wm-k' }],
    ['circle', { cx: 12, cy: 13.6, r: 2.6, fill: col('c3'), class: 'wm-a' }],
    ['circle', { cx: 11.2, cy: 12.8, r: 0.7, fill: col('shine'), 'fill-opacity': 0.8, class: 'wm-shine' }],
    ['circle', { cx: 18.6, cy: 9.6, r: 0.9, fill: col('tint'), class: 'wm-k' }],
    ['path', { d: 'M3.6 11.8V9A1.6 1.6 0 0 1 5.2 7.6H7.4', fill: 'none', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M3.8 3.8L20.2 20.2', fill: 'none', stroke: col('tint'), 'stroke-width': 4.6, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M3.8 3.8L20.2 20.2', fill: 'none', stroke: col('c4'), 'stroke-width': 2.4, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: sparkle(19.6, 3.4, 1.5), fill: col('accent'), class: 'wm-deco' }],
  ]
}
