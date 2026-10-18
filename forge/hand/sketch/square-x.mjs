// forge/hand/sketch/square-x.mjs — a hand-drawn rounded square with a larger, bolder X and hachure pushed into the
// lower-right corner, replacing a drawing whose shading ran straight through the cross and muddied it at 16px.
export default function render() {
  return [
    ['path', { d: 'M15.2 19.7L19.7 15.2M17.6 19.8L19.8 17.6', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M4.6 3.3Q11.6 2.85 19.05 3.15Q20.85 3.25 20.9 5.1Q21.05 12.1 20.75 18.95Q20.7 20.85 18.9 20.9Q11.9 21.15 5.05 20.8Q3.15 20.75 3.1 18.85Q2.95 11.8 3.2 5.2Q3.3 3.4 5.4 3.1', class: 'wm-k' }],
    ['path', { d: 'M8.1 8.4Q11.9 12.1 15.6 16.2M16.1 7.9Q12.1 11.8 8.3 15.8', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M8.4 8.3Q12.05 11.9 15.7 15.6M15.6 8.4Q11.95 12.1 8.35 15.65', 'stroke-width': 1.5, class: 'wm-a' }],
  ]
}
