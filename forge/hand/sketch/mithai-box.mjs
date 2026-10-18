// forge/hand/sketch/mithai-box.mjs — the line design in pencil: a closed sweet box with a band across the lid and the two round
// sweets plus the diamond sitting on top (not an open empty crate).
export default function render() {
  const f = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M4.6 17.6l1.6-1M17.8 19l1.5-1M4.8 12.8l1.4-.9', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M3.3 11.3L21.3 11.2L21.25 19.6C21.2 20.9 20.4 21.7 19.2 21.75L5.2 21.8C3.9 21.7 3.3 20.9 3.25 19.6Z', ...f, class: 'wm-k' }],
    ['path', { d: 'M3.05 11.05L21 10.95L21.05 19.4C21 20.7 20.2 21.5 19 21.5L5 21.55C3.7 21.5 3 20.7 3 19.4L3.05 11.2', class: 'wm-k' }],
    ['path', { d: 'M3.1 15.1L12 14.9L21 15.05', class: 'wm-k' }],
    ['path', { d: 'M7.5 9.1C7.5 7.9 6.6 7 5.5 7C4.3 7 3.5 7.9 3.5 9C3.5 10.1 4.4 11 5.5 11C6.6 11 7.55 10.2 7.4 9.2', class: 'wm-s' }],
    ['path', { d: 'M20.5 9.1C20.5 7.9 19.6 7 18.5 7C17.3 7 16.5 7.9 16.5 9C16.5 10.1 17.4 11 18.5 11C19.6 11 20.55 10.2 20.4 9.2', class: 'wm-s' }],
    ['path', { d: 'M12.05 4.5L14.5 7.8L12 11.05L9.5 7.7L11.95 4.55', class: 'wm-a' }],
    ['path', { d: 'M11.2 7.8L12.9 7.7', 'stroke-width': 0.8, class: 'wm-s' }],
  ]
}
