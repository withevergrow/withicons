const V = (r, h) => `var(--with-pastel-${r}, ${h})`;
const BOW = 'M9.4 3.4C14.6 6.6 14.6 17.4 9.4 20.6';
export default function render() {
  return [
    ['path', { d: 'M10 4.2C15.2 7.4 15.2 18.2 10 21.4', fill: 'none', stroke: V('shadow', '#EDBD52'), 'stroke-opacity': '0.18', 'stroke-width': '2.8', 'stroke-linecap': 'round', class: 'wm-shadow' }],
    ['line', { x1: '9.4', y1: '3.4', x2: '9.4', y2: '20.6', stroke: V('edge', '#A58FE9'), 'stroke-width': '0.9', 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: BOW, fill: 'none', stroke: V('edge', '#EDBD52'), 'stroke-width': '3', 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: BOW, fill: 'none', stroke: V('c1', '#FFE29C'), 'stroke-width': '1.9', 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M2.6 10.4L5 12L2.6 13.6M4.4 10.4L6.8 12L4.4 13.6', fill: 'none', stroke: V('edge', '#F297B8'), 'stroke-width': '1', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['rect', { x: '2.4', y: '11.2', width: '14', height: '1.6', rx: '0.8', fill: V('c2', '#CDBBF7'), stroke: V('edge', '#A58FE9'), 'stroke-width': '0.6', class: 'wm-a' }],
    ['path', { d: 'M22.4 12C21 14.2 19.2 16.4 17 16.4C15.6 16.4 14.6 15.4 14.6 14.2C14.6 13.2 15.2 12.5 15.9 12C15.2 11.5 14.6 10.8 14.6 9.8C14.6 8.6 15.6 7.6 17 7.6C19.2 7.6 21 9.8 22.4 12Z', fill: V('c3', '#FFC3D7'), stroke: V('edge', '#F297B8'), 'stroke-width': '0.6', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M16.4 9.2C17.6 8.8 18.8 9.6 19.8 10.8', fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': '0.6', 'stroke-width': '0.8', 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
