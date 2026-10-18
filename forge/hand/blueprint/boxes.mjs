// forge/hand/blueprint/boxes.mjs — the drafted stack of three cubes, each standing in its own air. The generated drawing
// hung control rings on the outer corners and let keyline arcs peek out behind the stack; a first hand pass then made all
// three cubes share one vertex (12,13.25), which inked into a black knot at 24px. Here every cube is a separate isometric
// block on the 0.25 grid (half-width 4, rise 2.25, edge 4.5) with about 1u of clear paper between them: the bottom pair
// sits 2.5u apart, the top cube floats 2.36u clear of their top faces and is its own part (it hops in the motion), and
// the only construction is the width dimension below, the way boxes are drafted.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

// one isometric cube: top vertex (cx, ty); silhouette hexagon, then the near top-face edges and the front vertical
// (butt caps, so the inner edges end flush on the outline instead of poking square caps past the side corners)
const cube = (cx, ty) => {
  const l = cx - 4, r = cx + 4, a = ty + 2.25, f = ty + 4.5, b = ty + 9, s = ty + 6.75
  return `M${cx} ${ty}L${r} ${a}V${s}L${cx} ${b}L${l} ${s}V${a}ZM${l} ${a}L${cx} ${f}L${r} ${a}M${cx} ${f}V${b}`
}

export default function render() {
  return [
    ['path', { d: 'M2.75 23H21.25M2.75 21.9V23.3M21.25 21.9V23.3', ...con(0.5) }],
    ['path', { d: 'M2.1 23.65L3.4 22.35M20.6 23.65L21.9 22.35', ...con(0.75, 0.5) }],
    // the two bottom cubes, 2.5u apart
    ['path', { d: cube(6.75, 12) + cube(17.25, 12), 'stroke-linecap': 'butt', class: 'wm-k' }],
    // the top cube, lifted clear of both
    ['path', { d: cube(12, 3.25), 'stroke-linecap': 'butt', class: 'wm-a' }],
  ]
}
