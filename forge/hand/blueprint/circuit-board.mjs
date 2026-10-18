// forge/hand/blueprint/circuit-board.mjs — the drafted board with two pad-ended traces and two vias (the generated
// drawing was a box with two thin zig-zags, which at 16px read as a maze or a generic trace): the pads are larger rings,
// the traces run whole to the board edge, and two solid vias fill the empty corners so the square reads as a populated
// board; the fillet construction and one dimension line stay as the style's drafting.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M21.68 3H23.1M21 .9V2.32M21 21.68V22.3M23.1 21H21.68M2.32 21H.9M3 22.3V21.68M3 2.32V.9M.9 3H2.32', ...con(0.5) }],
    ['path', { d: 'M3 23H21M3 22.3V23.5M21 22.3V23.5', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', ...con(0.75, 0.5) }],
    // the board
    ['path', { d: 'M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z', class: 'wm-k' }],
    // traces from the pads out to the board edge
    ['path', { d: 'M8 10.25V13.5L11 16.5V21M16 13.75V10.5L13 7.5V3', class: 'wm-a' }],
    // pads
    ['circle', { cx: 8, cy: 8, r: 1.75, class: 'wm-a' }],
    ['circle', { cx: 16, cy: 16, r: 1.75, class: 'wm-a' }],
    // vias
    ['circle', { cx: 17.5, cy: 6.5, r: 1.1, fill: 'currentColor', stroke: 'none', class: 'wm-a' }],
    ['circle', { cx: 6.5, cy: 17.5, r: 1.1, fill: 'currentColor', stroke: 'none', class: 'wm-a' }],
  ]
}
