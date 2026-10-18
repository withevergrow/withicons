const A = 'M8.07 9.67 L4.5 14 L11 14 L10 21.5 L14.48 16.08 Z';
const B = 'M14 2.5 L9.52 7.92 L15.93 14.33 L19.5 10 L13 10 Z';
const T = { fill: 'var(--with-duo, currentColor)', 'fill-opacity': '0.2', stroke: 'none', class: 'wm-k' };
export default function render() {
  return [
    ['path', { d: A, ...T }],
    ['path', { d: B, ...T }],
    ['path', { d: A, class: 'wm-k' }],
    ['path', { d: B, class: 'wm-k' }],
    ['path', { d: 'M3 3 L21 21', stroke: 'var(--with-duo-accent, currentColor)', class: 'wm-s' }],
  ];
}
