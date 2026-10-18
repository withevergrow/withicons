// forge/hand/sketch/chevron-left.mjs — one continuous pencil stroke through a clean rounded vertex, with the faint
// second pass riding just outside it, replacing two crossing arms that left a stray blob at the tip.
export default function render() {
  return [
    ['path', { d: 'M16 5.9Q12.7 8.9 9.4 11.95Q12.6 14.9 15.85 18.1', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M15.4 5.6Q13.7 7.25 12.2 8.8Q10.6 10.45 9 12.05Q10.7 13.6 12.2 15.1Q13.7 16.7 15.25 18.4', class: 'wm-k' }],
  ]
}
