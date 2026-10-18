// skeuo / send: glossy green paper plane, two beveled wings (lit top wing, shaded under wing), firm rim, crease groove, specular glint.
const SH = 'var(--with-skeuo-shadow, #15110D)';
const SHINE = 'var(--with-skeuo-shine, #FFFFFF)';
const EDGE = 'var(--with-skeuo-edge, #0E4A20)';
const PLANE = 'M21 3L3 10L10.5 13.5L14 21Z';
export default function render() {
  return [
    ['path', { d: 'M21.6 4L3.8 11.2L11.2 14.6L14.8 22Z', fill: SH, 'fill-opacity': '0.24', class: 'wm-shadow' }],
    ['path', { d: PLANE, fill: 'var(--with-skeuo-c1, #34A853)', class: 'wm-k' }],
    ['path', { d: 'M21 3L3 10L10.5 13.5Z', fill: 'var(--with-skeuo-c3, #6FD08A)', 'fill-opacity': '0.9', class: 'wm-k' }],
    ['path', { d: 'M21 3L10.5 13.5L14 21Z', fill: 'var(--with-skeuo-c2, #1E7A3A)', 'fill-opacity': '0.85', class: 'wm-k' }],
    ['path', { d: 'M21 3L12.2 13.9L14 21Z', fill: SH, 'fill-opacity': '0.2' }],
    ['path', { d: PLANE, stroke: EDGE, 'stroke-width': '1.1', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M10.5 13.5L21 3', stroke: EDGE, 'stroke-width': '1', 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M10.9 14.3L20.6 4.1', stroke: SHINE, 'stroke-width': '0.45', 'stroke-opacity': '0.55', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M18.6 4.6L5.4 9.8L9.6 11.8Z', fill: SHINE, 'fill-opacity': '0.35', class: 'wm-shine' }],
    ['path', { d: 'M17.4 5.2L6.2 9.6', stroke: SHINE, 'stroke-width': '0.9', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['circle', { cx: '18.9', cy: '4.6', r: '0.55', fill: SHINE, 'fill-opacity': '0.9', class: 'wm-shine' }],
  ];
}
