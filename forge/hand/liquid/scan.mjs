const C = 'M3.5 8.5V6.5a3 3 0 0 1 3-3h2M15.5 3.5h2a3 3 0 0 1 3 3v2M20.5 15.5v2a3 3 0 0 1-3 3h-2M8.5 20.5h-2a3 3 0 0 1-3-3v-2';
const S = 'M4.3 8V6.6a2.3 2.3 0 0 1 2.3-2.3H8M16 4.3h1.4a2.3 2.3 0 0 1 2.3 2.3V8';
const g = (n) => `url(#wg-liquid-scan-${n})`;
const v = (r, h) => `var(--with-liquid-${r}, ${h})`;
export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-liquid-scan-0', x1: 3, y1: 3, x2: 21, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': v('c1', '#4A9DFF') }],
        ['stop', { offset: 0.55, 'stop-color': v('c2', '#A77BFF') }],
        ['stop', { offset: 1, 'stop-color': v('c3', '#1C3F9E') }]]],
      ['linearGradient', { id: 'wg-liquid-scan-1', x1: 6, y1: 10, x2: 18, y2: 14, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': v('c4', '#FF7EC1') }],
        ['stop', { offset: 1, 'stop-color': v('accent', '#FF7EC1') }]]]]],
    ['path', { d: C, transform: undefined, stroke: v('shadow', '#0C1A3A'), 'stroke-opacity': 0.22, 'stroke-width': 3.4, 'stroke-linecap': 'round', class: 'wm-shadow' }],
    ['path', { d: C, stroke: g(0), 'stroke-width': 2.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: C, stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 0.3, fill: 'none', class: 'wm-k' }],
    ['path', { d: S, stroke: v('shine', '#FFFFFF'), 'stroke-opacity': 0.85, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['rect', { x: 6, y: 10.6, width: 12, height: 2.8, rx: 1.4, fill: g(1), class: 'wm-a' }],
    ['path', { d: 'M7.4 11.4h9.2', stroke: v('shine', '#FFFFFF'), 'stroke-opacity': 0.8, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ].map(([t, a, c]) => { if (a) delete a.transform; return c ? [t, a, c] : [t, a]; });
}
