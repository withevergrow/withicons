// forge/hand/sketch/chevron-last.mjs — one continuous pencil chevron with a clean vertex and a firm, near-straight end
// bar, each with a faint second pass, replacing arms that crossed at the tip and broke up at 16px.
export default function render() {
  return [
    ['path', { d: 'M5.65 5.9Q8.95 8.95 12.2 12.05Q9 14.95 5.75 18.1', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M6.2 5.6Q7.9 7.3 9.4 8.85Q11 10.5 12.6 12Q10.9 13.6 9.4 15.15Q7.9 16.7 6.35 18.4', class: 'wm-k' }],
    ['path', { d: 'M16.75 5.95Q16.85 12 16.7 18.15', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M17.05 5.6Q16.9 8.8 16.95 12Q17.05 15.2 16.95 18.4', class: 'wm-a' }],
  ]
}
