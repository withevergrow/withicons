// forge/hand/valentine/toilet.mjs — a cream toilet with a rosy seat band and flush button so the bowl separates from the
// tank and reads on light backgrounds; the generated one was all pale cream with cutout slits and vanished at 16px.
const C1 = 'var(--with-valentine-c1, #FF6B8E)'
const C2 = 'var(--with-valentine-c2, #E8304F)'
const C4 = 'var(--with-valentine-c4, #FFF3E3)'
const INK = 'var(--with-valentine-ink, #6A1B3A)'
const SH = 'var(--with-valentine-shadow, #A3163F)'
const SHINE = 'var(--with-valentine-shine, #FFFFFF)'

const TANK = 'M5.5 2.5 H8.5 A2 2 0 0 1 10.5 4.5 V10.25 H3.5 V4.5 A2 2 0 0 1 5.5 2.5 Z'
const SEAT = 'M4.25 10 H19.75 A1.25 1.25 0 0 1 21 11.25 V11.25 A1.25 1.25 0 0 1 19.75 12.5 H4.25 A1.25 1.25 0 0 1 3 11.25 V11.25 A1.25 1.25 0 0 1 4.25 10 Z'
const BOWL = 'M4.5 12.5 H19.5 C19.5 15.25 17.5 17 15 17 H9 C6.5 17 4.5 15.25 4.5 12.5 Z'
const BASE = 'M9.5 16.75 H14.5 L15.2 20.25 A1 1 0 0 1 14.22 21.5 H9.78 A1 1 0 0 1 8.8 20.25 Z'
const HEARTS = 'M14.24 5.39C13.66 4.49 13.24 3.66 13.49 3C13.72 2.42 14.31 2.26 14.69 2.41C15.01 2.54 15.16 2.81 15.11 3.15C15.3 2.87 15.6 2.76 15.92 2.89C16.3 3.04 16.63 3.55 16.41 4.14C16.15 4.79 15.27 5.12 14.24 5.39zM19.63 7.87C19.15 7.17 18.79 6.51 18.98 5.99C19.14 5.52 19.61 5.38 19.92 5.49C20.17 5.58 20.3 5.8 20.27 6.06C20.41 5.84 20.64 5.75 20.9 5.84C21.2 5.95 21.48 6.35 21.32 6.82C21.13 7.35 20.44 7.63 19.63 7.87z'

const halo = (d, cls) => ['path', { d, fill: 'none', stroke: C4, 'stroke-width': 2.9, 'stroke-linejoin': 'round', class: cls }]
const body = (d, fill, cls) => ['path', { d, fill, stroke: INK, 'stroke-width': 1.25, 'stroke-linejoin': 'round', class: cls }]

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-valentine-toilet-0', x1: 12, y1: 10, x2: 12, y2: 12.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
    ]],
    halo(BASE, 'wm-a'),
    halo(TANK, 'wm-k'),
    halo(BOWL, 'wm-k'),
    halo(SEAT, 'wm-k'),
    ['path', { d: HEARTS, fill: C2, stroke: INK, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    // base (pedestal) behind the bowl
    body(BASE, C4, 'wm-a'),
    ['path', { d: 'M14.6 17.2 L15.2 20.25 A1 1 0 0 1 14.22 21.5 H10.6 A1 1 0 0 0 13.6 20.6 L13.1 17.2 Z', fill: SH, 'fill-opacity': 0.5, class: 'wm-shadow' }],
    // tank
    body(TANK, C4, 'wm-k'),
    ['path', { d: 'M10.1 4 A2 2 0 0 1 10.15 4.5 V9.9 H8.6 C9.4 8.6 9.6 6.4 9.2 3.1 A2 2 0 0 1 10.1 4 Z', fill: SH, 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['rect', { x: 5.25, y: 4.5, width: 3.5, height: 1.5, rx: 0.75, fill: C2, stroke: INK, 'stroke-width': 0.9, class: 'wm-k' }],
    // bowl
    body(BOWL, C4, 'wm-k'),
    ['path', { d: 'M19.1 12.85 C18.9 15.2 17.2 16.65 15 16.65 H12.5 C15.6 16.2 17.6 14.9 18.2 12.85 Z', fill: SH, 'fill-opacity': 0.45, class: 'wm-shadow' }],
    // rosy seat band over the rim
    body(SEAT, 'url(#wg-valentine-toilet-0)', 'wm-k'),
    // shine
    ['path', { d: 'M4.6 7.75 V4.9 A1.2 1.2 0 0 1 5.6 3.7 M5 10.9 H11.5 M6.3 13.6 C6.7 14.6 7.4 15.3 8.3 15.7', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['circle', { cx: 12.6, cy: 10.9, r: 0.35, fill: SHINE, 'fill-opacity': 0.9, class: 'wm-shine' }],
  ]
}
