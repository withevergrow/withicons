// forge/hand/sketch/chevron-up.mjs — one continuous pencil stroke rising to a single clean peak at 12,9, matching
// chevron-down's arm length, replacing two arms that hooked into a flat, broken join.
export default function render() {
  return [
    ['path', { d: 'M5.9 15.85Q8.9 12.6 11.95 9.4Q14.9 12.65 18.1 15.95', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M5.6 15.3Q7.25 13.65 8.8 12.15Q10.45 10.6 12.05 9Q13.6 10.7 15.1 12.2Q16.7 13.75 18.4 15.2', class: 'wm-k' }],
  ]
}
