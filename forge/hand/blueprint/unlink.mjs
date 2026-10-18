// forge/hand/blueprint/unlink.mjs — two drafted link capsules pulled clearly apart with bold break marks across the gap
// (the generated drawing left a narrow gap, short break slashes and fillet crosshairs in one capsule only, so it read
// as a link with a smudge): the capsules are shortened at their inner ends to open a 4u gap, the break marks are longer
// object-weight slashes, and the construction is just the keyline and the width dimension, clear of the break.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const KEY = 'M5.89 19.92a10 10 0 0 1-1.7-1.68M2.62 15.47a10 10 0 0 1-.55-2.33m-.06-.69l-.01-.4m.02-.7a10 10 0 0 1 .44-2.36m.24-.66l.15-.37m.31-.63a10 10 0 0 1 1.36-1.96m.48-.51l.29-.28m.54-.45a10 10 0 0 1 2.04-1.24m.65-.27l.38-.13m.67-.19a10 10 0 0 1 2.38-.3m.7.02l.39.03m.7.1a10 10 0 0 1 1.71.46M18.15 4.11a10 10 0 0 1 1.69 1.69M21.36 8.48a10 10 0 0 1 .57 2.33m.06.69l.01.4m-.02.7a10 10 0 0 1-.43 2.36m-.23.66l-.15.37m-.3.63a10 10 0 0 1-1.35 1.98m-.48.51l-.29.27m-.54.46a10 10 0 0 1-2.04 1.25m-.64.27l-.38.13m-.67.2a10 10 0 0 1-2.38.31m-.7-.02l-.39-.03m-.7-.09a10 10 0 0 1-1.81-.49'

export default function render() {
  return [
    ['path', { d: KEY, ...con(0.34) }],
    ['path', { d: 'M2.67 23H21.33M2.67 21.4V23.2M21.33 21.4V23.2', ...con(0.5) }],
    ['path', { d: 'M2.02 23.65L3.32 22.35M20.68 23.65L21.98 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M3.5 16.5L6 14A2.83 2.83 0 0 1 10 18L7.5 20.5A2.83 2.83 0 0 1 3.5 16.5ZM14 6L16.5 3.5A2.83 2.83 0 0 1 20.5 7.5L18 10A2.83 2.83 0 0 1 14 6Z', class: 'wm-k' }],
    ['path', { d: 'M6.75 6.75L9.5 9.5M14.5 14.5L17.25 17.25', class: 'wm-s' }],
  ]
}
