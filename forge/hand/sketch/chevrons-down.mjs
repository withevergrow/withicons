// forge/hand/sketch/chevrons-down.mjs — two stacked continuous pencil chevrons, each meeting in one clean point with a
// faint second pass, replacing arms that crossed and left stray ticks at both tips.
export default function render() {
  return [
    ['path', { d: 'M5.85 5.2Q8.95 8.35 12 11.55Q15 8.4 18.05 5.1', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M5.65 5.65Q7.2 7.3 8.85 8.9Q10.4 10.45 11.95 11.95Q13.65 10.35 15.15 8.85Q16.65 7.2 18.35 5.75', class: 'wm-k' }],
    ['path', { d: 'M5.9 11.15Q8.9 14.4 11.95 17.6Q14.9 14.35 18.1 11.05', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M5.6 11.7Q7.25 13.35 8.8 14.85Q10.45 16.4 12.05 18Q13.6 16.3 15.1 14.8Q16.7 13.25 18.4 11.8', class: 'wm-a' }],
  ]
}
