const V = (r, h) => `var(--with-halloween-${r}, ${h})`;
const INK = V('ink', '#1D1029');
const n = (v) => +v.toFixed(2);
const sheet = (x, y) => `M${n(x + 5)} ${n(y + 3)}H${n(x + 17)}V${n(y + 18)}A2.5 2.5 0 0 1 ${n(x + 14.5)} ${n(y + 20.5)}H${n(x + 7.5)}A2.5 2.5 0 0 1 ${n(x + 5)} ${n(y + 18)}Z`;
const roll = (x, y) => `M${n(x + 4)} ${n(y)}H${n(x + 18)}A2 2 0 0 1 ${n(x + 18)} ${n(y + 4)}H${n(x + 4)}A2 2 0 0 1 ${n(x + 4)} ${n(y)}Z`;
const heart = 'M11 17C7.2 14.5 6.2 12.6 6.2 10.9C6.2 9.2 7.4 8 8.9 8C9.9 8 10.6 8.6 11 9.3C11.4 8.6 12.1 8 13.1 8C14.6 8 15.8 9.2 15.8 10.9C15.8 12.6 14.8 14.5 11 17Z';
export default function render() {
  const g = 'wg-halloween-love-scroll-0';
  const S = { stroke: INK, 'stroke-width': 0.85, 'stroke-linejoin': 'round' };
  return [
    ['defs', {}, [['linearGradient', { id: g, x1: 11, y1: 2, x2: 11, y2: 22, gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': V('shine', '#FFF6E2') }], ['stop', { offset: 1, 'stop-color': V('tint', '#FFF1B8') }]]]]],
    ['path', { d: sheet(0.15, 0.85) + roll(0.15, 2.85) + roll(0.15, 19.35), fill: V('shadow', '#2A1642'), 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: sheet(0, 0), fill: `url(#${g})`, ...S, class: 'wm-k' }],
    ['path', { d: roll(0, 2), fill: V('c1', '#FF9F2E'), ...S, class: 'wm-k' }],
    ['path', { d: roll(0, 18.5), fill: V('c1', '#FF9F2E'), ...S, class: 'wm-k' }],
    ['path', { d: heart, fill: V('c3', '#8B55E0'), ...S, class: 'wm-a' }],
    ['path', { d: 'M8 10.4C8.2 9.8 8.6 9.4 9.2 9.3', stroke: V('shine', '#FFF6E2'), 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M22.4 6.8C20.6 7.4 19.3 9 18.8 11.4L18.5 13L19.8 12.3C21.4 11.2 22.3 9.3 22.4 6.8Z', fill: V('c4', '#86D13A'), ...S, class: 'wm-deco' }],
    ['path', { d: 'M18.5 13L18 14.4', stroke: INK, 'stroke-width': 0.85, 'stroke-linecap': 'round', class: 'wm-deco' }],
  ];
}
