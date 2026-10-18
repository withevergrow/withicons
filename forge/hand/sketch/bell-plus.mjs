// forge/hand/sketch/bell-plus.mjs — a smooth, heavier pencil bell with a flared lip and clapper, and a bold plus badge
// standing clear at the top right, replacing a thin lumpy bell outline that went faint at 16px.
export default function render() {
  return [
    ['path', { d: 'M12.6 16.6l3-2.3M10.1 16.7l5.2-4', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M5.8 16.8Q5.75 14.4 5.8 12.3Q6.05 6.9 11.3 6.8Q16.6 6.95 16.8 12.3Q16.85 14.5 16.85 16.8Q17.6 17.8 18.3 18.8Q11.2 18.95 4.3 18.85Q5.05 17.8 5.8 16.8Z', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M5.5 16.5Q5.45 14.2 5.5 12Q5.75 6.55 11 6.5Q16.3 6.6 16.5 12Q16.55 14.25 16.5 16.5Q17.25 17.5 18 18.5Q11 18.6 4 18.5Q4.75 17.5 5.5 16.5Z', 'stroke-width': 1.5, class: 'wm-k' }],
    ['path', { d: 'M8.8 18.9Q9.3 21.25 11.25 21.3Q13.3 21.2 13.8 18.9', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M8.5 18.5Q9 21 11 21Q13 21 13.5 18.5', 'stroke-width': 1.5, class: 'wm-a' }],
    ['path', { d: 'M19.3 2.8Q19.2 5.2 19.3 7.8M16.8 5.3Q19.2 5.2 21.8 5.35', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-s' }],
    ['path', { d: 'M19 2.5Q18.95 5 19.05 7.5M16.5 5Q19 4.95 21.5 5.05', 'stroke-width': 1.6, class: 'wm-s' }],
  ]
}
