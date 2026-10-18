// forge/hand/blueprint/api.mjs — the drafted connector block with three ported leads (the generated drawing laid the
// Ø20 chain keyline straight through all three port rings and ran a chain axis across the block and out through the
// lower right port, so at 16px the ports dissolved into dashed noise): the block and its leads stay whole, the ports
// are clean rings, and only the faint fillet construction at the block's corners and one dimension line show the work.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    // fillet construction: each rounded corner of the block shows the sharp corner it was cut from
    ['path', { d: 'M16.68 6.5H18.1M16 4.4V5.82M16 18.18V19.4M18.1 17.5H16.68M7.32 17.5H5.9M8 19.4V18.18M8 5.82V4.4M5.9 6.5H7.32', ...con(0.5) }],
    // one dimension line under the whole connector
    ['path', { d: 'M2.5 20.5H21.5M2.5 19.1V21.2M21.5 18.1V21.2', ...con(0.5) }],
    ['path', { d: 'M1.85 21.15L3.15 19.85M20.85 21.15L22.15 19.85', ...con(0.75, 0.5) }],
    // the block
    ['path', { d: 'M10 6.5H14A2 2 0 0 1 16 8.5V15.5A2 2 0 0 1 14 17.5H10A2 2 0 0 1 8 15.5V8.5A2 2 0 0 1 10 6.5Z', class: 'wm-k' }],
    // leads and port rings
    ['path', { d: 'M5.5 12H8M16 9H18.5M16 15H18.5', class: 'wm-a' }],
    ['circle', { cx: 4, cy: 12, r: 1.5, class: 'wm-a' }],
    ['circle', { cx: 20, cy: 9, r: 1.5, class: 'wm-a' }],
    ['circle', { cx: 20, cy: 15, r: 1.5, class: 'wm-a' }],
  ]
}
