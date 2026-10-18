// forge/hand/sketch/maximize-2.mjs — two outward diagonal pencil arrows, each a clean shaft stopping short of a crisp
// one-stroke corner head, replacing overlapping head strokes that left tick blobs at both tips.
export default function render() {
  return [
    ['path', { d: 'M9.65 10.2Q6.95 7.4 4.6 5.05M14.35 13.8Q17.05 16.6 19.4 18.95', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M10 10Q7.2 7.15 4.4 4.4M14 14Q16.8 16.85 19.6 19.6', class: 'wm-k' }],
    ['path', { d: 'M9.5 3.55Q6.5 3.45 3.5 3.5Q3.45 6.5 3.55 9.5M14.5 20.45Q17.5 20.55 20.5 20.5Q20.55 17.5 20.45 14.5', class: 'wm-a' }],
  ]
}
