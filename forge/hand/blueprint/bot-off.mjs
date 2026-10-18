const A = 'var(--with-accent, currentColor)';
const deco = (d, w = 0.45, o = 0.5) => ['path', { d, color: A, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': o, class: 'wm-deco' }];
const dim = (x1, x2) => [deco(`M${x1} 23H${x2}M${x1} 21.7V23.3M${x2} 21.7V23.3`), deco(`M${x1 - 0.65} 23.65L${x1 + 0.65} 22.35M${x2 - 0.65} 23.65L${x2 + 0.65} 22.35`, 0.5, 0.75)];
const ring = deco('M22 12A10 10 0 0 1 2 12A10 10 0 0 1 22 12Z', 0.45, 0.22);
const dot = (pts, cls) => ['path', { d: pts.map(([x, y]) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`).join(''), color: A, stroke: 'currentColor', 'stroke-width': 0.5, class: cls }];export default function render() {
  return [ring, ...dim(2.5, 21.5),
    ['path', { d: 'M10 8H16A3 3 0 0 1 19 11V16M6.2 8.7A3 3 0 0 0 5 11V17.5A3 3 0 0 0 8 20.5H16A3 3 0 0 0 17.6 20', class: 'wm-k' }],
    ['path', { d: 'M12 8V5M13.25 3.75A1.25 1.25 0 0 1 10.75 3.75A1.25 1.25 0 0 1 13.25 3.75ZM9 13V14M15 13V13.5M2.5 12.5V16M21.5 12.5V16', class: 'wm-a' }],
    ['path', { d: 'M3.5 3.5L20.5 20.5', class: 'wm-s' }]];
}
