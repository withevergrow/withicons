// forge/hand/sketch/sliders.mjs — three straight pencil tracks, each broken around its own outlined pill knob, so the
// knobs stay separate from the tracks instead of crossing them into a hash at 16px.
export default function render() {
  return [
    ['path', { d: 'M3.2 6.25Q8.5 6.1 13.9 6.2M18.2 6.2Q19.6 6.15 20.9 6.3M3.1 12.2Q4.7 12.1 5.9 12.2M10.2 12.15Q15.5 12.05 20.85 12.25M3.15 18.2Q7 18.1 10.9 18.2M15.2 18.15Q18 18.1 20.9 18.25', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M3 6Q8.25 5.95 13.6 6M18.4 6Q19.7 6.05 21 6M3 12Q4.3 11.95 5.6 12M10.4 12Q15.7 12.05 21 12M3 18Q6.8 17.95 10.6 18M15.4 18Q18.2 18.05 21 18', class: 'wm-k' }],
    ['path', { d: 'M16 3.5Q17.45 3.5 17.5 5V7Q17.45 8.5 16 8.5Q14.55 8.5 14.5 7V5Q14.55 3.5 16 3.5ZM8 9.5Q9.45 9.5 9.5 11V13Q9.45 14.5 8 14.5Q6.55 14.5 6.5 13V11Q6.55 9.5 8 9.5ZM13 15.5Q14.45 15.5 14.5 17V19Q14.45 20.5 13 20.5Q11.55 20.5 11.5 19V17Q11.55 15.5 13 15.5Z', class: 'wm-a' }],
  ]
}
