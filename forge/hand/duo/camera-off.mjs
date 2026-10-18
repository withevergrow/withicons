const BODY = 'M4 6.5 H7.5 L9 4 H15 L16.5 6.5 H20 A2 2 0 0 1 22 8.5 V18.5 A2 2 0 0 1 20 20.5 H4 A2 2 0 0 1 2 18.5 V8.5 A2 2 0 0 1 4 6.5 Z';
export default function render() {
  return [
    ['path', { d: BODY, fill: 'var(--with-duo, currentColor)', 'fill-opacity': '0.2', stroke: 'none', class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 13.5, r: 3, class: 'wm-a' }],
    ['path', { d: 'M3 3 L21 21', stroke: 'var(--with-duo-accent, currentColor)', class: 'wm-s' }],
  ];
}
