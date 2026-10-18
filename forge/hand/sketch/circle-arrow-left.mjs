// forge/hand/sketch/circle-arrow-left.mjs — a round, centred pencil ring with a small closing overshoot and a clean
// one-stroke arrowhead, hatching moved to a light corner below the arrow instead of scribbled behind it.
export default function render() {
  return [
    ['path', { d: 'M13.4 17.7l3.2-2.5M14.2 18.75l3.2-2.5M15.4 19.5l2.6-2', 'stroke-width': 0.7, 'stroke-opacity': 0.4 }],
    ['path', { d: 'M11.6 2.55C16.9 2.5 21.5 6.75 21.45 12.1C21.4 17.3 17.2 21.5 11.9 21.45C6.7 21.4 2.5 17.2 2.55 11.9C2.6 6.8 6.6 2.75 11.4 2.6Q13.1 2.55 14.2 2.95', class: 'wm-k' }],
    ['path', { d: 'M16.1 12.3Q12 12.2 8.3 12.25M12.4 7.95Q10.3 10.05 8.35 12.1Q10.25 14 12.4 16.05', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M16.4 12.05Q12.2 11.9 8 12M12.1 7.7Q10.1 9.85 7.9 12Q10 14.15 12.15 16.3', class: 'wm-a' }],
  ]
}
