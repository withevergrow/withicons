// forge/hand/plush/door-open.mjs: plush open door, leaf hinged on the left jamb swinging toward the viewer (new design).
const V = (r, h) => `var(--with-plush-${r}, ${h})`;
const INK = V('ink', '#4A2C3D'), SH = V('shadow', '#3A1E46'), SHINE = V('shine', '#FFFFFF'), EDGE = V('edge', '#FFF9F0');
const body = (d, fill, cls = 'wm-k') => ['path', { d, fill, stroke: INK, 'stroke-width': 1.2, 'stroke-linejoin': 'round', class: cls }];
const stitch = (d, cls = 'wm-k') => ['path', { d, fill: 'none', stroke: EDGE, 'stroke-width': 0.42, 'stroke-linecap': 'round', 'stroke-dasharray': '0.8 0.6', 'stroke-opacity': 0.92, class: cls }];

export default function render() {
  return [
    ['path', { d: 'M4 22.6h17.6v.9H4z', fill: SH, 'fill-opacity': 0.16, class: 'wm-shadow' }],
    // frame
    body('M5 2.5h14a2 2 0 0 1 2 2V21H3V4.5a2 2 0 0 1 2-2z', V('c3', '#4C9FE6')),
    stitch('M5.2 3.4h13.6a1.3 1.3 0 0 1 1.3 1.3V20.2'),
    // dark opening
    body('M6 5.5h12V21H6z', V('tint', '#FFF0D9')),
    ['path', { d: 'M13.6 5.5H18V21h-4.4z', fill: SH, 'fill-opacity': 0.17, class: 'wm-k' }],
    // floor
    body('M1.75 20.5h20.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5z', INK),
    // leaf hinged on the left jamb
    body('M6 5.5l7.5-1.5v18.25L6 21z', V('c1', '#F4695E'), 'wm-a'),
    ['path', { d: 'M12.5 4.6l.5-.1v17.1l-.5-.1z', fill: SH, 'fill-opacity': 0.17, class: 'wm-a' }],
    ['path', { d: 'M7 6.3l2.5-.5v13.9L7 19.9z', fill: SHINE, 'fill-opacity': 0.34, class: 'wm-shine' }],
    stitch('M6.9 6.2l5.7-1.1v16.2l-5.7-.9z', 'wm-a'),
    ['circle', { cx: 11.4, cy: 13.2, r: 0.8, fill: V('c2', '#FFC53D'), stroke: INK, 'stroke-width': 0.6, class: 'wm-a' }],
  ];
}
