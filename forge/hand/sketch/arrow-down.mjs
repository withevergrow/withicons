// forge/hand/sketch/arrow-down.mjs — one gently bowed pencil shaft and a single chevron stroke through a rounded tip,
// replacing crossed head arms whose overshoot ticks blotted the point at 16px.
export default function render() {
  return [
    ['path', { d: 'M11.75 4.4Q12.1 9.5 11.9 15.6', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M18.75 13.95Q15.5 17 12.15 20.25Q8.95 17.05 5.85 14.05', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M12.1 4.1Q11.8 8.2 12 12.1Q12.2 16 12 19.5', class: 'wm-k' }],
    ['path', { d: 'M18.4 13.6Q15.25 16.65 12 19.9Q8.8 16.7 5.6 13.6', class: 'wm-a' }],
  ]
}
