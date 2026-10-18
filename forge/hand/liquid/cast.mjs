const G = (n) => `url(#wg-liquid-cast-${n})`;
const lin = (n, stops, x1 = 2, y1 = 3, x2 = 22, y2 = 21) => ['linearGradient', { id: `wg-liquid-cast-${n}`, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' },
  stops.map(([o, c, a]) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }])];
const C1 = 'var(--with-liquid-c1, #4A9DFF)', C2 = 'var(--with-liquid-c2, #A77BFF)', C3 = 'var(--with-liquid-c3, #1C3F9E)';
const SH = 'var(--with-liquid-shine, #FFFFFF)', SD = 'var(--with-liquid-shadow, #0C1A3A)', C4 = 'var(--with-liquid-c4, #FF7EC1)';

const FRAME = 'M3.6 8.2V6.6A2.3 2.3 0 0 1 5.9 4.3h12.4A2.3 2.3 0 0 1 20.6 6.6v10.6a2.3 2.3 0 0 1-2.3 2.3H14.4';
const W1 = 'M3.6 12.4A6.9 6.9 0 0 1 10.5 19.3';
const W2 = 'M3.6 15.6A3.7 3.7 0 0 1 7.3 19.3';

function tube(d, cls, w) {
  return [
    ['path', { d, stroke: C3, 'stroke-opacity': 0.55, 'stroke-width': w + 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }],
    ['path', { d, stroke: G(cls === 'wm-k' ? 0 : 1), 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }],
    ['path', { d, stroke: G(2), 'stroke-width': w * 0.3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }],
  ];
}

export default function render() {
  return [
    ['defs', {}, [
      lin(0, [[0, C1, 0.55], [1, C1, 0.95]]),
      lin(1, [[0, C2, 0.6], [1, C2, 0.95]]),
      lin(2, [[0, SH, 0.95], [1, SH, 0.25]]),
      lin(3, [[0, SD, 0.1], [1, C4, 0.35]]),
    ]],
    ['path', { d: 'M4 8.8V7.2A2.3 2.3 0 0 1 6.3 4.9h12.4A2.3 2.3 0 0 1 21 7.2v10.6a2.3 2.3 0 0 1-2.3 2.3H14.8', stroke: G(3), 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ...tube(FRAME, 'wm-k', 2.2),
    ...tube(W1, 'wm-a', 2),
    ...tube(W2, 'wm-a', 2),
    ['circle', { cx: 4, cy: 19.2, r: 1.5, fill: G(1), stroke: C3, 'stroke-opacity': 0.55, 'stroke-width': 0.3, class: 'wm-a' }],
    ['circle', { cx: 3.6, cy: 18.8, r: 0.5, fill: SH, 'fill-opacity': 0.85, class: 'wm-shine' }],
  ];
}
