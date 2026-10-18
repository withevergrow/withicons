// forge/hand/sketch/list-todo.mjs — a bold wobbly tick and a clean EMPTY hand-drawn checkbox beside three uneven pencil
// lines. No hatching, so the open box can never read as a filled or selected item.
export default function render() {
  return [
    ['path', { d: 'M12.8 6.1Q16.9 5.75 21.2 6.15M12.9 12.15Q17 12.4 20.6 11.95M12.8 18.05Q16.6 17.8 21.1 18.2', 'stroke-width': 1.3, class: 'wm-k' }],
    ['path', { d: 'M2.7 6.4Q4.1 7.6 5 8.75Q6.9 5.9 9.4 3.6', 'stroke-width': 1.9, class: 'wm-a' }],
    ['path', { d: 'M4.6 15.1Q6.2 14.95 7.6 15.1Q9.05 15.2 9 16.7Q8.9 18.1 9 19.5Q8.95 21 7.4 21Q5.9 20.9 4.5 21.05Q3.05 21 3 19.5Q3.1 18 3 16.6Q3.05 15.15 4.6 15.1Z', 'stroke-width': 1.4, class: 'wm-a' }],
  ]
}
