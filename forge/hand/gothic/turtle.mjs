// gothic turtle: side view, hex-patterned domed shell, head up right, four legs, small tail.
const INK = 'var(--with-gothic-ink, #221A26)';
const RIM = 'var(--with-gothic-edge, #837A6F)';
const BODY = 'M3.8 13.6H15.6C16.6 13.6 16.8 12 16.2 10.6C15.6 9 16.6 5.4 19 5.4C21 5.4 22 7 21.6 8.8C21.2 10.6 19.6 11 18.8 11.6C18.2 12.2 18.2 14 17.2 15.4C16.8 16 16 16.2 15.2 16.2V19.4C15.2 19.9 14.8 20.2 14.4 20.2H13C12.5 20.2 12.2 19.9 12.2 19.4V16.4H8V19.4C8 19.9 7.6 20.2 7.2 20.2H5.8C5.3 20.2 5 19.9 5 19.4V16.2C4 16 3.4 15.2 3.4 14.6L2.4 15L3.8 13.6Z';
const SHELL = 'M3.2 14C3.2 9 6.4 5.4 10 5.4C13.6 5.4 16.6 9 16.6 14Z';
export default function render() {
  return [
    ['ellipse', { cx: 12, cy: 20.6, rx: 8.6, ry: .9, fill: 'var(--with-gothic-shadow, #140F18)', 'fill-opacity': '.2', class: 'wm-shadow' }],
    ['path', { d: BODY, fill: 'var(--with-gothic-tint, #D3CDC0)', stroke: RIM, 'stroke-width': 1.1, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M15.2 16.2V17.4M12.2 16.4V17.4M8 16.4V17.4M5 16.2V17.4', stroke: 'var(--with-gothic-edge, #837A6F)', 'stroke-width': .7, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M17.6 7.2C18 6.4 18.8 6.2 19.6 6.3', stroke: 'var(--with-gothic-shine, #FFF6DE)', 'stroke-opacity': '.9', 'stroke-width': .6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['circle', { cx: 19.6, cy: 8, r: .75, fill: INK, class: 'wm-k' }],
    ['path', { d: SHELL, fill: 'var(--with-gothic-c4, #1C8A5F)', stroke: RIM, 'stroke-width': 1.1, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M8.4 8.2H11.6L12.9 10.4L11.6 12.6H8.4L7.1 10.4Z', fill: 'var(--with-gothic-shadow, #140F18)', 'fill-opacity': '.25', stroke: INK, 'stroke-width': .9, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M8.4 8.2L7.4 6.2M11.6 8.2L12.6 6.2M12.9 10.4H16.2M7.1 10.4H3.8M8.4 12.6L7.8 14M11.6 12.6L12.2 14', stroke: INK, 'stroke-width': .9, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M4.6 11.6C5 9.2 6.4 7.4 8 6.6', stroke: 'var(--with-gothic-shine, #FFF6DE)', 'stroke-opacity': '.8', 'stroke-width': .6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M4.2 13.2C4.2 9.4 6.8 6.3 10 6.3C13.2 6.3 15.7 9.4 15.7 13.2', stroke: 'var(--with-gothic-tint, #D3CDC0)', 'stroke-opacity': '.55', 'stroke-width': .6, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
