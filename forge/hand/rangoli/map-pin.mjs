// forge/hand/rangoli/map-pin.mjs — a bold festive-glow teardrop pin with a clear cream window cut as a tiny marigold,
// a deep lip along its lower edge and a soft highlight. Replaces the generated drawing, whose lotus base fanned out
// behind the tip and competed with the point, and whose small window closed up at 16px.
// Roles: pin c1 -> c2, window tint with an accent bindu, lip shadow, highlight shine.
// Motion: whole pin wm-k (floats).
import { col } from '../../styles/_rangoli-core.mjs'
import { disc } from '../../styles/_rangoli-motifs.mjs'

const NAME = 'map-pin'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]

const PIN = 'M19.5 10C19.5 14.5 15.5 18.5 12 21.5C8.5 18.5 4.5 14.5 4.5 10A7.5 7.5 0 0 1 19.5 10Z'
const LIP = 'M4.5 10C4.5 14.5 8.5 18.5 12 21.5C15.5 18.5 19.5 14.5 19.5 10C19.25 14 15.6 17.6 12 20.55C8.4 17.6 4.75 14 4.5 10Z'
const SHINE = 'M6.3 8.6A6 6 0 0 1 9.6 4.9'

// a soft ten-lobed window (marigold outline) of radius r round (cx, cy)
function window_(cx, cy, r, k = 10) {
  const r0 = r * 0.86, rc = r * 1.1, P = (a, rr) => `${Math.round((cx + rr * Math.cos(a)) * 100) / 100} ${Math.round((cy + rr * Math.sin(a)) * 100) / 100}`
  let d = ''
  for (let i = 0; i <= k; i++) {
    const a = -Math.PI / 2 + i * Math.PI * 2 / k
    if (i === 0) { d += 'M' + P(a, r0); continue }
    d += 'Q' + P(a - Math.PI / k, rc) + ' ' + P(a, r0)
  }
  return d + 'Z'
}

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8.9, cy: 6.7, r: 18, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: PIN, fill: url(0), class: 'wm-k' }],
    ['path', { d: LIP, fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: window_(12, 10, 3.2), fill: col('tint'), class: 'wm-k' }],
    ['path', { d: disc(12, 10, 0.9), fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: SHINE, stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
