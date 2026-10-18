// anime door-open: frame, dark interior, leaf hinged at the left jamb swinging toward the viewer, far edge on the right.
const INK = 'var(--with-anime-ink, #2B2148)';
const ink = { stroke: INK, 'stroke-width': '1.1', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };

export default function render() {
  return [
    // frame
    ['path', { d: 'M3 21V5.2A2.2 2.2 0 0 1 5.2 3H18.8A2.2 2.2 0 0 1 21 5.2V21Z', fill: 'var(--with-anime-tint, #FFF5EC)', ...ink, class: 'wm-k' }],
    // opening (dark room)
    ['path', { d: 'M5.4 21V6.2A.8.8 0 0 1 6.2 5.4H17.8A.8.8 0 0 1 18.6 6.2V21Z', fill: 'var(--with-anime-shadow, #4B2C8F)', 'fill-opacity': '.45', ...ink, class: 'wm-k' }],
    // leaf: tall near (hinge) edge on the left, shorter far edge on the right
    ['path', { d: 'M6.8 5.6L14.6 7.4V18.6L6.8 20.3Z', fill: 'var(--with-anime-c1, #4BA8F5)', ...ink, class: 'wm-a' }],
    ['path', { d: 'M6.8 5.6L8.4 6V19.95L6.8 20.3Z', fill: 'var(--with-anime-shadow, #4B2C8F)', 'fill-opacity': '.3', class: 'wm-a' }],
    ['path', { d: 'M9.4 7.4L12 8V10.4L9.4 10.1Z', fill: 'var(--with-anime-shine, #FFFFFF)', 'fill-opacity': '.7', class: 'wm-shine' }],
    // handle near the far edge
    ['path', { d: 'M12.9 11.8V14.2M12.9 13H11.6', fill: 'none', stroke: 'var(--with-anime-c3, #FFC740)', 'stroke-width': '1.4', 'stroke-linecap': 'round', class: 'wm-a' }],
    // floor
    ['path', { d: 'M1.5 21.2H22.5', fill: 'none', ...ink, 'stroke-width': '1.4', class: 'wm-k' }],
  ];
}
