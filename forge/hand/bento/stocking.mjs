// forge/hand/bento/stocking.mjs — a Christmas stocking on the bento tile in clear value steps: a pale fur cuff, a c1 sock
// and heel and toe patches in the accent, all under one deep outline, so the foot separates from the leg at 16px (the
// generated drawing was one pale wash where the toe read as a blob).
import { col, T, squircle } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const N = 'stocking'
const id = n => `wg-bento-${N}-${n}`, url = n => `url(#${id(n)})`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op) => ['stop', { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

// skeleton-space drawing (24 grid), mapped onto the tile
const BODY = 'M7.5 8V15A6 6 0 0 0 13.5 21H17.5A3 3 0 0 0 17.5 15H17A1 1 0 0 1 16 14V8'
const CUFF = 'M7 3.5H16.5A1.5 1.5 0 0 1 18 5V6.5A1.5 1.5 0 0 1 16.5 8H7A1.5 1.5 0 0 1 5.5 6.5V5A1.5 1.5 0 0 1 7 3.5Z'
const TOE = 'M16.5 15C17.6 16.6 17.6 19.4 16.5 21H17.5A3 3 0 0 0 17.5 15Z'
const HEEL = 'M7.5 14.5C10.75 14.5 12.75 17.5 12.75 20.95A6 6 0 0 1 7.5 15Z'
const SEAMS = 'M16.5 15C17.6 16.6 17.6 19.4 16.5 21M7.5 14.5C10.75 14.5 12.75 17.5 12.75 20.95'
const SW = T.SW

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 8.5, 0, 17.6, [stop(0, 'c1', 0.45), stop(1, 'c1', 0.72)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62', stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(BODY + 'Z', dy) + M(CUFF, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // the sock: a strong c1 duotone mass
  out.push(['path', { d: M(BODY + 'Z'), fill: col('shine') }])
  out.push(['path', { d: M(BODY + 'Z'), fill: url(2) }])
  // heel and toe patches: the accent, one clear step away from the sock
  out.push(['path', { d: M(TOE) + M(HEEL), fill: col('shine') }])
  out.push(['path', { d: M(TOE) + M(HEEL), fill: col('accent'), 'fill-opacity': 0.82 }])
  out.push(['path', { d: M(SEAMS), stroke: col('shadow'), 'stroke-width': 0.7 }])
  out.push(['path', { d: M(BODY), stroke: col('shadow'), 'stroke-width': SW }])
  // the cuff: pale fur with a soft lower shade, the lightest value on the tile
  out.push(['path', { d: M(CUFF), fill: col('edge'), class: 'wm-a' }])
  out.push(['path', { d: M('M5.5 6.1H18V6.5A1.5 1.5 0 0 1 16.5 8H7A1.5 1.5 0 0 1 5.5 6.5Z'), fill: col('c1'), 'fill-opacity': 0.16, class: 'wm-a' }])
  out.push(['path', { d: M(CUFF), stroke: col('shadow'), 'stroke-width': SW, class: 'wm-a' }])
  return out
}
