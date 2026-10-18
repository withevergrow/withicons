const V = (r, h) => `var(--with-pastel-${r}, ${h})`;
const BELL = 'M12 3.6C8.4 3.6 6.2 6.3 6.2 9.8V13.6L4.7 16.1C4.3 16.8 4.7 17.6 5.5 17.6H18.5C19.3 17.6 19.7 16.8 19.3 16.1L17.8 13.6V9.8C17.8 6.3 15.6 3.6 12 3.6Z';
export default function render() {
  return [
    ['path', { d: 'M12.6 4.4C9 4.4 6.8 7.1 6.8 10.6V14.4L5.3 16.9C4.9 17.6 5.3 18.4 6.1 18.4H19.1C19.9 18.4 20.3 17.6 19.9 16.9L18.4 14.4V10.6C18.4 7.1 16.2 4.4 12.6 4.4Z', fill: V('shadow', '#EDBD52'), 'fill-opacity': '0.18', class: 'wm-shadow' }],
    ['circle', { cx: '12', cy: '3.4', r: '1.5', fill: V('c2', '#FFCBAF'), stroke: V('edge', '#F8B596'), 'stroke-width': '0.6', class: 'wm-k' }],
    ['path', { d: BELL, fill: V('c1', '#FFE29C'), stroke: V('edge', '#F6D077'), 'stroke-width': '0.6', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M5.6 16.4H18.4L18.9 17.3C18.8 17.5 18.7 17.6 18.5 17.6H5.5C5.3 17.6 5.2 17.5 5.1 17.3Z', fill: V('shadow', '#EDBD52'), 'fill-opacity': '0.3', class: 'wm-k' }],
    ['path', { d: 'M8.4 10.2C8.4 7.6 9.8 6 11.6 5.7', fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': '0.6', 'stroke-width': '1', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M9.8 19.2H14.2C14.2 20.5 13.2 21.5 12 21.5C10.8 21.5 9.8 20.5 9.8 19.2Z', fill: V('c2', '#FFCBAF'), stroke: V('edge', '#F8B596'), 'stroke-width': '0.6', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['line', { x1: '4', y1: '4', x2: '20', y2: '20', stroke: V('edge', '#F8A9C5'), 'stroke-width': '3', 'stroke-linecap': 'round', class: 'wm-s' }],
    ['line', { x1: '4', y1: '4', x2: '20', y2: '20', stroke: V('c3', '#FFC3D7'), 'stroke-width': '1.9', 'stroke-linecap': 'round', class: 'wm-s' }],
  ];
}
