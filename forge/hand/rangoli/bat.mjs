// forge/hand/rangoli/bat.mjs — the bat silhouette: two festive-glow wings with pointed upper tips and a scalloped
// lower edge, parted from a c3 -> c4 body with two pointed ears and two light eyes, plus one small gold spark. The
// generated drawing's magenta body and fused wings read as a butterfly.
// Motion: wings wm-k, body wm-a (floats), spark wm-deco.
import { col } from '../../styles/_rangoli-core.mjs'
import { sparkle } from '../../styles/_rangoli-motifs.mjs'

const NAME = 'bat'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]

const R = 'M14.6 9.8C16.8 9.5 19.3 8.1 22 5.6C22.3 8.4 22 10.6 21 12.7Q19.4 11.5 18.1 13.7Q16.6 12.3 15.3 14.6Q14.9 13.6 14.6 14.3Z'
const L = 'M9.4 9.8C7.2 9.5 4.7 8.1 2 5.6C1.7 8.4 2 10.6 3 12.7Q4.6 11.5 5.9 13.7Q7.4 12.3 8.7 14.6Q9.1 13.6 9.4 14.3Z'

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
      ['radialGradient', { id: id(1), cx: 7, cy: 7, r: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: L + R, fill: url(1), class: 'wm-k' }],
    ['path', { d: 'M9.9 5.6L11.5 8.2H12.5L14.1 5.6V14.4C14.1 16.4 13.2 17.8 12 17.8C10.8 17.8 9.9 16.4 9.9 14.4Z', fill: url(0), class: 'wm-a' }],
    ['circle', { cx: 11, cy: 11.2, r: 0.8, fill: col('shine'), class: 'wm-shine' }],
    ['circle', { cx: 13, cy: 11.2, r: 0.8, fill: col('shine'), class: 'wm-shine' }],
    ['path', { d: sparkle(19.2, 19.4, 2), fill: col('accent'), class: 'wm-deco' }],
  ]
}
