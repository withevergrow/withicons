// forge/hand/sketch/minimize-2.mjs — two inward diagonal pencil arrows whose shafts end in crisp one-stroke corner
// heads near the centre, replacing overlapping strokes that left blobs at the arrow tails and muddied the heads.
export default function render() {
  return [
    ['path', { d: 'M3.25 3.6Q6 6.35 9 9.4M20.7 20.45Q17.9 17.75 14.9 14.6', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M3.5 3.5Q6.4 6.4 9.25 9.25M20.5 20.5Q17.6 17.6 14.75 14.75', class: 'wm-k' }],
    ['path', { d: 'M9.95 4Q10.05 7 10 10Q7 10.05 4 9.95M20 14.05Q17 13.95 14 14Q13.95 17 14.05 20', class: 'wm-a' }],
  ]
}
