// forge/hand/sketch/film.mjs: a wide horizontal film strip with sprocket holes along the top and bottom and one wide frame window.
const F = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 };
const HT = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 };
export default function render() {
  return [
    ['path', { d: 'M4.4 4.3Q12 4 19.6 4.3Q22 4.4 22 6.6V17.5Q22 19.7 19.5 19.8Q12 20.1 4.5 19.8Q2.1 19.7 2.1 17.4V6.4Q2.1 4.4 4.4 4.3', ...F, class: 'wm-k' }],
    ['path', { d: 'M15.4 15.2L18.4 11.6M17.8 15.3L20 12.8', ...HT, class: 'wm-k' }],
    ['path', { d: 'M4.2 4Q12 3.9 19.8 4Q22 4.1 21.9 6.3V17.7Q21.9 19.9 19.7 20Q12 20 4.3 20Q2.1 19.9 2.1 17.7V6.3Q2.1 4.1 4.2 4', class: 'wm-k' }],
    ['path', { d: 'M2.2 8.1Q12 7.9 21.8 8M2.1 16Q12 16.2 21.9 15.9', class: 'wm-a' }],
    ['path', { d: 'M5 6h.1M8.7 6h.1M12.3 6h.1M15.9 6h.1M19 6h.1M5 18h.1M8.7 18h.1M12.3 18h.1M15.9 18h.1M19 18h.1', 'stroke-width': 1.7, class: 'wm-s' }],
  ];
}
