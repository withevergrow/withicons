// forge/hand/blueprint/hand-coins.mjs — the drafted open hand with a rounded thumb pad, fingers that end in a clear
// curled tip and one thin flat coin (open oval face, low edge) resting just above them (the generated drawing put a crosshair in the palm, rings
// on the cuff and a tall cylinder high over a flat curve, so it read as a tray under a can): object lines stay whole.
const ACCENT = 'var(--with-accent, currentColor)'
const con = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }

export default function render() {
  return [
    // faint keyline, kept clear of the object lines
    ['path', { d: 'M20.08 17.89a10 10 0 0 1-1.63 1.75m-.55.43l-.32.23m-.6.37a10 10 0 0 1-2.2.94M5.58 19.67a10 10 0 0 1-1.64-1.75M2.15 10.26a10 10 0 0 1 .7-2.29m.3-.63l.2-.35m.37-.59a10 10 0 0 1 1.57-1.81m.53-.45l.32-.24m.58-.39a10 10 0 0 1 2.17-1.01m.67-.2l.28-.06M17.74 3.81a10 10 0 0 1 .87.68M21.29 8.29a10 10 0 0 1 .61 2.32m.08.69l.02.4m-.01.7a10 10 0 0 1-.28 1.97', ...con, 'stroke-opacity': 0.34 }],
    ['path', { d: 'M4.2 23H20.5M20.5 21.7V23.3', ...con }],
    ['path', { d: 'M3.55 23.65L4.85 22.35M19.85 23.65L21.15 22.35', ...tick }],
    // cuff, thumb pad, and the hand curling up into the fingertips
    ['path', { d: 'M3 13V21M5.5 13H10A2 2 0 0 1 10 17H8M5.5 21H12.5A2 2 0 0 0 13.62 20.66L19.9 16.4A1.75 1.75 0 0 0 18 13.5L12.5 16.5', class: 'wm-k' }],
    // one flat coin, lifted just above the fingers
    ['path', { d: 'M19.5 5.5A4.5 2 0 0 1 10.5 5.5A4.5 2 0 0 1 19.5 5.5ZM10.5 5.5V7A4.5 2 0 0 0 19.5 7V5.5', class: 'wm-a' }],
  ]
}
