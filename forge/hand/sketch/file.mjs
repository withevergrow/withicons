// forge/hand/sketch/file.mjs — straight-sided page with a crisp diagonal dog-ear and a separate fold stroke, replacing a
// left edge that bowed inward and a busy five-line hachure.
export default function render() {
  return [
    ['path', { d: 'M8.6 17.4l5.4-4.2M8.3 20.1l8-6.3M12.4 20.3l4.5-3.5', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M4.7 5Q4.6 12 4.75 19M7.3 21.8Q12 21.9 16.7 21.75M19.35 8Q19.4 13.5 19.3 19M7.2 2.2Q10.5 2.1 13.8 2.25', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M14 2.6Q10.5 2.45 7 2.55Q5 2.6 5.05 4.6Q4.9 12 5.05 19.5Q5.1 21.45 7 21.45Q12 21.6 17 21.4Q19 21.4 18.95 19.4Q19.1 13.5 19 7.5Q16.4 4.9 13.7 2.3', class: 'wm-k' }],
    ['path', { d: 'M14 2.6Q13.9 4.5 14.05 6Q14.1 7.5 15.6 7.5Q17.3 7.6 19.1 7.45', class: 'wm-a' }],
  ]
}
