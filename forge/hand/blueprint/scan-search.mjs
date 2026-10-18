// forge/hand/blueprint/scan-search.mjs — a magnifier inside four whole scan brackets (the generated drawing crossed a
// chain crosshair through the small lens, ringed five of the eight bracket ends so the frame broke unevenly, and ran the
// Ø20 keyline between frame and lens, so the guides outweighed the subject): the lens is a touch larger and clean,
// the brackets stay unbroken, and the fillet construction ticks outside the corners plus one dimension line under the
// frame are the drafting, matching circuit-board's board.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M21.68 3H23.1M21 .9V2.32M21 21.68V22.3M23.1 21H21.68M2.32 21H.9M3 22.3V21.68M3 2.32V.9M.9 3H2.32', ...con(0.5) }],
    ['path', { d: 'M3 23H21M3 22.3V23.5M21 22.3V23.5', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', ...con(0.75, 0.5) }],
    // scan brackets
    ['path', { d: 'M3 7.5V5A2 2 0 0 1 5 3H7.5M16.5 3H19A2 2 0 0 1 21 5V7.5M21 16.5V19A2 2 0 0 1 19 21H16.5M7.5 21H5A2 2 0 0 1 3 19V16.5', class: 'wm-k' }],
    // the lens (pivots on 11 11 for the tilt)
    ['circle', { cx: 11, cy: 11, r: 4, class: 'wm-a' }],
    ['path', { d: 'M14 14L16.75 16.75', class: 'wm-a' }],
  ]
}
