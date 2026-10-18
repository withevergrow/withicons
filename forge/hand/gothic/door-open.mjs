const V = (r, h) => `var(--with-gothic-${r}, ${h})`;
const INK = V('ink', '#221A26'), TINT = V('tint', '#D3CDC0'), EDGE = V('edge', '#837A6F'),
  SH = V('shadow', '#140F18'), SHINE = V('shine', '#FFF6DE'), C1 = V('c1', '#B3163B'),
  C3 = V('c3', '#E6A421'), ACC = V('accent', '#C79A38');
export default function render() {
  return [
    ['path', { d: 'M3.1 4.9a2.2 2.2 0 0 1 2.2-2.2h15a2.2 2.2 0 0 1 2.2 2.2v17.2h-19.4z', fill: SH, 'fill-opacity': '.2', class: 'wm-shadow' }],
    // frame
    ['path', { d: 'M2.3 4.5a2.2 2.2 0 0 1 2.2-2.2h15a2.2 2.2 0 0 1 2.2 2.2v17h-19.4z', fill: INK, class: 'wm-k' }],
    ['path', { d: 'M2.75 4.55a1.8 1.8 0 0 1 1.8-1.8h14.9a1.8 1.8 0 0 1 1.8 1.8v16.5h-18.5z', fill: TINT, class: 'wm-k' }],
    ['path', { d: 'M20.4 3.2c.5.4.85.9.85 1.5v16.35h-18.5v-.5h17.9v-15.9c0-.5-.1-1-.25-1.45z', fill: EDGE, 'fill-opacity': '.6', class: 'wm-k' }],
    ['path', { d: 'M3.2 20.6v-16c0-.9.6-1.4 1.4-1.4h14.6c.3 0 .5.05.7.12-.3-.2-.6-.27-.9-.27h-14.5c-1 0-1.75.75-1.75 1.75v15.8z', fill: SHINE, 'fill-opacity': '.9', class: 'wm-k' }],
    ['path', { d: 'M2.9 8.2H5M2.9 12.4H5M2.9 16.6H5M19 8.2H21.1M19 12.4H21.1M19 16.6H21.1M8.6 2.9V5M12 2.9V5M15.4 2.9V5M3.9 10.3V12.4M3.9 14.5V16.6M20 6.1V8.2M20 14.5V16.6', fill: 'none', stroke: EDGE, 'stroke-width': '.26', 'stroke-linecap': 'round', class: 'wm-k' }],
    // doorway
    ['rect', { x: '4.9', y: '4.9', width: '14.2', height: '16.4', fill: INK, class: 'wm-k' }],
    ['rect', { x: '5.3', y: '5.3', width: '11.6', height: '15.8', fill: C3, 'fill-opacity': '.75', class: 'wm-k' }],
    ['path', { d: 'M5.3 5.3h11.6v4.2c-3.5-1-7.6-1.5-11.6-1.2z', fill: SH, 'fill-opacity': '.3', class: 'wm-k' }],
    // right jamb depth
    ['path', { d: 'M16.8 21.1V6.4l1.9-1.1v15.8z', fill: EDGE, class: 'wm-k' }],
    ['path', { d: 'M16.8 21.1V6.4l1.9-1.1', fill: 'none', stroke: INK, 'stroke-width': '.4', 'stroke-linejoin': 'round', class: 'wm-k' }],
    // floor
    ['path', { d: 'M1.2 21.3H4.6M14 21.3H22.8', fill: 'none', stroke: INK, 'stroke-width': '1.1', 'stroke-linecap': 'round', class: 'wm-k' }],
    // leaf, hinged on left jamb
    ['path', { d: 'M4.6 5.5L13.9 3.4V23.2L4.6 20.6z', fill: INK, 'stroke': INK, 'stroke-width': '.4', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M5.2 6L13.3 4.2V22.4L5.2 20.1z', fill: C1, class: 'wm-a' }],
    ['path', { d: 'M12 4.5L13.3 4.2V22.4L12 22z', fill: SH, 'fill-opacity': '.4', class: 'wm-a' }],
    ['path', { d: 'M7.9 5.4V20.85M10.6 4.8V21.6', fill: 'none', stroke: INK, 'stroke-width': '.3', 'stroke-linecap': 'round', 'stroke-opacity': '.9', class: 'wm-a' }],
    ['path', { d: 'M5.2 9.6L13.3 8.6M5.2 16.4L13.3 17.4', fill: 'none', stroke: INK, 'stroke-width': '.3', 'stroke-linecap': 'round', 'stroke-opacity': '.9', class: 'wm-a' }],
    ['path', { d: 'M5.65 6.4L7.5 6V19.9L5.65 19.4z', fill: SHINE, 'fill-opacity': '.16', class: 'wm-a' }],
    ['path', { d: 'M5.6 6.6V12.4', fill: 'none', stroke: SHINE, 'stroke-width': '.3', 'stroke-linecap': 'round', 'stroke-opacity': '.75', class: 'wm-shine' }],
    // handle
    ['path', { d: 'M11.6 11.6V14.6M11.6 13.1H9.8', fill: 'none', stroke: INK, 'stroke-width': '1.2', 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M11.6 11.6V14.6M11.6 13.1H9.8', fill: 'none', stroke: ACC, 'stroke-width': '.6', 'stroke-linecap': 'round', class: 'wm-a' }],
  ];
}
