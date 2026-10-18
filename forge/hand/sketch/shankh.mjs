// forge/hand/sketch/shankh.mjs — pencil conch lying on its side: a pointed spire at the left crossed by whorl ridges, a swelling
// body, and a wide open mouth with a curled lip and an inner fold on the right (so it cannot be mistaken for a fruit).
export default function render() {
  const f = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M10 17.9l1.4.5M6.9 14.8l1.3 1', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M2.3 5.4C6.6 6.5 10.8 4.5 16.1 5.5C20.8 5.7 22.3 9.2 21.7 13.2C21.1 17.4 17.9 19.2 15.1 18.6C9.6 17.5 4.6 11.6 2.3 5.4', ...f, class: 'wm-k' }],
    ['path', { d: 'M2 5C6.3 6.1 10.5 4.2 15.8 5.2C20.5 5.4 22 9 21.4 13C20.8 17.2 17.6 19 14.8 18.4C9.3 17.3 4.3 11.4 2 5Z', class: 'wm-k' }],
    ['path', { d: 'M5.2 6C4.7 7.1 4.9 8.2 5.8 9M8.2 5.8C7.3 7.6 7.4 9.9 9 11.6M11.2 5.3C10 8 10.2 11.6 12.6 14.2', 'stroke-width': 1, class: 'wm-a' }],
    ['path', { d: 'M18.4 7.2C20.3 8.6 20.3 13.4 17.8 16.3C16.8 14.2 17 9.6 18.4 7.2Z', 'stroke-width': 1.1, class: 'wm-a' }],
    ['path', { d: 'M13.6 8.2C15.4 7.9 16.4 8.2 17.2 8.8', 'stroke-width': 0.9, class: 'wm-s' }],
  ]
}
