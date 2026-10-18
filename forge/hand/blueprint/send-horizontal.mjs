// forge/hand/blueprint/send-horizontal.mjs — the drafted paper plane as one unbroken mitred outline with its fold (the
// generated drawing broke all four corners open for control rings, laid the Ø20 keyline around it and ran a chain axis
// out of the nose, so the arrow fell apart into strokes and rings at 16px): the dart is whole and sharp, and one
// dimension line under it is the drafting; a short chain stub runs on from the fold out through the open notch, and the
// nose sits at x21 so the mitred tip stays inside the margin.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3.5 23H21M3.5 22.3V23.6M21 21.4V23.6', ...con(0.5) }],
    ['path', { d: 'M2.85 23.65L4.15 22.35M20.35 23.65L21.65 22.35', ...con(0.75, 0.5) }],
    ['path', { d: 'M4.9 12H3.7M3 12H2.6M1.9 12H1.5', ...con(0.5) }],
    ['path', { d: 'M3.5 4L21 12L3.5 20L6.5 12Z', class: 'wm-k' }],
    ['path', { d: 'M6.5 12H13', class: 'wm-a' }],
  ]
}
