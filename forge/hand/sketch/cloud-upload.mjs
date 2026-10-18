// forge/hand/sketch/cloud-upload.mjs — open cloud with a long, doubled arrow and wide chevron head so it reads as upload,
// not a tree; hachure kept to the right lobe, clear of the arrow.
export default function render() {
  return [
    ['path', { d: 'M17 12.7l2-1.5M16.9 10.5l1.6-1.2', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M5.4 15.5Q2.1 14.2 2.3 10.7Q2.7 7 6.6 6.4M6.1 7Q7.5 2.2 12.3 2.2Q17.3 2.3 18.4 7.5M17.9 6.9Q21.7 7.8 21.6 11.5Q21.5 14.4 19.6 15.4', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M5 15.1Q2.4 13.6 2.6 11Q2.9 7.4 6.3 6.8Q7.6 2.6 12.1 2.5Q16.9 2.6 18.1 7.2Q21.4 8 21.35 11.4Q21.2 14.2 19.2 15.1', class: 'wm-k' }],
    ['path', { d: 'M8.3 13.9Q10.2 12 12.15 10.1Q14 12 15.9 13.95', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-s' }],
    ['path', { d: 'M12 21.6Q11.85 15.5 12 9.6M12.55 21Q12.5 15.5 12.6 10.4M7.9 13.6Q10 11.4 12.1 9.4Q14.2 11.4 16.2 13.6', class: 'wm-s' }],
  ]
}
