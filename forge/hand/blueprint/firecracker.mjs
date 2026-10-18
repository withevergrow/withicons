// forge/hand/blueprint/firecracker.mjs — the drafted firecracker: an upright cylinder (ellipse cap, curved base, one
// diagonal paper band) with a curling fuse and a five-ray spark burst at the top right, the same composition as the
// common line drawing. The dimension line under the base carries the blueprint construction.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }

export default function render() {
  return [
    ['path', { d: 'M7.5 23H13.5M7.5 21.7V23.3M13.5 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M6.85 23.65L8.15 22.35M12.85 23.65L14.15 22.35', ...tick }],
    // axis of the cylinder
    ['path', { d: 'M10.5 12.5V14M10.5 22V22.6', ...con(0.5) }],
    ['path', { d: 'M7.5 9.5V20.5A3 1.5 0 0 0 13.5 20.5V9.5M13.5 9.5A3 1.5 0 1 1 7.5 9.5A3 1.5 0 1 1 13.5 9.5ZM7.5 18C9.5 18 11.75 15.75 13.5 13.5', class: 'wm-k' }],
    ['path', { d: 'M10.5 9.5C10.5 7.75 12.75 7 15.5 7.6', class: 'wm-a' }],
    ['path', { d: 'M17.5 3.6V2.25M20.25 5L21.4 4.45M20.25 8.5L21.4 9.05M17.5 9.9V11.25M14.75 5L13.6 4.45', class: 'wm-a' }],
    ['circle', { cx: 17.5, cy: 6.75, r: 0.8, color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
