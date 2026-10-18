// forge/hand/sketch/layout-list.mjs — two firm pencil tiles with light hachure and two straight text lines each,
// replacing wobbly strokes whose lines bent and drifted so the two-row list blurred at 16px.
export default function render() {
  return [
    ['path', { d: 'M5.2 8.3l2.3-2.3m-2.6 13.4l2.3-2.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M4.4 3.9Q6 3.75 7.65 3.85Q8.7 3.9 8.75 5Q8.85 6.5 8.75 8.05Q8.7 9.15 7.6 9.2Q6 9.3 4.4 9.2Q3.3 9.15 3.25 8.05Q3.2 6.5 3.3 5Q3.35 3.95 4.4 3.9M4.4 14.85Q6 14.75 7.65 14.8Q8.7 14.85 8.75 15.95Q8.85 17.5 8.75 19.05Q8.7 20.15 7.6 20.2Q6 20.3 4.4 20.2Q3.3 20.15 3.25 19.05Q3.2 17.5 3.3 15.95Q3.35 14.9 4.4 14.85', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M4.5 3.5Q6 3.45 7.5 3.5Q9 3.55 9 5Q9.05 6.5 9 8Q8.95 9.5 7.5 9.5Q6 9.55 4.5 9.5Q3 9.45 3 8Q2.95 6.5 3 5Q3.05 3.5 4.5 3.5ZM4.5 14.5Q6 14.45 7.5 14.5Q9 14.55 9 16Q9.05 17.5 9 19Q8.95 20.5 7.5 20.5Q6 20.55 4.5 20.5Q3 20.45 3 19Q2.95 17.5 3 16Q3.05 14.5 4.5 14.5Z', class: 'wm-k' }],
    ['path', { d: 'M13 4.5Q17 4.4 21 4.55M13 8.5Q15.25 8.45 17.5 8.5M13 15.5Q17 15.45 21 15.5M13 19.5Q15.25 19.55 17.5 19.45', class: 'wm-a' }],
  ]
}
