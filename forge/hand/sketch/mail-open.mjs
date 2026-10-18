// forge/hand/sketch/mail-open.mjs — open envelope: one clean closed outline with the flap standing up, a V front fold,
// a letter peeking out (two short lines), a pencilled ghost of the outline and two light hatches in the lower corner.
// No overshoot ticks at the corners.
export default function render() {
  const ghost = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M4.4 19.6L7.3 16.9M6.9 20.3L9.6 17.6', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M11.8 3.8Q16.7 7.1 21.2 10.3Q21.4 14.5 21.1 18.9Q21 21.1 18.9 21.2Q12 21.3 5.1 21.2Q2.9 21 2.8 18.9Q2.6 14.5 2.9 10.4Q7.2 7.3 11.8 3.8Z', ...ghost, class: 'wm-k' }],
    ['path', { d: 'M12 3.5Q16.8 6.8 21.5 10Q21.7 14.4 21.4 18.7Q21.3 20.9 19.2 21Q12 21.1 4.8 21Q2.7 20.9 2.6 18.7Q2.3 14.4 2.5 10Q7.3 6.8 12 3.5Z', class: 'wm-k' }],
    ['path', { d: 'M2.8 10.2Q7.4 13.2 12 16.4Q16.6 13.3 21.2 10.2', class: 'wm-a' }],
    ['path', { d: 'M8.6 9.1Q12 8.9 15.4 9.1M9.4 12Q12 11.8 14.6 12', 'stroke-width': 1, class: 'wm-a' }],
  ]
}
