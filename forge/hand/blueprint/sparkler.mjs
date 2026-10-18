// forge/hand/blueprint/sparkler.mjs — the drafted sparkler: one coated rod on a bare wire handle running up at 45 degrees to a single
// radial burst around its burning tip. The earlier drawing had a hairline stick, a crowded ring of sparks, two extra
// twinkles and a stray control ring, so it read as a magic wand; here the coated rod is solid and thick, the wire handle is plain, the
// burst is one even ring of seven rays (the gap lies where the stick enters), and only the dimension line shows the drafting.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3 22.9H21M3 20.7V23.3M21 20.7V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.55L3.65 22.25M20.35 23.55L21.65 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // bare wire handle and the solid coated rod
    ['path', { d: 'M4 20L9 15', class: 'wm-k' }],
    ['path', { d: 'M8.4 14.4L13.1 9.7L14.3 10.9L9.6 15.6Z', fill: 'currentColor', stroke: 'currentColor', class: 'wm-k' }],
    // burst
    ['path', { d: 'M18.4 9H21.5M15 5.6V2.5M11.6 9H8.5M15 12.4V15.5M17.4 6.6L19.1 4.9M12.6 6.6L10.9 4.9M17.4 11.4L19.1 13.1', class: 'wm-a' }],
  ]
}
