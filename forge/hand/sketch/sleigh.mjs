// forge/hand/sketch/sleigh.mjs — a pencilled sleigh with a tall back, scrolled prow and a heavy doubled runner on two
// struts, replacing thin 1.3 runners that faded out on light backgrounds at 16px.
export default function render() {
  return [
    ['path', { d: 'M6.2 15l2.6-1.2M9.4 15.3l2.6-1.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M3.6 14.6Q3.5 10.5 3.6 7.6Q3.7 5.2 6 5.15', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M4 15Q3.95 11 4 7.5Q4 5.5 6 5.5L6.5 5.5Q8.5 5.5 8.5 7.5L8.5 10.5L14 10.5C16 10.5 17 8 19.5 8' +
      'C20.5 8 21.25 8.8 21.25 9.75C21.25 10.7 20.5 11.5 19.5 11.5C17.5 11.5 18 16.5 14.5 16.5L5.5 16.5Q4 16.5 4 15Z', 'stroke-width': 1.45, class: 'wm-k' }],
    ['path', { d: 'M8.6 13.5Q11.6 13.4 14.5 13.5', 'stroke-width': 1.1, class: 'wm-k' }],
    ['path', { d: 'M7 16.7L7 19.8M14 16.7L14 19.8', 'stroke-width': 1.45, class: 'wm-a' }],
    ['path', { d: 'M2.6 19.65Q10 19.55 17.9 19.65C19.7 19.65 21.1 18.8 21.15 17.2', 'stroke-width': 0.6, 'stroke-opacity': 0.55, class: 'wm-a' }],
    ['path', { d: 'M2.5 20.1Q10 20.2 18 20.1C20 20.1 21.5 19.1 21.5 17.25', 'stroke-width': 1.85, class: 'wm-a' }],
  ]
}
