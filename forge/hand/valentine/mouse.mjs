// forge/hand/valentine/mouse.mjs — a rosy gradient mouse with an ink button split and a cream scroll wheel; the
// generated pale cream body had too little contrast to read as a mouse.
const C1 = 'var(--with-valentine-c1, #FF6B8E)'
const C2 = 'var(--with-valentine-c2, #E8304F)'
const C4 = 'var(--with-valentine-c4, #FFF3E3)'
const INK = 'var(--with-valentine-ink, #6A1B3A)'
const SH = 'var(--with-valentine-shadow, #A3163F)'
const SHINE = 'var(--with-valentine-shine, #FFFFFF)'

const BODY = 'M12 2.5 A6.5 6.5 0 0 1 18.5 9 V15 A6.5 6.5 0 0 1 5.5 15 V9 A6.5 6.5 0 0 1 12 2.5 Z'
const WHEEL = 'M12 5.5 A1 1 0 0 1 13 6.5 V8.5 A1 1 0 0 1 11 8.5 V6.5 A1 1 0 0 1 12 5.5 Z'
const HEART = 'M19.63 4.37C19.15 3.67 18.79 3.01 18.98 2.49C19.14 2.02 19.61 1.88 19.92 1.99C20.17 2.08 20.3 2.3 20.27 2.56C20.41 2.34 20.64 2.25 20.9 2.34C21.2 2.45 21.48 2.85 21.32 3.32C21.13 3.85 20.44 4.13 19.63 4.37z'

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-valentine-mouse-0', x1: 10, y1: 2.5, x2: 14, y2: 21.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.4, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
    ]],
    ['path', { d: BODY, fill: 'none', stroke: C4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: HEART, fill: C2, stroke: INK, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: BODY, fill: 'url(#wg-valentine-mouse-0)', stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M18.1 13 V15 A6.1 6.1 0 0 1 7.2 18.75 A6.5 6.5 0 0 0 17.3 15 V13.8 Z', fill: SH, 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: 'M5.5 11.5 H18.5 M12 2.5 V5.5 M12 9.5 V11.5', fill: 'none', stroke: INK, 'stroke-width': 0.72, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: WHEEL, fill: C4, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M6.6 9.8 V9 A5.4 5.4 0 0 1 8.4 5', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['circle', { cx: 9.6, cy: 4.25, r: 0.4, fill: SHINE, 'fill-opacity': 0.9, class: 'wm-shine' }],
  ]
}
