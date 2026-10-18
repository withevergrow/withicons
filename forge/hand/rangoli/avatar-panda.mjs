// forge/hand/rangoli/avatar-panda.mjs: a panda face (ears rimmed in orange so they hold on dark; bold eye patches and nose, no tiny mouth): pale glowing head with a thin orange rim, dark round ears,
// tilted dark eye patches with a bright glint, a dark nose, and the rangoli colour kept as pattern accents (a small
// marigold bindi on the forehead and magenta cheek blush) instead of colouring the whole face orange like a bear.
// Motion: head wm-k, eyes wm-a, bindi wm-deco.
import { col } from '../../styles/_rangoli-core.mjs'
import { marigold, disc } from '../../styles/_rangoli-motifs.mjs'

const NAME = 'avatar-panda'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const f = v => +v.toFixed(2)

// rotated ellipse as a path (two arcs), rot in degrees
function ell(cx, cy, rx, ry, rot) {
  const a = rot * Math.PI / 180, dx = rx * Math.cos(a), dy = rx * Math.sin(a)
  return `M${f(cx - dx)} ${f(cy - dy)}A${rx} ${ry} ${rot} 1 0 ${f(cx + dx)} ${f(cy + dy)}A${rx} ${ry} ${rot} 1 0 ${f(cx - dx)} ${f(cy - dy)}Z`
}

export default function render() {
  const [o, i, h] = marigold(12, 8.7, 1.35)
  const ears = disc(5.7, 6.9, 2.8) + disc(18.3, 6.9, 2.8)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8.6, cy: 8.6, r: 20, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['radialGradient', { id: id(1), cx: 9.5, cy: 9.5, r: 13, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('shine')), st(0.6, col('tint')), st(1, col('tint'))]],
      ['linearGradient', { id: id(2), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: ears + disc(12.2, 14.1, 7.7), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: ears, fill: col('ink'), stroke: url(0), 'stroke-width': 1.1, class: 'wm-k' }],
    ['path', { d: disc(12, 13.6, 7.7), fill: url(1), stroke: url(0), 'stroke-width': 1.1, class: 'wm-k' }],
    ['path', { d: ell(8.5, 13, 1.9, 2.7, 26) + ell(15.5, 13, 1.9, 2.7, -26), fill: col('ink'), class: 'wm-k' }],
    ['circle', { cx: 8.9, cy: 12.5, r: 0.75, fill: col('shine'), class: 'wm-a' }],
    ['circle', { cx: 15.1, cy: 12.5, r: 0.75, fill: col('shine'), class: 'wm-a' }],
    ['ellipse', { cx: 6.2, cy: 16.8, rx: 1.35, ry: 0.85, fill: col('c3'), 'fill-opacity': 0.4, class: 'wm-deco' }],
    ['ellipse', { cx: 17.8, cy: 16.8, rx: 1.35, ry: 0.85, fill: col('c3'), 'fill-opacity': 0.4, class: 'wm-deco' }],
    ['path', { d: 'M10.3 15.3C10.3 14.5 11 14.1 12 14.1C13 14.1 13.7 14.5 13.7 15.3C13.7 16.1 12.7 17 12 17.2C11.3 17 10.3 16.1 10.3 15.3Z', fill: col('ink'), class: 'wm-k' }],
    ['path', { d: o, fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: i, fill: url(2), class: 'wm-deco' }],
    ['path', { d: h, fill: col('shadow'), class: 'wm-deco' }],
    ['path', { d: 'M5.4 5.3A1.8 1.8 0 0 1 6.9 4.5', stroke: col('shine'), 'stroke-opacity': 0.45, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
