// forge/hand/valentine/crosshair.mjs — a bold pink reticle ring with four rounded ticks around a cream lens, locked on a
// little red heart at the centre; the generated ring was thin and a floating heart competed with the sight at 16px.
import { C, heartD } from '../../styles/_valentine-core.mjs'

const G = 'url(#wg-valentine-crosshair-0)'
// one outline: ring r 6.5..8.5 united with four 2u ticks (outer tips at 2 / 22, inner tips at 7.5 / 16.5 from centre)
const OUTER = 'M11 3.56V3A1 1 0 0 1 13 3V3.56A8.5 8.5 0 0 1 20.44 11H21A1 1 0 0 1 21 13H20.44A8.5 8.5 0 0 1 13 20.44V21A1 1 0 0 1 11 21V20.44A8.5 8.5 0 0 1 3.56 13H3A1 1 0 0 1 3 11H3.56A8.5 8.5 0 0 1 11 3.56Z'
const INNER = 'M13 5.58V6.5A1 1 0 0 1 11 6.5V5.58A6.5 6.5 0 0 0 5.58 11H6.5A1 1 0 0 1 6.5 13H5.58A6.5 6.5 0 0 0 11 18.42V17.5A1 1 0 0 1 13 17.5V18.42A6.5 6.5 0 0 0 18.42 13H17.5A1 1 0 0 1 17.5 11H18.42A6.5 6.5 0 0 0 13 5.58Z'
const LENS = 'M5.6 12A6.4 6.4 0 1 0 18.4 12A6.4 6.4 0 1 0 5.6 12Z'
const HEART = heartD(12, 12.15, 2.1)

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-valentine-crosshair-0', x1: 10, y1: 2, x2: 14, y2: 22, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C.c1 }],
        ['stop', { offset: 0.4, 'stop-color': C.c1 }],
        ['stop', { offset: 1, 'stop-color': C.c2 }],
      ]],
    ]],
    ['path', { d: OUTER, fill: 'none', stroke: C.c4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // cream lens behind the ticks
    ['path', { d: LENS, fill: C.c4, class: 'wm-k' }],
    ['path', { d: OUTER + INNER, fill: G, 'fill-rule': 'evenodd', stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // shade along the ring's lower-right inside and the right / bottom ticks
    ['path', { d: 'M19.85 10.2A8 8 0 0 1 13.3 19.9L13.25 19.3A7.4 7.4 0 0 0 19.3 10.4Z', fill: C.shadow, 'fill-opacity': 0.5, class: 'wm-shadow' }],
    // highlight on the ring's upper-left
    ['path', { d: 'M5.2 9.2A7.5 7.5 0 0 1 9.2 5.2', fill: 'none', stroke: C.shine, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
    // the locked-on heart (plate A: pulses about 12 12)
    ['path', { d: HEART, fill: C.c2, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['circle', { cx: 11.05, cy: 11.25, r: 0.38, fill: C.shine, 'fill-opacity': 0.9, class: 'wm-shine' }],
  ]
}
