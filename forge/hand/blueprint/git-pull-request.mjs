// forge/hand/blueprint/git-pull-request.mjs — the drafted pull request with a full mitred return arrowhead. The generated
// drawing sat control rings on both arrowhead ends, cutting the head down to a stub that read as two dots at 16px, and
// ran a keyline dash through the merge-target circle. Here the arrow is whole and unringed (the dominant stroke), every
// circle carries its centre mark and the keyline steps around the bottom-right circle.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M16 21.16a10 10 0 0 1-2.29.69m-.69.1l-.4.03m-.7.02a10 10 0 0 1-2.37-.31m-.68-.19l-.37-.13M5.51 19.6a10 10 0 0 1-1.63-1.76M2.35 14.62a10 10 0 0 1-.35-2.37m.01-.7l.03-.4m.08-.7a10 10 0 0 1 .23-1.07M3.5 6.74a10 10 0 0 1 1.49-1.87M7.95 2.86a10 10 0 0 1 2.29-.7m.69-.1l.4-.04M17.04 3.4a10 10 0 0 1 1.72 1.23m.5.49l.27.29m.44.55a10 10 0 0 1 1.21 2.06m.25.66l.13.38m.18.67a10 10 0 0 1 .26 2.38m-.03.7l-.04.4m-.11.69l-.16.67', ...con(0.34) }],
    ['path', { d: 'M19.68 6H21.1M19 3.9V5.32M2 23H22M2 21.2V23.3M22 21.2V23.3', ...con(0.5) }],
    ['path', { d: 'M3.4 6h2.4m.7 0h.1M5 4.4v2.4m0 .7v.1M3.4 18h2.4m.7 0h.1M5 16.4v2.4m0 .7v.1M17.4 18h2.4m.7 0h.1M19 16.4v2.4m0 .7v.1', ...con(0.5) }],
    ['path', { d: 'M1.35 23.65L2.65 22.35M21.35 23.65L22.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M8 6A3 3 0 0 1 2 6A3 3 0 0 1 8 6ZM8 18A3 3 0 0 1 2 18A3 3 0 0 1 8 18ZM22 18A3 3 0 0 1 16 18A3 3 0 0 1 22 18ZM5 9V15', class: 'wm-k' }],
    ['path', { d: 'M12 6H17A2 2 0 0 1 19 8V15M14.5 3.5L12 6L14.5 8.5', class: 'wm-k' }],
  ]
}
