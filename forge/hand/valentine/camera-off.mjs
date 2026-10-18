// forge/hand/valentine/camera-off.mjs — the same cream camera as `camera` (top bump, ringed lens) with a red slash
// across it; the generated one cut the body apart and lost the lens.
const C1 = 'var(--with-valentine-c1, #FF6B8E)'
const C2 = 'var(--with-valentine-c2, #E8304F)'
const C4 = 'var(--with-valentine-c4, #FFF3E3)'
const INK = 'var(--with-valentine-ink, #6A1B3A)'
const SH = 'var(--with-valentine-shadow, #A3163F)'
const SHINE = 'var(--with-valentine-shine, #FFFFFF)'

const BODY = 'M4 6.5 H7.5 L9 4 H15 L16.5 6.5 H20 A2 2 0 0 1 22 8.5 V18.5 A2 2 0 0 1 20 20.5 H4 A2 2 0 0 1 2 18.5 V8.5 A2 2 0 0 1 4 6.5 Z'
const SLASH = 'M4.5 4.5 L19.5 20'
const HEART = 'M19.63 4.37C19.15 3.67 18.79 3.01 18.98 2.49C19.14 2.02 19.61 1.88 19.92 1.99C20.17 2.08 20.3 2.3 20.27 2.56C20.41 2.34 20.64 2.25 20.9 2.34C21.2 2.45 21.48 2.85 21.32 3.32C21.13 3.85 20.44 4.13 19.63 4.37z'

export default function render() {
  return [
    ['path', { d: BODY, fill: 'none', stroke: C4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: SLASH, fill: 'none', stroke: C4, 'stroke-width': 4.6, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: HEART, fill: C2, stroke: INK, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: BODY, fill: C4, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M20.2 8.4 V18.2 A1.7 1.7 0 0 1 18.5 19.9 H5 A2.6 2.6 0 0 0 7 20.1 H20 A1.8 1.8 0 0 0 21.6 18.5 V8.6 Z', fill: SH, 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['circle', { cx: 12, cy: 13.5, r: 4, fill: C1, stroke: INK, 'stroke-width': 0.72, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 13.5, r: 1.7, fill: C4, stroke: INK, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: SLASH, fill: 'none', stroke: INK, 'stroke-width': 3.3, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: SLASH, fill: 'none', stroke: C2, 'stroke-width': 2.1, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M4.2 8.6 H6.2', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
  ]
}
