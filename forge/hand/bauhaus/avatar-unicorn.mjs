// Bauhaus avatar-unicorn: 3/4 head in red, blue flowing mane, yellow spiral horn, ear, lashed eye, nostril.
const SH = 'var(--with-bauhaus-shadow, #151515)';
export default function render() {
  return [
    ['path', { d: 'M14.5 5.6C18.5 5 20.9 7.75 20.35 10.75C20 12.75 21.6 14 21.8 16.25C22 18.5 20.8 20.5 19.8 22H15.6Z', fill: 'var(--with-bauhaus-c3, #2A6BC2)', class: 'wm-a' }],
    ['path', { d: 'M12.6 6.9L14.4 2.4L16.2 7.4Z', fill: 'var(--with-bauhaus-c1, #E0412E)', class: 'wm-k' }],
    ['path', { d: 'M10.5 22C10.5 19.25 9.75 17.75 8.5 16.75C7 17 5.25 16.75 4.25 16C3.25 15.25 3.25 13.75 4 12.75L7.75 8.25C9.25 6.75 11.25 6 13.25 6.25C15.75 6.75 17 8.75 17 11.5C17 15 16 18.5 16.5 22Z', fill: 'var(--with-bauhaus-c1, #E0412E)', class: 'wm-k' }],
    ['path', { d: 'M14.3 4.3L15.1 6.9H13.5Z', fill: 'var(--with-bauhaus-tint, #F3EBDD)', class: 'wm-k' }],
    ['path', { d: 'M8.1 7.7L4.6 1.4L10.9 6.3Z', fill: 'var(--with-bauhaus-c2, #F2B33D)', class: 'wm-s' }],
    ['line', { x1: 6.35, y1: 4.65, x2: 8.45, y2: 3.95, stroke: SH, 'stroke-width': 0.7, fill: 'none' }],
    ['line', { x1: 7.25, y1: 6.25, x2: 9.85, y2: 5.4, stroke: SH, 'stroke-width': 0.7, fill: 'none' }],
    ['path', { d: 'M10.6 6.6C12.3 5.5 14.7 5.4 16 6.5C14.4 6.8 13.1 7.6 12.4 9C12.1 7.9 11.5 7.1 10.6 6.6Z', fill: 'var(--with-bauhaus-c3, #2A6BC2)', class: 'wm-a' }],
    ['circle', { cx: 10.6, cy: 11, r: 1, fill: SH }],
    ['line', { x1: 11.4, y1: 10.2, x2: 12.3, y2: 9.6, stroke: SH, 'stroke-width': 0.7, 'stroke-linecap': 'round', fill: 'none' }],
    ['line', { x1: 10.9, y1: 9.8, x2: 11.4, y2: 9.1, stroke: SH, 'stroke-width': 0.7, 'stroke-linecap': 'round', fill: 'none' }],
    ['circle', { cx: 5.6, cy: 14.1, r: 0.6, fill: SH }],
  ];
}
