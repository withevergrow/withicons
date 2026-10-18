// forge/hand/sketch/captions.mjs — straight, lightly hand-drawn screen frame with two bold C glyphs; no hatching so CC stays legible.
export default function render() {
  const f = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M5.8 4.4Q12 4.2 18.2 4.4Q22 4.5 22 8L21.9 16.2Q21.9 20.1 18.2 20.1Q12 20.3 5.8 20.1Q2.2 20.1 2.2 16.2L2.1 8Q2.1 4.5 5.8 4.4', ...f, class: 'wm-k' }],
    ['path', { d: 'M5.8 4.1Q12 3.9 18.2 4.1Q21.7 4.1 21.7 7.8L21.6 16Q21.6 19.8 18.2 19.8Q12 20 5.8 19.8Q2.3 19.8 2.3 16L2.2 7.8Q2.2 4.2 5.8 4.1', class: 'wm-k' }],
    ['path', { d: 'M10.2 9H8.7Q6.3 9 6.3 11.3V12.7Q6.3 15 8.7 15H10.2', 'stroke-width': 1.5, class: 'wm-a' }],
    ['path', { d: 'M17.8 9H16.3Q13.9 9 13.9 11.3V12.7Q13.9 15 16.3 15H17.8', 'stroke-width': 1.5, class: 'wm-a' }],
  ]
}
