// Hand-drawn blueprint glasses: rounded lenses, keyhole bridge, temples, dimension lines.
const A = 'var(--with-accent, currentColor)';
const deco = (d, o = 0.5) => ['path', { d, color: A, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': o, class: 'wm-deco' }];
export default function render() {
  return [
    deco('M2.5 19.5H21.5M2.5 18.3V20.7M21.5 18.3V20.7M9.5 18.3V20.7M14.5 18.3V20.7'),
    deco('M6 9V10M6 17.5V18.3M18 9V10M18 17.5V18.3M1 13.5H2M22 13.5H23', 0.5),
    deco('M12 7.5V9.3M12 12.2V15', 0.4),
    ['path', { d: 'M4.25 10.25H7.75A1.75 1.75 0 0 1 9.5 12V13.5A3.5 3.5 0 0 1 2.5 13.5V12A1.75 1.75 0 0 1 4.25 10.25ZM16.25 10.25H19.75A1.75 1.75 0 0 1 21.5 12V13.5A3.5 3.5 0 0 1 14.5 13.5V12A1.75 1.75 0 0 1 16.25 10.25Z', class: 'wm-k' }],
    ['path', { d: 'M9.5 12.25C10.5 10.9 13.5 10.9 14.5 12.25M2.75 11L1.75 6.75M21.25 11L22.25 6.75', class: 'wm-k' }],
    ['path', { d: 'M4.5 12.5L6 11.5M16.5 12.5L18 11.5', stroke: 'currentColor', 'stroke-width': 0.6, 'stroke-opacity': 0.6, class: 'wm-s' }],
  ];
}
