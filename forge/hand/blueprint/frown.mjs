// forge/hand/blueprint/frown.mjs — the drafted frown: a clean face circle with the eyes and the downturned mouth left
// completely clear. The generated drawing ran dashed crosshair lines through the face so it read as a target or gauge;
// here the crosshair is cut down to four short tick marks outside the circle and nothing touches the features.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (d, w = 0.45, o = 0.5) => ['path', { d, color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': o, class: 'wm-deco' }]

export default function render() {
  return [
    con('M12 .6V2M12 22V23.4M.6 12H2M22 12H23.4'),
    con('M3.9 3.9L4.8 4.8M20.1 3.9L19.2 4.8M3.9 20.1L4.8 19.2M20.1 20.1L19.2 19.2', 0.5, 0.75),
    ['path', { d: 'M21 12A9 9 0 0 1 3 12A9 9 0 0 1 21 12Z', class: 'wm-k' }],
    ['path', { d: 'M8.5 8.75V11.25M15.5 8.75V11.25M7.75 17.25A5.25 5.25 0 0 1 16.25 17.25', class: 'wm-a' }],
  ]
}
