// forge/hand/sketch/sigma.mjs — a wobbly pencil sigma with uneven joins, a slight re-stroke on the top bar and
// overshooting serif terminals, so it reads hand-drawn beside its siblings.
export default function render() {
  return [
    ['path', { d: 'M7.4 4.6Q12 4.35 16.6 4.55', 'stroke-width': 0.6, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: 'M17.4 7Q17.65 5.4 17.35 3.85Q11.7 4.15 5.8 3.9Q9.2 7.6 12.55 11.85Q9.4 15.9 6.1 20.15Q11.9 19.8 17.75 20.1Q17.4 18.6 17.65 16.95', 'stroke-width': 1.55, class: 'wm-k' }],
  ]
}
