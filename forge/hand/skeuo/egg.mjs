// skeuo / egg: warm tan shell with a firm dark rim, deep side shading, glossy cap highlight, clear speckles.
const SH = 'var(--with-skeuo-shadow, #15110D)';
const SHINE = 'var(--with-skeuo-shine, #FFFFFF)';
const INK = 'var(--with-skeuo-ink, #7A4A1E)';
const SHELL = 'M12 2C8.2 2 5 8.6 5 13.6C5 18.2 8 21.6 12 21.6C16 21.6 19 18.2 19 13.6C19 8.6 15.8 2 12 2Z';
export default function render() {
  return [
    ['ellipse', { cx: '12.6', cy: '21.9', rx: '6.4', ry: '1.3', fill: SH, 'fill-opacity': '0.24', class: 'wm-shadow' }],
    ['path', { d: SHELL, fill: 'var(--with-skeuo-c1, #EDC28A)', class: 'wm-k' }],
    ['path', { d: 'M5.4 11.2C5.1 12.1 5 12.9 5 13.6C5 18.2 8 21.6 12 21.6C16 21.6 19 18.2 19 13.6C19 12.4 18.8 11.2 18.5 10C17.8 15.6 15.2 19 11.6 19C8.6 19 6.4 15.9 5.4 11.2Z', fill: 'var(--with-skeuo-c2, #C98A4B)', 'fill-opacity': '0.85' }],
    ['path', { d: 'M18.2 10.6C18.6 11.8 18.8 12.8 18.8 13.6C18.8 18 15.9 21.2 12 21.2C10.4 21.2 9 20.7 7.9 19.8C12.8 20.6 17.6 17.4 18.2 10.6Z', fill: SH, 'fill-opacity': '0.28' }],
    ['path', { d: SHELL, stroke: 'var(--with-skeuo-edge, #5A3414)', 'stroke-width': '1.15', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M12 3C9.7 3 7.6 6.2 6.6 10C9.6 9.2 13.5 8.9 17.4 9.1C16.3 5.7 14.3 3 12 3Z', fill: SHINE, 'fill-opacity': '0.5', class: 'wm-shine' }],
    ['path', { d: 'M9.5 5.2C8.8 6.3 8.2 7.8 7.9 9.3', stroke: SHINE, 'stroke-width': '1.5', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['circle', { cx: '10.9', cy: '4', r: '0.7', fill: SHINE, class: 'wm-shine' }],
    ['circle', { cx: '14.6', cy: '13', r: '0.6', fill: INK, 'fill-opacity': '0.75', class: 'wm-deco' }],
    ['circle', { cx: '9.6', cy: '14.6', r: '0.5', fill: INK, 'fill-opacity': '0.7', class: 'wm-deco' }],
    ['circle', { cx: '12.4', cy: '17.4', r: '0.55', fill: INK, 'fill-opacity': '0.7', class: 'wm-deco' }],
    ['circle', { cx: '15.9', cy: '16.6', r: '0.4', fill: INK, 'fill-opacity': '0.65', class: 'wm-deco' }],
  ];
}
