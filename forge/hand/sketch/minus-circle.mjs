// forge/hand/sketch/minus-circle.mjs: a wobbly pencil circle with one clear horizontal minus stroke; hatching only as light shading below.
const F = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 };
const HT = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 };
export default function render() {
  return [
    ['path', { d: 'M11.6 2.9C16.9 2.7 21.2 7.1 21.1 12.4C21 17.4 16.8 21.2 11.7 21.1C6.6 21 2.8 17 2.9 11.9C3 7.1 6.6 3.2 12.4 2.8', ...F, class: 'wm-k' }],
    ['path', { d: 'M7.8 16.6L10.2 14.8M9.6 18.4L13.6 15.4M13.6 18.9L16.6 16.6', ...HT, class: 'wm-k' }],
    ['path', { d: 'M12.2 2.6C17.3 2.4 21.6 6.7 21.4 12.1C21.3 17.2 17.1 21.5 11.9 21.4C6.8 21.3 2.5 17.2 2.6 11.8C2.7 6.9 6.5 2.9 11.4 2.7L13 2.5', class: 'wm-k' }],
    ['path', { d: 'M7.5 12.2Q12 11.6 16.5 12.1', 'stroke-width': 1.7, class: 'wm-a' }],
  ];
}
