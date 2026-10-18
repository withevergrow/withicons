// forge/hand/sketch/upload.mjs: an open U-shaped tray with an arrow rising out of it; light hatching inside the tray.
const F = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 };
const HT = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 };
export default function render() {
  return [
    ['path', { d: 'M3.9 14.4Q3.7 17 3.9 18.5Q4.1 20.3 6 20.5Q12.2 20.8 18.1 20.5Q20 20.4 20.2 18.4Q20.4 16.8 20.2 14.2', ...F, class: 'wm-k' }],
    ['path', { d: 'M7.4 18.4L9 17.1M10.4 18.8L13.2 16.5M14.6 18.6L16.6 17', ...HT, class: 'wm-k' }],
    ['path', { d: 'M3.6 14.2Q3.4 17 3.6 18.4Q3.8 20.3 5.8 20.4Q12 20.7 18.3 20.4Q20.2 20.3 20.4 18.3Q20.6 16.8 20.5 14.3', class: 'wm-k' }],
    ['path', { d: 'M12.1 15.8Q12.3 10 12 4.4', ...F, class: 'wm-a' }],
    ['path', { d: 'M12 15.6Q12.2 10 11.9 4.3M6.9 9.4Q9.5 6.9 12 4.1Q14.6 6.7 17.2 9.3', class: 'wm-a' }],
  ];
}
