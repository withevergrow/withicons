const deco = { color: 'var(--with-accent, currentColor)', stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' };
export default function render() {
  return [
    ['path', { ...deco, d: 'M4.5 23H19.5M4.5 21.9V23.3M19.5 21.9V23.3M21.8 4V20M20.7 4H22.9M20.7 20H22.9' }],
    ['path', { d: 'M8 2H16M9 2V18A3 3 0 0 0 15 18V2', class: 'wm-k' }],
    ['path', { d: 'M9 12H15', class: 'wm-a' }],
  ];
}
