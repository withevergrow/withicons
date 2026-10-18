// sticker/cast: die-cut backing, sky screen, clean cast waves in the bottom-left corner.
const INK = 'var(--with-sticker-ink, #1D1530)';
const BACK = 'M4.2 2.8H19.3A2.4 2.4 0 0 1 21.7 5.2V17.4A2.4 2.4 0 0 1 19.3 19.8H4.2A2.4 2.4 0 0 1 1.8 17.4V5.2A2.4 2.4 0 0 1 4.2 2.8Z';
const SHADOW = 'M4.8 3.6H19.9A2.4 2.4 0 0 1 22.3 6V18.2A2.4 2.4 0 0 1 19.9 20.6H4.8A2.4 2.4 0 0 1 2.4 18.2V6A2.4 2.4 0 0 1 4.8 3.6Z';
const SCREEN = 'M5.03 4.93H18.47A1.68 1.68 0 0 1 20.15 6.61V16.69A1.68 1.68 0 0 1 18.47 18.37H5.03A1.68 1.68 0 0 1 3.35 16.69V6.61A1.68 1.68 0 0 1 5.03 4.93Z';

export default function render() {
  return [
    ['path', { d: SHADOW, fill: 'var(--with-sticker-shadow, #1D1530)', 'fill-opacity': '0.22', class: 'wm-shadow' }],
    ['path', { d: BACK, fill: 'var(--with-sticker-edge, #FFFFFF)', stroke: 'currentColor', 'stroke-opacity': '0.3', 'stroke-width': '0.32' }],
    ['path', { d: SCREEN, fill: 'var(--with-sticker-sky, #5BC6FF)', class: 'wm-k' }],
    ['path', { d: 'M3.35 10.4V6.61A1.68 1.68 0 0 1 5.03 4.93H18.47A1.68 1.68 0 0 1 20.15 6.61V16.69A1.68 1.68 0 0 1 18.47 18.37H13', stroke: INK, 'stroke-width': '1.5', class: 'wm-k' }],
    ['path', { d: 'M3.35 13.6A4.77 4.77 0 0 1 8.12 18.37M3.35 10.4A7.97 7.97 0 0 1 11.32 18.37', stroke: INK, 'stroke-width': '1.5', class: 'wm-a' }],
    ['circle', { cx: '3.95', cy: '17.77', r: '1.05', fill: 'var(--with-sticker-lemon, #FFD43B)', stroke: INK, 'stroke-width': '1.2', class: 'wm-a' }],
    ['path', { d: 'M7.34 6.57L5.45 6.57L5.2 6.64L5.02 6.77M5 8.27h.01', stroke: 'var(--with-sticker-shine, #FFFFFF)', 'stroke-width': '1', 'stroke-opacity': '0.92', class: 'wm-shine' }],
    ['path', { d: 'M21.95 0.74Q22.22 1.84 23.32 2.11Q22.22 2.38 21.95 3.48Q21.68 2.38 20.58 2.11Q21.68 1.84 21.95 0.74Z', fill: 'var(--with-sticker-bubblegum, #FF6FB5)', class: 'wm-deco' }],
    ['path', { d: 'M1.47 21.27Q1.69 22.05 2.47 22.27Q1.69 22.49 1.47 23.27Q1.25 22.49 0.47 22.27Q1.25 22.05 1.47 21.27Z', fill: 'var(--with-sticker-bubblegum, #FF6FB5)', class: 'wm-deco' }],
  ];
}
