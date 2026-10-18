// forge/hand/blueprint/video-off.mjs — the drafted camera with its body and lens cut wide and clean around one
// unbroken slash (the generated drawing hung five control rings, a keyline arc and centre ticks on it, so the slash
// and camera lines merged into a scribble at 16px): the slash gets a 2u knockout and the drafting is one dimension line.
const ACCENT = 'var(--with-accent, currentColor)'
const con = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }

export default function render() {
  return [
    ['path', { d: 'M2 23H22M2 21.7V23.3M22 21.7V23.3', ...con }],
    ['path', { d: 'M1.35 23.65L2.65 22.35M21.35 23.65L22.65 22.35', ...tick }],
    // camera body, opened where the slash passes
    ['path', { d: 'M3 6.27A2 2 0 0 0 2 8V16A2 2 0 0 0 4 18H14M9 6H14A2 2 0 0 1 16 8V13', class: 'wm-k' }],
    // lens
    ['path', { d: 'M16 10.5L22 7V17L17.25 14.23', class: 'wm-a' }],
    // slash
    ['path', { d: 'M3 3L21 21', class: 'wm-s' }],
  ]
}
