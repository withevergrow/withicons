const V = (r, h) => `var(--with-pastel-${r}, ${h})`;
const bar = (x) => `M${x + 2.25} 3.25h1A2.25 2.25 0 0 1 ${x + 5.5} 5.5v13A2.25 2.25 0 0 1 ${x + 3.25} 20.75h-1A2.25 2.25 0 0 1 ${x} 18.5v-13A2.25 2.25 0 0 1 ${x + 2.25} 3.25Z`;
export default function render() {
  return [
    ['path', { d: 'M5.3 4.1h5.4v17.2H5.3zM14.3 4.1h5.4v17.2h-5.4z', fill: V('shadow', '#9E87E6'), 'fill-opacity': '0.18', class: 'wm-shadow' }],
    ['path', { d: bar(4.75) + bar(13.75), fill: V('c1', '#CDBBF7'), stroke: V('edge', '#B6A1EF'), 'stroke-width': '0.6', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M4.8 17.6a2.2 2.2 0 0 0 2.2 2.1h1a2.2 2.2 0 0 0 2.2-2.1v.9a2.2 2.2 0 0 1-2.2 2.2h-1a2.2 2.2 0 0 1-2.2-2.2zM13.8 17.6a2.2 2.2 0 0 0 2.2 2.1h1a2.2 2.2 0 0 0 2.2-2.1v.9a2.2 2.2 0 0 1-2.2 2.2h-1a2.2 2.2 0 0 1-2.2-2.2z', fill: V('shadow', '#9E87E6'), 'fill-opacity': '0.34', class: 'wm-k' }],
    ['path', { d: 'M6.3 5.2v2.2M15.3 5.2v2.2', fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': '0.6', 'stroke-width': '0.9', 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
