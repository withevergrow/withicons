// forge/hand/sketch/scan-search.mjs — wobbly pencil corner brackets with overshooting tails, a hatched lens and a
// heavier handle, so it sits with the hand-drawn siblings instead of reading machine-clean.
export default function render() {
  return [
    ['path', { d: 'M8.6 9.4L10.4 7.6M8 12.1L12.2 7.9M9.1 13.4L12.9 9.6', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: 'M2.9 8Q3.15 6.2 2.95 4.9Q3.3 2.85 5.3 3.1Q6.5 2.85 7.9 3.15M16.2 2.9Q17.9 3.15 19.05 2.95Q21.15 3.3 20.85 5.25Q21.15 6.6 20.9 7.85M21.1 16.1Q20.85 17.9 21.05 19.1Q20.7 21.1 18.7 20.85Q17.5 21.15 16.1 20.9M7.9 21.1Q6.1 20.85 4.95 21.05Q2.9 20.75 3.15 18.75Q2.85 17.4 3.1 16.1', 'stroke-width': 1.4, class: 'wm-k' }],
    ['path', { d: 'M14.85 10.8Q15 14.9 10.85 14.85Q7.05 14.6 7.2 10.85Q7.4 7.1 11.1 7.2Q14.65 7.35 14.9 11.3M13.6 13.9Q15.4 15.3 17.05 17.1', 'stroke-width': 1.6, class: 'wm-a' }],
  ]
}
