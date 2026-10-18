// Bauhaus zap-off: whole blue bolt, dark diagonal slash laid across it (no cutout).
export default function render() {
  return [
    ['path', { d: 'M13.5 2.5L5 14H11.2L10.5 21.5L19 10H12.8Z', fill: 'var(--with-bauhaus-c3, #2A6BC2)', class: 'wm-k' }],
    ['line', { x1: 3, y1: 3, x2: 21, y2: 21, stroke: 'var(--with-bauhaus-ink, currentColor)', 'stroke-width': 2.4, 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }],
  ];
}
