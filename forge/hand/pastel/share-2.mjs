// pastel/share-2: open-top tray (U walls with rounded caps) with a lilac arrow rising up out of it.
const C1 = 'var(--with-pastel-c1, #B7D6FA)';
const C2 = 'var(--with-pastel-c2, #CDBBF7)';
const EDGE1 = 'var(--with-pastel-edge, #9AC2F2)';
const EDGE2 = 'var(--with-pastel-edge, #B6A1EF)';
const SH1 = 'var(--with-pastel-shadow, #7DAEEA)';
const SH2 = 'var(--with-pastel-shadow, #9E87E6)';
const SHINE = 'var(--with-pastel-shine, #FFFFFF)';

const TRAY = 'M4 12.6V18A3 3 0 0 0 7 21H17A3 3 0 0 0 20 18V12.6A1.2 1.2 0 0 0 17.6 12.6V17.6'
  + 'A1 1 0 0 1 16.6 18.6H7.4A1 1 0 0 1 6.4 17.6V12.6A1.2 1.2 0 0 0 4 12.6Z';
const ARROW = 'M12 15.6V3.2M8.4 6.6L12 3L15.6 6.6';

export default function render() {
  return [
    ['path', { d: 'M4 13.2V18.6A3 3 0 0 0 7 21.6H17A3 3 0 0 0 20 18.6V13.2V18A3 3 0 0 1 17 21H7A3 3 0 0 1 4 18Z', fill: SH1, 'fill-opacity': '0.2', class: 'wm-shadow' }],
    ['path', { d: TRAY, fill: C1, stroke: EDGE1, 'stroke-width': '0.6', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M4.1 17.6V18A3 3 0 0 0 7 20.9H17A3 3 0 0 0 19.9 18V17.6A3 3 0 0 1 17 19.9H7A3 3 0 0 1 4.1 17.6Z', fill: SH1, 'fill-opacity': '0.34', class: 'wm-k' }],
    ['path', { d: 'M5.2 13.4V16.4', fill: 'none', stroke: SHINE, 'stroke-opacity': '0.65', 'stroke-width': '0.8', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: ARROW, fill: 'none', stroke: EDGE2, 'stroke-width': '3.2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: ARROW, fill: 'none', stroke: C2, 'stroke-width': '2.2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M12.5 14.8V8.4', fill: 'none', stroke: SH2, 'stroke-opacity': '0.3', 'stroke-width': '0.7', 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M11.6 4.6V6.2', fill: 'none', stroke: SHINE, 'stroke-opacity': '0.6', 'stroke-width': '0.6', 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
