const V = (r, h) => `var(--with-coquette-${r}, ${h})`;
const INK = V('ink', '#7E2443');
export default function render() {
  const frameO = 'M2.4 21V5a2.6 2.6 0 0 1 2.6-2.6H19a2.6 2.6 0 0 1 2.6 2.6V21Z';
  const frameI = 'M4.2 21V5.6a1.4 1.4 0 0 1 1.4-1.4H18.4a1.4 1.4 0 0 1 1.4 1.4V21Z';
  return [
    ['path', { d: 'M3 21.6V5.6a2.6 2.6 0 0 1 2.6-2.6H19.6a2.6 2.6 0 0 1 2.6 2.6V21.6Z', fill: V('shadow', '#A8345C'), 'fill-opacity': '0.2', class: 'wm-shadow' }],
    ['rect', { x: 4.2, y: 4.2, width: 15.6, height: 16.8, rx: 1.4, fill: V('c4', '#FCEADD'), class: 'wm-k' }],
    ['rect', { x: 14.4, y: 4.2, width: 5.4, height: 16.8, fill: V('c1', '#F8BCCB'), 'fill-opacity': '0.55', class: 'wm-k' }],
    ['path', { d: frameO + frameI, 'fill-rule': 'evenodd', fill: INK, class: 'wm-k' }],
    ['path', { d: 'M2.95 21V5a2.05 2.05 0 0 1 2.05-2.05H19A2.05 2.05 0 0 1 21.05 5V21H20.35V5.6A1.95 1.95 0 0 0 18.4 3.65H5.6A1.95 1.95 0 0 0 3.65 5.6V21Z', fill: V('c2', '#EC8DA6'), class: 'wm-k' }],
    ['path', { d: 'M3.3 20V5.2c0-1 .8-1.9 1.9-1.9H12', fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': '0.8', 'stroke-width': 0.3, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M15.3 5.8H17.5a.7.7 0 0 1 .7.7V21H16.8V7.2H15.3a.7.7 0 0 1 0-1.4Z', fill: INK, class: 'wm-k' }],
    ['path', { d: 'M15.3 6.3H17.4a.3.3 0 0 1 .3.3V21H17.3V6.7H15.3a.2.2 0 0 1 0-.4Z', fill: V('c2', '#EC8DA6'), class: 'wm-k' }],
    ['rect', { x: 1, y: 20.2, width: 22, height: 1.6, rx: 0.8, fill: INK, class: 'wm-k' }],
    ['rect', { x: 1.5, y: 20.7, width: 21, height: 0.6, rx: 0.3, fill: V('c2', '#EC8DA6'), class: 'wm-k' }],
    ['path', { d: 'M4 5.7L13.1 3.35C13.6 3.22 14 3.5 14 4V22.2C14 22.7 13.6 23 13.1 22.85L4 20.6Z', fill: INK, class: 'wm-a' }],
    ['path', { d: 'M4.75 6.3L13.25 4.2V21.95L4.75 19.95Z', fill: V('c1', '#F8BCCB'), class: 'wm-a' }],
    ['path', { d: 'M11.6 4.8L13.25 4.4V21.75L11.6 21.35Z', fill: V('c2', '#EC8DA6'), 'fill-opacity': '0.6', class: 'wm-a' }],
    ['path', { d: 'M5.45 6.9L7 6.5V19.8L5.45 19.45Z', fill: V('tint', '#FFE4EB'), 'fill-opacity': '0.8', class: 'wm-shine' }],
    ['path', { d: 'M5.2 7.1V18.9', fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-width': 0.35, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['ellipse', { cx: 11.5, cy: 13.4, rx: 0.8, ry: 0.9, fill: INK, class: 'wm-a' }],
    ['ellipse', { cx: 11.5, cy: 13.4, rx: 0.4, ry: 0.45, fill: V('accent', '#D9A45B'), class: 'wm-a' }],
    ['path', { d: 'M9.1 10.6C8.5 10.05 7.5 9.4 7.5 8.6c0-.6.75-.95 1.2-.45l.4.4.4-.4c.45-.5 1.2-.15 1.2.45 0 .8-1 1.45-1.6 2Z', fill: INK, class: 'wm-deco' }],
    ['path', { d: 'M9.1 9.95C8.7 9.6 8 9.1 8 8.65c0-.2.25-.35.45-.15l.65.6.65-.6c.2-.2.45-.05.45.15 0 .45-.7.95-1.1 1.3Z', fill: V('c3', '#D7385F'), class: 'wm-deco' }],
  ];
}
