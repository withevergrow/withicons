// forge/hand/sketch/gingerbread-man.mjs — one pencilled cookie outline with a round head, round-ended arms set off by
// deep armpit notches and splayed legs, plus a dotted face and buttons, replacing a lumpy faceless blob at 16px.
const BODY = 'M10.5 8.2C8.2 7.6 8.1 2 12 2C15.9 2 15.8 7.6 13.5 8.2Q13.9 9.3 15 9.35L18.4 9.4' +
  'C19.9 9.4 20.35 10.4 20.35 11.35C20.35 12.3 19.9 13.3 18.4 13.3L16 13.3Q15.3 13.35 15.35 14.1L15.5 15.2L18.5 19.1' +
  'C19.6 20.6 17.6 22.7 15.4 21.3L12 17.9L8.6 21.3C6.4 22.7 4.4 20.6 5.5 19.1L8.5 15.2L8.65 14.1Q8.7 13.35 8 13.3' +
  'L5.6 13.3C4.1 13.3 3.65 12.3 3.65 11.35C3.65 10.4 4.1 9.4 5.6 9.4L9 9.35Q10.1 9.3 10.5 8.2Z'
export default function render() {
  return [
    ['path', { d: 'M14.9 18.6l1.4-1.1M15.9 20.3l1.5-1.2', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M8.4 4.2Q9.2 2.4 11.4 2.3', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['path', { d: 'M10.75 4.75h.01M13.25 4.75h.01', 'stroke-width': 1.6, class: 'wm-k' }],
    ['path', { d: 'M10.7 6.2Q12 7.15 13.3 6.2', 'stroke-width': 1, class: 'wm-k' }],
    ['path', { d: 'M12 11.4h.01M12 14.5h.01', 'stroke-width': 1.9, class: 'wm-a' }],
  ]
}
