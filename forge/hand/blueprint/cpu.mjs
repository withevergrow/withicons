// forge/hand/blueprint/cpu.mjs — the drafted chip with a larger core (the generated drawing kept a small 6u die
// ringed by a dashed keyline circle and chain axes running through the pin field, so the core washed out at 16px):
// the core grows to 8u, the keyline circle goes (a box shows its construction at its fillet corners), the axes only
// stub out between the pins, and a centre mark sits inside the core.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M19.68 5H21.1M19 2.9V4.32M19 19.68V21.1M21.1 19H19.68M4.32 19H2.9M5 21.1V19.68M5 4.32V2.9M2.9 5H4.32M2.5 23H21.5M2.5 21.7V23.3M21.5 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M12 .8v2.4M12 20.6v1.6M.8 12h2.4M20.8 12h2.4M12 9.5v1.7m0 .6v.4m0 .6v1.7M9.5 12h1.7m.6 0h.4m.6 0h1.7', ...con(0.5) }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M7 5H17A2 2 0 0 1 19 7V17A2 2 0 0 1 17 19H7A2 2 0 0 1 5 17V7A2 2 0 0 1 7 5ZM9 2.5V5M15 2.5V5M9 19V21.5M15 19V21.5M2.5 9H5M2.5 15H5M19 9H21.5M19 15H21.5', class: 'wm-k' }],
    ['path', { d: 'M9.5 8H14.5A1.5 1.5 0 0 1 16 9.5V14.5A1.5 1.5 0 0 1 14.5 16H9.5A1.5 1.5 0 0 1 8 14.5V9.5A1.5 1.5 0 0 1 9.5 8Z', class: 'wm-a' }],
  ]
}
