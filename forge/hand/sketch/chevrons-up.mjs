// forge/hand/sketch/chevrons-up.mjs — two stacked continuous pencil chevrons, each with one clean peak and a faint
// second pass, replacing arms that crossed and left stray ticks at both tips.
export default function render() {
  return [
    ['path', { d: 'M5.9 12.85Q8.9 9.6 11.95 6.4Q14.9 9.65 18.1 12.95', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M5.6 12.3Q7.25 10.65 8.8 9.15Q10.45 7.6 12.05 6Q13.6 7.7 15.1 9.2Q16.7 10.75 18.4 12.2', class: 'wm-k' }],
    ['path', { d: 'M5.85 18.8Q8.95 15.65 12 12.45Q15 15.6 18.05 18.9', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M5.65 18.35Q7.2 16.7 8.85 15.1Q10.4 13.55 11.95 12.05Q13.65 13.65 15.15 15.15Q16.65 16.8 18.35 18.25', class: 'wm-a' }],
  ]
}
