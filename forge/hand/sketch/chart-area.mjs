// forge/hand/sketch/chart-area.mjs: an L-shaped axis and a closed filled area with a two-peak zigzag top; hatching inside the area.
const F = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 };
const HT = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 };
export default function render() {
  return [
    ['path', { d: 'M3.8 3.5Q3.7 10 3.9 18.5Q4 20.3 5.9 20.5Q13 20.8 20.7 20.5', ...F, class: 'wm-a' }],
    ['path', { d: 'M7.7 16.8L7.8 12.2L11.7 8.2L15.2 11.7L20.7 6.2L20.8 16.6Z', ...F, class: 'wm-k' }],
    ['path', { d: 'M9.6 16L12.2 13.3M13.3 16L15.8 13.5M16.9 15.9L19.2 13.6', ...HT, class: 'wm-k' }],
    ['path', { d: 'M3.5 3.3Q3.4 10 3.6 18.5Q3.7 20.3 5.7 20.4Q13 20.6 20.6 20.4', class: 'wm-a' }],
    ['path', { d: 'M7.5 16.6L7.5 12L11.5 8L15 11.5L20.5 6L20.5 16.5Q14 16.7 7.5 16.6', class: 'wm-k' }],
  ];
}
