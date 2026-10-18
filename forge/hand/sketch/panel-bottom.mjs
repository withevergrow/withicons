// forge/hand/sketch/panel-bottom.mjs — a straight marker frame with the divider in the lower third, hatched in the
// bottom pane only, and a light pencil ghost on two sides for the sketched feel.
export default function render() {
  const pencil = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M6.2 19.2l2.6-2.2m1.8 2.2l2.6-2.2m1.8 2.2l2.6-2.2', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M3.6 2.75Q12 2.65 20.4 2.8M21.25 3.6Q21.35 12 21.2 20.4', ...pencil, class: 'wm-k' }],
    ['path', { d: 'M5.2 3.1Q12 2.9 18.8 3.1Q21 3 20.95 5.2Q21.1 12 20.9 18.8Q21 21 18.8 20.95Q12 21.1 5.2 20.9Q3 21 3.05 18.8Q2.9 12 3.1 5.2Q3 3 5.2 3.1', class: 'wm-k' }],
    ['path', { d: 'M3.1 15.2Q12 14.95 20.9 15.15', class: 'wm-a' }],
  ]
}
