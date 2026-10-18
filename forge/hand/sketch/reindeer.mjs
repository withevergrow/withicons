// forge/hand/sketch/reindeer.mjs — one clean pencilled head with leaf ears, single-stroke antlers with one tine each, dot
// eyes and a solid round nose, replacing doubled ears and antlers that scribbled the head into a skull-like knot.
export default function render() {
  return [
    ['path', { d: 'M8.4 16.9l1.5-1.1', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M7.7 11.3Q7.8 8.4 11.6 8.15', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M8 11.5C8 9.5 9.5 8.5 12 8.5C14.5 8.5 16 9.5 16 11.5C16 14 15 15.5 15 17.75C15 19.4 13.65 20.75 12 20.75' +
      'C10.35 20.75 9 19.4 9 17.75C9 15.5 8 14 8 11.5Z', class: 'wm-k' }],
    ['path', { d: 'M8.1 11.05C6.4 11.55 4.5 11.25 3.5 9.75C5 8.75 7 8.8 8.4 9.8M15.9 11.05C17.6 11.55 19.5 11.25 20.5 9.75C19 8.75 17 8.8 15.6 9.8', class: 'wm-k' }],
    ['path', { d: 'M10.75 12.9h.01M13.25 12.9h.01', 'stroke-width': 1.7, class: 'wm-k' }],
    ['path', { d: 'M10 8.55C9.3 6.2 7.6 4.3 5 3.3M8.35 5.7C8.75 4.5 8.75 3.3 8.25 2.3', class: 'wm-a' }],
    ['path', { d: 'M14 8.55C14.7 6.2 16.4 4.3 19 3.3M15.65 5.7C15.25 4.5 15.25 3.3 15.75 2.3', class: 'wm-a' }],
    ['circle', { cx: 12, cy: 17.9, r: 1.55, fill: 'currentColor', 'stroke-width': 0.9, class: 'wm-s' }],
  ]
}
