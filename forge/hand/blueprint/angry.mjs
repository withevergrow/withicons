const A = 'var(--with-accent, currentColor)';
const deco = (d, w = 0.45, o = 0.5) => ['path', { d, color: A, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': o, class: 'wm-deco' }];
const dim = (x1, x2) => [deco(`M${x1} 23H${x2}M${x1} 21.7V23.3M${x2} 21.7V23.3`), deco(`M${x1 - 0.65} 23.65L${x1 + 0.65} 22.35M${x2 - 0.65} 23.65L${x2 + 0.65} 22.35`, 0.5, 0.75)];
const ring = deco('M22 12A10 10 0 0 1 2 12A10 10 0 0 1 22 12Z', 0.45, 0.22);
const dot = (pts, cls) => ['path', { d: pts.map(([x, y]) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`).join(''), color: A, stroke: 'currentColor', 'stroke-width': 0.5, class: cls }];export default function render() {
  return [...dim(2.5, 21.5),
    ['path', { d: 'M21.5 12A9.5 9.5 0 0 1 2.5 12A9.5 9.5 0 0 1 21.5 12Z', class: 'wm-k' }],
    ['path', { d: 'M7 7.5L10.5 9.5M17 7.5L13.5 9.5M9 12.5V13.5M15 12.5V13.5M8.5 18A4 4 0 0 1 15.5 18', class: 'wm-a' }]];
}
