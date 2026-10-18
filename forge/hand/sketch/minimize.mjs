// forge/hand/sketch/minimize.mjs — two inward arrows, each shaft stopping short of its own crisp L-shaped head drawn
// in one continuous stroke, replacing overlapping strokes that left a stray blob at the arrow tail.
export default function render() {
  return [
    ['path', { d: 'M20.75 3.6Q18 6.35 15 9.4M3.3 20.45Q6.1 17.75 9.1 14.6', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M20.5 3.5Q17.6 6.4 14.75 9.25M3.5 20.5Q6.4 17.6 9.25 14.75', class: 'wm-k' }],
    ['path', { d: 'M14.05 4Q13.95 7 14 10Q17 10.05 20 9.95M4 14.05Q7 13.95 10 14Q10.05 17 9.95 20', class: 'wm-a' }],
  ]
}
