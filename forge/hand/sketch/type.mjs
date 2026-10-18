// forge/hand/sketch/type.mjs — hand-drawn serif T: wobbly crossbar with drooping ends, one stem, a foot stroke.
const BAR = 'M4.2 7.3Q4.3 6 4.5 4.6Q8.3 4.4 12.1 4.5Q15.9 4.4 19.6 4.6Q19.8 6 19.9 7.2'
const STEM = 'M12.1 4.6Q12.3 12.2 12.2 19.9'
const FOOT = 'M8.3 19.8Q12.2 20.1 16 19.9'
const g = 'M4.5 7Q4.6 5.8 4.8 4.3Q8.5 4.1 12.3 4.2Q16.1 4.1 19.9 4.3M12.4 4.3Q12.6 12 12.5 19.6'
export default function render() {
  return [
    ['path', { d: g, 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BAR + STEM, class: 'wm-k' }],
    ['path', { d: FOOT, class: 'wm-a' }],
  ]
}
