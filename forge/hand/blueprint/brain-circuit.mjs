// forge/hand/blueprint/brain-circuit.mjs — the drafted half brain with two circuit traces ending in pads (the generated
// drawing ran three traces into three pads beside the folds and broke the brain's outline open for a control ring, so at
// 16px the pads crowded the brain and the outline looked torn): the outline stays whole, two traces leave the flat edge
// to two pads spaced well apart, and the faint keyline and one dimension line carry the drafting.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const pad = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`

export default function render() {
  return [
    // faint Ø20 keyline, broken clear of the brain
    ['path', { d: 'M5.21 4.66a10 10 0 0 1 1.59-1.2M7.95 2.86a10 10 0 0 1 2.29-.7m.69-.1l.4-.04m.7-.02a10 10 0 0 1 2.38.29m.67.2l.38.13m.64.26a10 10 0 0 1 2.05 1.24m.54.45l.29.27m.49.51a10 10 0 0 1 1.36 1.96m.31.63l.15.37m.24.66a10 10 0 0 1 .45 2.35m.02.7l-.01.4m-.05.7a10 10 0 0 1-.55 2.33m-.27.65l-.17.36m-.33.61a10 10 0 0 1-1.46 1.91m-.5.48l-.31.26m-.55.43a10 10 0 0 1-2.1 1.14m-.66.24l-.39.11m-.68.16a10 10 0 0 1-2.38.19m-.7-.05l-.4-.05', ...con(0.34) }],
    // one dimension line under the drawing
    ['path', { d: 'M2.4 23H19M2.4 20.8V23.2M19 18V23.2', ...con(0.5) }],
    ['path', { d: 'M1.75 23.65L3.05 22.35M18.35 23.65L19.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // the half brain, whole
    ['path', { d: 'M12 5.5A3 3 0 0 0 6.5 6A3.5 3.5 0 0 0 3.5 12A3.5 3.5 0 0 0 6 18A3.25 3.25 0 0 0 12 19Z', class: 'wm-k' }],
    // folds, traces and pads
    ['path', { d: 'M6.5 6C7.5 6.75 8 7.75 8 9M3.5 12C5.5 12 7 12.75 7.5 14.5M12 8.5H15M12 15.5H15' + pad(17, 8.5, 2) + pad(17, 15.5, 2), class: 'wm-a' }],
  ]
}
