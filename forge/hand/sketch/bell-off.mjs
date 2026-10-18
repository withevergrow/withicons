// forge/hand/sketch/bell-off.mjs — bell drawn with wide gaps where the slash passes and a shorter slash at full pencil
// weight, so the strike clears the bell instead of crowding it.
export default function render() {
  return [
    ['path', { d: 'M9.7 5.65Q12.5 4.4 15.4 5.9Q18.4 7.6 18.35 11.8M5.7 11Q5.65 14 5.75 16.6L4.2 18.85Q9 18.85 13.5 18.85', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M10 5.3Q11 4.95 12 5C15.31 5 18 7.69 18 11Q18.05 12.3 18 13.3M6 10.6Q5.95 13.5 6 16.5Q5.3 17.5 4.5 18.5Q9.2 18.6 13.9 18.5', class: 'wm-k' }],
    ['path', { d: 'M9.5 18.6Q9.7 21.1 12 21.45Q14 21.4 14.45 19.1', class: 'wm-a' }],
    ['path', { d: 'M3.9 3.6Q12 11.6 20.3 20.5', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-s' }],
    ['path', { d: 'M3.6 3.5Q12.1 11.9 20.5 20.6', class: 'wm-s' }],
  ]
}
