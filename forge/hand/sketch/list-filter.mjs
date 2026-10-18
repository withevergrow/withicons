// forge/hand/sketch/list-filter.mjs — three pencil bars stepping in clearly (18u, 12u, 6u) with a slightly heavier
// short bar, replacing a stack whose 5u bottom bar shrank to a dash and got lost at 16px.
export default function render() {
  return [
    ['path', { d: 'M3.4 6.35Q12.2 5.85 20.9 6.25M6.4 12.3Q12.1 11.9 17.8 12.2M9.3 18.25Q12.1 17.95 15 18.15', 'stroke-width': 0.5, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M3 6.05Q12 6.3 21 5.9M6 12.05Q12 11.85 18 12.1', class: 'wm-k' }],
    ['path', { d: 'M8.9 17.95Q12 18.15 15.1 17.9', 'stroke-width': 1.5, class: 'wm-k' }],
  ]
}
