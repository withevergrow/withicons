// forge/hand/sketch/pipette.mjs — an eyedropper: round rubber bulb, a firm collar bar and a glass barrel that tapers
// to a fine nozzle, replacing a thin uniform tube whose tip and bulb blurred into a stick at 16px.
export default function render() {
  return [
    ['path', { d: 'M12.6 9.6L6.6 15.6Q5.7 16.5 5.6 17.6M8.2 18.6Q9 18.5 9.9 17.6L14.6 12.9', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M12.1 9.1L6.2 15Q5.35 15.85 5.25 17L5.05 18.95L7 18.75Q8.15 18.65 9 17.8L14.9 11.9M5.1 18.9Q4.2 19.8 3.3 20.7', class: 'wm-k' }],
    ['path', { d: 'M10.4 7.45Q13.45 10.5 16.55 13.6', 'stroke-width': 1.45, class: 'wm-k' }],
    ['path', { d: 'M15.5 12.5L19.4 8.6Q20.55 7.4 20.15 5.9Q19.75 4.45 18.25 3.95Q16.7 3.5 15.45 4.6L11.5 8.5', class: 'wm-a' }],
  ]
}
