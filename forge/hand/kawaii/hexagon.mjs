// Kawaii hexagon: one soft rounded hexagon with a big face, cheeks and a highlight.
const HEX = 'M13.08 2.88L19.6 6.6A2.2 2.2 0 0 1 20.7 8.5L20.7 15.5A2.2 2.2 0 0 1 19.6 17.4L13.08 21.12A2.2 2.2 0 0 1 10.92 21.12L4.4 17.4A2.2 2.2 0 0 1 3.3 15.5L3.3 8.5A2.2 2.2 0 0 1 4.4 6.6L10.92 2.88A2.2 2.2 0 0 1 13.08 2.88Z';
export default function render() {
  return [
    ['path', { d: HEX, fill: 'var(--with-kawaii-fill-6, #A98BFF)', 'fill-opacity': '0.6', stroke: 'none' }],
    ['path', { d: 'M7.1 14.1a1.2 .75 0 1 0 2.4 0a1.2 .75 0 1 0 -2.4 0ZM14.5 14.1a1.2 .75 0 1 0 2.4 0a1.2 .75 0 1 0 -2.4 0Z', fill: 'var(--with-kawaii-blush, #FF6F9C)', 'fill-opacity': '0.6', stroke: 'none' }],
    ['path', { d: 'M9.6 5.4L6.1 7.4', stroke: 'var(--with-kawaii-shine, #FFFFFF)', 'stroke-width': '1.3', 'stroke-opacity': '0.9', class: 'wm-shine' }],
    ['path', { d: HEX, class: 'wm-k' }],
    ['path', { d: 'M8.4 12a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0 -2.2 0ZM13.4 12a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0 -2.2 0Z', fill: 'var(--with-kawaii-face, currentColor)', stroke: 'none' }],
    ['path', { d: 'M10.9 14.1Q12 15.2 13.1 14.1', stroke: 'var(--with-kawaii-face, currentColor)', 'stroke-width': '1' }],
    ['path', { d: 'M8.9 11.6a.35 .35 0 1 0 .7 0a.35 .35 0 1 0 -.7 0ZM13.9 11.6a.35 .35 0 1 0 .7 0a.35 .35 0 1 0 -.7 0Z', fill: 'var(--with-kawaii-shine, #FFFFFF)', stroke: 'none', class: 'wm-shine' }],
  ];
}
