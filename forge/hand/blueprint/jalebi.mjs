// jalebi, blueprint: tight clean spiral with drafting dimension line and centre mark (no syrup drop)
const A = 'var(--with-accent, currentColor)';
export default function render() {
  return [
    ['path', { d: 'M4.75 22H19.25M4.75 20.75V22.5M19.25 20.75V22.5', color: A, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: 'M4.1 22.65L5.4 21.35M18.6 22.65L19.9 21.35', color: A, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M12 1.5v1.6M12 20.9v-1.6M1.5 12h1.6M22.5 12h-1.6', color: A, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: 'M12 12A1.6 1.6 0 0 1 15.2 12A3.2 3.2 0 0 1 8.8 12A4.8 4.8 0 0 1 18.4 12A6.4 6.4 0 0 1 5.6 12A7.25 7.25 0 0 1 19.25 9.5', class: 'wm-k' }],
    ['path', { d: 'M12.8 12A.8.8 0 1 0 11.2 12A.8.8 0 1 0 12.8 12', color: A, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ];
}
