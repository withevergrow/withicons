// skeuo / mandarin-orange: squat glossy citrus with a top dimple, stem, a big leaf and pitted rind.
const SH = 'var(--with-skeuo-shadow, #15110D)';
const SHINE = 'var(--with-skeuo-shine, #FFFFFF)';
const EDGE = 'var(--with-skeuo-edge, #7A3A06)';
const INK = 'var(--with-skeuo-ink, #9A4508)';
export default function render() {
  return [
    ['path', { d: 'M12.7 8.5C7.7 7.3 3.7 10.5 3.7 15.3C3.7 19.9 7.7 22.7 12.7 22.7C17.7 22.7 21.7 19.9 21.7 15.3C21.7 10.5 17.7 7.3 12.7 8.5Z', fill: SH, 'fill-opacity': '0.16', class: 'wm-shadow' }],
    ['path', { d: 'M12 7.6C7 6.4 3 9.6 3 14.4C3 19 7 21.8 12 21.8C17 21.8 21 19 21 14.4C21 9.6 17 6.4 12 7.6Z', fill: 'var(--with-skeuo-c1, #F5871F)', stroke: EDGE, 'stroke-width': '0.6', 'stroke-opacity': '0.55', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M20.6 12.6C20.8 13.2 20.9 13.8 20.9 14.4C20.9 18.9 17 21.6 12 21.6C8.2 21.6 5 20 3.7 17.2C5.6 19.2 8.6 20.2 12 20.2C17 20.2 20.6 17.6 20.6 12.6Z', fill: SH, 'fill-opacity': '0.18', class: 'wm-k' }],
    ['path', { d: 'M12 8.4C10.6 8 9.2 8.1 8 8.5', fill: 'none', stroke: INK, 'stroke-width': '0.6', 'stroke-opacity': '0.5', 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M8.6 8.4C6 8.6 4 10.6 3.9 13.4C6.4 11.6 9.2 10.8 12.2 10.6C11.2 9.6 10 8.6 8.6 8.4Z', fill: SHINE, 'fill-opacity': '0.42', class: 'wm-shine' }],
    ['path', { d: 'M5.4 12.2C6 11.2 7 10.4 8.2 10', fill: 'none', stroke: SHINE, 'stroke-width': '1.1', 'stroke-opacity': '0.9', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['circle', { cx: '9', cy: '15', r: '0.42', fill: INK, 'fill-opacity': '0.45', class: 'wm-k' }],
    ['circle', { cx: '13', cy: '13.6', r: '0.42', fill: INK, 'fill-opacity': '0.45', class: 'wm-k' }],
    ['circle', { cx: '16.6', cy: '15.6', r: '0.42', fill: INK, 'fill-opacity': '0.45', class: 'wm-k' }],
    ['circle', { cx: '12.2', cy: '17.8', r: '0.42', fill: INK, 'fill-opacity': '0.45', class: 'wm-k' }],
    ['circle', { cx: '7', cy: '18', r: '0.36', fill: INK, 'fill-opacity': '0.4', class: 'wm-k' }],
    ['circle', { cx: '17.4', cy: '11.8', r: '0.36', fill: INK, 'fill-opacity': '0.4', class: 'wm-k' }],
    ['path', { d: 'M12 8.2C11.9 6.8 12.1 5.6 12.8 4.6', fill: 'none', stroke: 'var(--with-skeuo-c3, #6B4422)', 'stroke-width': '1.3', 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M13.2 6.4C15.8 7.6 18.6 7 20.2 5.4', fill: 'none', stroke: SH, 'stroke-width': '0.9', 'stroke-opacity': '0.18', 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M12.6 5C13.6 2.4 17.2 1.4 21 2.2C19.9 5.3 16.4 6.8 12.6 5Z', fill: 'var(--with-skeuo-c2, #4E9F3D)', stroke: 'var(--with-skeuo-edge, #24561A)', 'stroke-width': '0.5', 'stroke-opacity': '0.6', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M13 4.8C15.4 4.2 18 3.4 20.4 2.6', fill: 'none', stroke: SHINE, 'stroke-width': '0.45', 'stroke-opacity': '0.7', 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M13.8 3.6C15 2.6 16.8 2.2 18.6 2.2', fill: 'none', stroke: SHINE, 'stroke-width': '0.6', 'stroke-opacity': '0.5', 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
