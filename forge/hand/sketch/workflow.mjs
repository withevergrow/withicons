// forge/hand/sketch/workflow.mjs — two firm pencil node boxes with light hatching joined by one clean elbow
// connector, replacing lumpy boxes whose doubled connector blurred at 16px.
export default function render() {
  return [
    ['path', { d: 'M6.6 8.9l2.3-1.9M17.4 20l2.6-2.1', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M4.9 3.35Q6.6 3.25 8.3 3.35M15.9 14.35Q17.6 14.25 19.3 14.35', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M5 3Q6.5 2.95 8 3Q10 3.05 10 5Q10.05 6.5 10 8Q10 10 8 10Q6.5 10.05 5 10Q3 10 3 8Q2.95 6.5 3 5Q3 3 5 3ZM16 14Q17.5 13.95 19 14Q21 14.05 21 16Q21.05 17.5 21 19Q21 21 19 21Q17.5 21.05 16 21Q14 21 14 19Q13.95 17.5 14 16Q14 14 16 14Z', class: 'wm-k' }],
    ['path', { d: 'M6.5 10Q6.45 12.75 6.5 15.5Q6.5 17.5 8.5 17.5Q11.25 17.55 14 17.5', class: 'wm-a' }],
  ]
}
