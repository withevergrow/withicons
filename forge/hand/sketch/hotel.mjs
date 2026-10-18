// forge/hand/sketch/hotel.mjs: a tall pencil building on a ground line with a sign bar, a grid of four windows and an arched entrance; light hatching beside the door.
const F = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 };
const HT = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 };
export default function render() {
  return [
    ['path', { d: 'M4.3 21.4L4.2 4.8Q4.2 3.2 5.8 3.2L18.2 3.1Q19.8 3.1 19.8 4.7L19.9 21.4', ...F, class: 'wm-k' }],
    ['path', { d: 'M15.4 20.6L17.2 18.6M16.4 21.2L18.4 19', ...HT, class: 'wm-k' }],
    ['path', { d: 'M4 21.4L3.9 4.4Q4 2.8 5.6 2.9L18 2.8Q19.6 2.8 19.6 4.4L19.7 21.4M1.8 21.5L22.2 21.4', class: 'wm-k' }],
    ['path', { d: 'M8.6 6.2Q12 5.9 15.4 6.3', 'stroke-width': 1.8, class: 'wm-s' }],
    ['path', { d: 'M7.3 9.7L10 9.6L10.1 12.2L7.4 12.3ZM14 9.6L16.7 9.7L16.6 12.3L13.9 12.2Z', class: 'wm-a' }],
    ['path', { d: 'M7.3 13.9L10 13.8L10.1 16.2L7.4 16.3ZM14 13.8L16.7 13.9L16.6 16.3L13.9 16.2Z', class: 'wm-a' }],
    ['path', { d: 'M10.2 21.2L10.1 19Q10.1 17.6 12 17.6Q13.9 17.6 13.9 19L13.8 21.2', class: 'wm-a' }],
  ];
}
