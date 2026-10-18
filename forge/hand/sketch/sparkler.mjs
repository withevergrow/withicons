// forge/hand/sketch/sparkler.mjs — the line design in pencil: a diagonal wand from the bottom-left to a radiating burst at the
// upper-right tip, plus two four-point sparkles (upper-left and lower-right).
export default function render() {
  const f = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M4.7 21.3L12.9 13.1', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M3.7 20.5L12.3 11.9', 'stroke-width': 2.2, class: 'wm-k' }],
    ['path', { d: 'M18.5 9.05L22 8.95M15.05 12.5L14.95 15.5M11.5 9L8.3 9.05M15 5.5L15.05 2.5M17.5 11.5L18.7 12.7M12.5 6.5L11.15 5.1M17.5 6.5L18.9 5.15', class: 'wm-a' }],
    ['path', { d: 'M5.8 3.5C6.2 5.4 6.5 5.7 8.5 6.1C6.4 6.6 6.2 6.9 5.55 9C5.1 6.8 4.9 6.5 2.7 6.05C4.8 5.5 5.1 5.3 5.65 3.35', ...f, class: 'wm-s' }],
    ['path', { d: 'M5.5 3.25C6.1 5.4 6.1 5.4 8.25 6C6.1 6.6 6.1 6.6 5.5 8.75C4.9 6.6 4.9 6.6 2.75 6C4.9 5.4 4.9 5.4 5.5 3.25Z', class: 'wm-s' }],
    ['path', { d: 'M19.8 16C20.3 17.7 20.3 17.8 22.1 18.3C20.3 18.8 20.3 18.8 19.7 20.5C19.2 18.8 19.2 18.8 17.4 18.3C19.2 17.8 19.2 17.8 19.8 16', ...f, class: 'wm-s' }],
    ['path', { d: 'M19.5 15.75C20 17.5 20 17.5 21.75 18C20 18.5 20 18.5 19.5 20.25C19 18.5 19 18.5 17.25 18C19 17.5 19 17.5 19.5 15.75Z', class: 'wm-s' }],
  ]
}
