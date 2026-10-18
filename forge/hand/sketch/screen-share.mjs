// forge/hand/sketch/screen-share.mjs — a firm rounded pencil monitor with a bold up arrow kept clear of the hachure,
// replacing thin wobbly strokes whose screen edge and arrow faded at 16px.
export default function render() {
  return [
    ['path', { d: 'M16.4 15.2l3.6-2.7M18.6 15.6l2.2-1.7M4.4 13.6l2.4-1.8', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M4.3 3.9Q12 3.7 19.8 3.85Q22.1 3.95 22.2 6Q22.35 10 22.2 14.3Q22.1 16.75 19.9 16.8Q12 16.95 4.2 16.85Q2.25 16.7 2.15 14.6Q2 10.2 2.2 5.9Q2.3 3.95 4.3 3.9Z', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M4 3.5Q12 3.4 20 3.5Q22 3.55 22 5.5Q22.05 10 22 14.5Q21.95 16.5 20 16.5Q12 16.6 4 16.5Q2.05 16.45 2 14.5Q1.95 10 2 5.5Q2.05 3.55 4 3.5Z', 'stroke-width': 1.5, class: 'wm-k' }],
    ['path', { d: 'M12.3 16.8Q12.25 19 12.35 21.3M8.2 21.4Q12.2 21.25 16.3 21.35', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M12 16.5Q11.95 18.75 12.05 21M8 21Q12 20.9 16 21.05', 'stroke-width': 1.5, class: 'wm-a' }],
    ['path', { d: 'M12.3 13.3Q12.2 10.2 12.25 7.3M9.3 10.3Q10.8 8.8 12.25 7.3Q13.8 8.8 15.3 10.4', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-s' }],
    ['path', { d: 'M12 13Q11.95 10 12.05 7M9 10Q10.5 8.5 12 7Q13.5 8.45 15 10', 'stroke-width': 1.5, class: 'wm-s' }],
  ]
}
