// forge/hand/sketch/circle-arrow-right.mjs — a round, centred pencil ring with a small closing overshoot and a clean
// one-stroke arrowhead, hatching moved to a light corner below the arrow instead of scribbled behind it.
export default function render() {
  return [
    ['path', { d: 'M13.4 17.95l2.4-1.85M14.4 18.9l2.9-2.25M15.6 19.55l2.4-1.85', 'stroke-width': 0.7, 'stroke-opacity': 0.4 }],
    ['path', { d: 'M11.6 2.55C16.9 2.5 21.5 6.75 21.45 12.1C21.4 17.3 17.2 21.5 11.9 21.45C6.7 21.4 2.5 17.2 2.55 11.9C2.6 6.8 6.6 2.75 11.4 2.6Q13.1 2.55 14.2 2.95', class: 'wm-k' }],
    ['path', { d: 'M7.9 12.3Q12 12.2 15.7 12.25M11.6 7.95Q13.7 10.05 15.65 12.1Q13.75 14 11.6 16.05', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M7.6 12.05Q11.8 11.9 16 12M11.9 7.7Q13.9 9.85 16.1 12Q14 14.15 11.85 16.3', class: 'wm-a' }],
  ]
}
