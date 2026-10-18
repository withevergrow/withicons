// forge/hand/sketch/message-circle-more.mjs — the clean loose bubble with its tail tip at the lower left (same as
// message-circle), three bold solid dots, and only two short hatches low on the right, well clear of the dots.
export default function render() {
  const pencil = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M13.6 17L16.6 14.8M15.8 17.9L18 16.2', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M9.6 19.7Q6.6 21 3.8 21.2Q4.7 19 5.1 16.9C4 15.2 3.4 13.2 3.4 11.2C3.4 6.4 7.2 2.6 12.1 2.5C17 2.5 21.3 6.2 21.3 11.1C21.2 15.9 17.2 20.3 12.3 20.4Q11 20.4 9.6 19.7', ...pencil, class: 'wm-k' }],
    ['path', { d: 'M9.2 19.4Q6 20.7 3.3 20.8Q4.1 18.6 4.7 16.5C3.6 14.8 3 13 3 11C3 6 7 2.1 12 2.1C17 2.1 21 6 21 11C21 16 17 20 12 20Q10.6 20 9.2 19.4', class: 'wm-k' }],
    ['path', { d: 'M7.8 11.3h.01M12 11.3h.01M16.2 11.3h.01', 'stroke-width': 2.5, class: 'wm-a' }],
  ]
}
