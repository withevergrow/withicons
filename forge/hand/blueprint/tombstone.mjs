// forge/hand/blueprint/tombstone.mjs — a drafted arched headstone with a cross on its face and a ground line. The generated
// drawing carried two short bars that read as lines of text (a door or a tablet) plus grass ticks and centre marks; here
// there is one outline, one clear cross, the ground line, and the faint keyline circle and dimension line.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M13.91 21.82a10 10 0 0 1-2.39.17m-.69-.06l-.4-.05M3.15 16.66a10 10 0 0 1-.85-2.24m-.15-.68l-.06-.4m-.07-.7a10 10 0 0 1 .13-2.39m.15-.68l.1-.39m.23-.66a10 10 0 0 1 1.09-2.13m.41-.56l.26-.31m.47-.52a10 10 0 0 1 1.87-1.5m.61-.35l.35-.17m.64-.28a10 10 0 0 1 2.32-.61m.7-.07l.4-.02m.7.01a10 10 0 0 1 2.36.39m.66.22l.38.15m.63.29a10 10 0 0 1 2 1.32m.52.47l.28.29m.46.53a10 10 0 0 1 1.28 2.02m.28.64l.14.37m.21.67a10 10 0 0 1 .35 2.37m-.01.7l-.03.4m-.08.69a10 10 0 0 1-.65 2.31m-.29.63l-.11.23', ...con(0.34) }],
    ['path', { d: 'M2.5 22.9H21.5M2.5 21.9V23.3M21.5 21.9V23.3', ...con(0.5) }],
    ['path', { d: 'M1.85 23.55L3.15 22.25M20.85 23.55L22.15 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // headstone and ground
    ['path', { d: 'M6 20.5V9.5A6 6 0 0 1 18 9.5V20.5M2.5 20.5H21.5', class: 'wm-k' }],
    // cross
    ['path', { d: 'M12 7V15.5M8.75 10H15.25', class: 'wm-a' }],
  ]
}
