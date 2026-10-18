// forge/hand/sketch/chevron-right.mjs — one continuous pencil stroke through a clean rounded vertex, with the faint
// second pass riding just outside it, replacing two crossing arms that left a stray mark at the tip.
export default function render() {
  return [
    ['path', { d: 'M8.05 5.9Q11.35 8.95 14.6 12.05Q11.4 14.95 8.15 18.1', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M8.6 5.6Q10.3 7.3 11.8 8.85Q13.4 10.5 15 12Q13.3 13.6 11.8 15.15Q10.3 16.7 8.75 18.4', class: 'wm-k' }],
  ]
}
