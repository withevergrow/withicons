// forge/hand/sketch/repeat.mjs — two rounded pencil runs each ending in one clean chevron stroke, replacing crossed
// arrowhead arms with tick blobs that broke the loop into scribbles at 16px.
export default function render() {
  return [
    ['path', { d: 'M4.45 10.6Q4.6 6.9 7.9 6.85Q12.5 6.7 17.6 6.85M19.55 13.4Q19.4 17.1 16.1 17.15Q11.5 17.3 6.4 17.15', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M4.1 11.4V10Q4.1 6.5 7.5 6.5Q13.5 6.35 19.6 6.5M19.9 12.6V14Q19.9 17.5 16.5 17.5Q10.5 17.65 4.4 17.5', class: 'wm-k' }],
    ['path', { d: 'M16.6 3.1Q18.25 4.75 19.95 6.5Q18.3 8.2 16.6 9.9M7.4 14.1Q5.75 15.75 4.05 17.5Q5.7 19.2 7.4 20.9', class: 'wm-a' }],
  ]
}
