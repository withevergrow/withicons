// forge/hand/blueprint/toggle.mjs — a drafted switch: a pill track and one plain knob parked at the "on" end, concentric
// with the track's cap. The generated drawing put a ring and a centre dot on the knob and a keyline circle behind the
// pill, which read as a camera; here the track is unobstructed and only the width dimension remains.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M2.5 21H21.5M2.5 19.2V21.8M21.5 19.2V21.8', ...con(0.5) }],
    ['path', { d: 'M1.85 21.65L3.15 20.35M20.85 21.65L22.15 20.35', ...con(0.75, 0.5) }],
    ['path', { d: 'M8.5 5.5H15.5A6.5 6.5 0 0 1 15.5 18.5H8.5A6.5 6.5 0 0 1 8.5 5.5Z', class: 'wm-k' }],
    ['path', { d: 'M18.5 12A3 3 0 0 1 12.5 12A3 3 0 0 1 18.5 12Z', fill: 'currentColor', class: 'wm-a' }],
  ]
}
