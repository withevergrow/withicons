// clay avatar-penguin: dark puffy body with a cream face and belly, orange beak and feet, so the face reads apart from the body.
const V = (r, h) => `var(--with-clay-${r}, ${h})`;
export default function render() {
  const id = (i) => `wg-clay-avatar-penguin-${i}`;
  const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }];
  const SH = V('shadow', '#1D1F24');
  const body = 'M12 2C7.6 2 5.6 5.6 5.6 9.4V10.6C4 12 3.4 13.6 3.6 15.4C3.8 16.4 5 16.4 6 15.8C6.8 17.6 8.6 19 12 19C15.4 19 17.2 17.6 18 15.8C19 16.4 20.2 16.4 20.4 15.4C20.6 13.6 20 12 18.4 10.6V9.4C18.4 5.6 16.4 2 12 2Z';
  const bodyD = 'M12 2.9C7.6 2.9 5.6 6.5 5.6 10.3V11.5C4 12.9 3.4 14.5 3.6 16.3C3.8 17.3 5 17.3 6 16.7C6.8 18.5 8.6 19.9 12 19.9C15.4 19.9 17.2 18.5 18 16.7C19 17.3 20.2 17.3 20.4 16.3C20.6 14.5 20 12.9 18.4 11.5V10.3C18.4 6.5 16.4 2.9 12 2.9Z';
  const face = 'M12 5.3C10.6 4.2 7.6 4.2 7.6 7.2C7.6 9.4 9.6 10.6 12 10.6C14.4 10.6 16.4 9.4 16.4 7.2C16.4 4.2 13.4 4.2 12 5.3Z';
  const belly = 'M12 10.4C9.3 10.4 8 12.4 8 14.6C8 16.8 9.8 18.1 12 18.1C14.2 18.1 16 16.8 16 14.6C16 12.4 14.7 10.4 12 10.4Z';
  const defs = ['defs', {}, [
    ['radialGradient', { id: id(0), cx: 12, cy: 21.4, r: 8, gradientUnits: 'userSpaceOnUse' }, [stop(0, SH, 0.3), stop(1, SH, 0)]],
    ['radialGradient', { id: id(1), cx: 8.5, cy: 5, r: 17, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('tint', '#8A84A6')), stop(0.45, V('c1', '#3A3D47')), stop(1, SH)]],
    ['radialGradient', { id: id(2), cx: 10, cy: 6, r: 12, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('c2', '#FFFFFF')), stop(0.6, V('c2', '#FFFFFF')), stop(1, V('c4', '#F7D774'))]],
    ['linearGradient', { id: id(3), x1: 5, y1: 4, x2: 19, y2: 21, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('shine', '#FFFFFF'), 0.2), stop(0.5, SH, 0), stop(1, SH, 0.6)]],
    ['radialGradient', { id: id(4), cx: 11, cy: 7, r: 4, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('c4', '#F7D774')), stop(0.6, V('c3', '#F4B23E')), stop(1, SH)]],
  ]];
  return [
    defs,
    ['ellipse', { cx: 12, cy: 21.4, rx: 8.5, ry: 1.4, fill: `url(#${id(0)})`, class: 'wm-shadow' }],
    // feet
    ['ellipse', { cx: 9.6, cy: 19.6, rx: 1.9, ry: 1, fill: `url(#${id(4)})`, stroke: `url(#${id(3)})`, 'stroke-width': 0.42, class: 'wm-k' }],
    ['ellipse', { cx: 14.4, cy: 19.6, rx: 1.9, ry: 1, fill: `url(#${id(4)})`, stroke: `url(#${id(3)})`, 'stroke-width': 0.42, class: 'wm-k' }],
    ['path', { d: bodyD, fill: SH, 'fill-opacity': 0.6, class: 'wm-k' }],
    ['path', { d: body, fill: `url(#${id(1)})`, stroke: `url(#${id(3)})`, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: belly, fill: `url(#${id(2)})`, stroke: `url(#${id(3)})`, 'stroke-width': 0.3, class: 'wm-k' }],
    ['path', { d: face, fill: `url(#${id(2)})`, stroke: `url(#${id(3)})`, 'stroke-width': 0.3, 'fill-rule': 'evenodd', class: 'wm-k' }],
    // eyes
    ['circle', { cx: 10, cy: 7, r: 0.85, fill: V('ink', '#0B0B0E'), class: 'wm-k' }],
    ['circle', { cx: 14, cy: 7, r: 0.85, fill: V('ink', '#0B0B0E'), class: 'wm-k' }],
    ['circle', { cx: 10.3, cy: 6.7, r: 0.28, fill: V('shine', '#FFFFFF'), class: 'wm-shine' }],
    ['circle', { cx: 14.3, cy: 6.7, r: 0.28, fill: V('shine', '#FFFFFF'), class: 'wm-shine' }],
    // beak
    ['path', { d: 'M10.6 8.4H13.4L12 10.2Z', fill: `url(#${id(4)})`, stroke: `url(#${id(3)})`, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-a' }],
    // shine
    ['path', { d: 'M7.4 5.2C8.2 3.6 9.6 2.9 11 2.8', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': 0.55, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['ellipse', { cx: 9.4, cy: 12.6, rx: 0.8, ry: 0.4, fill: V('shine', '#FFFFFF'), 'fill-opacity': 0.8, class: 'wm-shine' }],
  ];
}
