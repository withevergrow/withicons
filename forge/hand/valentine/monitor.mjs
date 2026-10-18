// forge/hand/valentine/monitor.mjs — a rosy display frame with a cream screen on a tall neck and wide foot, no floating
// hearts; the generated cream box with a squat stand and hearts read like the laptop or a cake.
const C1 = 'var(--with-valentine-c1, #FF6B8E)'
const C2 = 'var(--with-valentine-c2, #E8304F)'
const C4 = 'var(--with-valentine-c4, #FFF3E3)'
const INK = 'var(--with-valentine-ink, #6A1B3A)'
const SH = 'var(--with-valentine-shadow, #A3163F)'
const SHINE = 'var(--with-valentine-shine, #FFFFFF)'

const FRAME = 'M4 3 H20 A2 2 0 0 1 22 5 V14.5 A2 2 0 0 1 20 16.5 H4 A2 2 0 0 1 2 14.5 V5 A2 2 0 0 1 4 3 Z'
const SCREEN = 'M5 5.25 H19 A0.75 0.75 0 0 1 19.75 6 V13.5 A0.75 0.75 0 0 1 19 14.25 H5 A0.75 0.75 0 0 1 4.25 13.5 V6 A0.75 0.75 0 0 1 5 5.25 Z'
const NECK = 'M10.25 16 H13.75 V19.75 H10.25 Z'
const FOOT = 'M7.5 19.5 H16.5 A1 1 0 0 1 17.5 20.5 V20.5 A1 1 0 0 1 16.5 21.5 H7.5 A1 1 0 0 1 6.5 20.5 V20.5 A1 1 0 0 1 7.5 19.5 Z'

const halo = (d, cls) => ['path', { d, fill: 'none', stroke: C4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: cls }]
const body = (d, fill, cls) => ['path', { d, fill, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: cls }]

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-valentine-monitor-0', x1: 10, y1: 3, x2: 14, y2: 21.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.4, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
    ]],
    halo(NECK, 'wm-a'),
    halo(FOOT, 'wm-a'),
    halo(FRAME, 'wm-k'),
    body(NECK, C2, 'wm-a'),
    ['path', { d: 'M12.6 16.8 H13.4 V19.5 H12.6 Z', fill: SH, 'fill-opacity': 0.5, class: 'wm-shadow' }],
    body(FOOT, 'url(#wg-valentine-monitor-0)', 'wm-a'),
    ['path', { d: 'M7 20.7 H17 A0.9 0.9 0 0 1 16.4 21.15 H7.6 A0.9 0.9 0 0 1 7 20.7 Z', fill: SH, 'fill-opacity': 0.5, class: 'wm-shadow' }],
    body(FRAME, 'url(#wg-valentine-monitor-0)', 'wm-k'),
    ['path', { d: 'M21.6 6 V14.5 A1.6 1.6 0 0 1 20 16.1 H5 V15.6 H19.6 A1 1 0 0 0 20.6 14.6 V6.6 Z', fill: SH, 'fill-opacity': 0.45, class: 'wm-shadow' }],
    body(SCREEN, C4, 'wm-k'),
    ['path', { d: 'M19.4 13.9 H5.2 V13.2 H18.4 A0.6 0.6 0 0 0 19 12.6 V6 A0.4 0.4 0 0 1 19.4 6.3 Z', fill: SH, 'fill-opacity': 0.25, class: 'wm-shadow' }],
    ['path', { d: 'M7 12 L11.2 7.8 M9.9 12 L12.4 9.5', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['path', { d: 'M2.95 8 V5.2 A1.3 1.3 0 0 1 4.1 3.95', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
  ]
}
