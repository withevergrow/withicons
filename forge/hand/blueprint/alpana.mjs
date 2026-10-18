// forge/hand/blueprint/alpana.mjs — the drafted alpana: five flowing swirl hooks around a ring-and-dot centre with a
// ring of five dots, the same pinwheel as the common line drawing (the generated four leaf shapes lost the swirl).
// The dimension line under the motif is the blueprint construction.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const DOTS = [[19.39, 6.43], [19.58, 17.31], [9.3, 20.85], [2.75, 12.16], [8.99, 3.25]]

export default function render() {
  return [
    ['path', { d: 'M2 23H22M2 21.7V23.3M22 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M1.35 23.65L2.65 22.35M21.35 23.65L22.65 22.35', ...tick }],
    ['path', { d: 'M12 9.07 C10.88 7.5 10.88 5.48 12.23 4.35 C13.58 3.22 15.83 3.67 16.05 5.48 C16.27 7.05 14.7 7.95 13.8 7.05M14.79 11.09 C15.93 9.54 17.85 8.92 19.35 9.85 C20.84 10.79 21.11 13.07 19.45 13.84 C18.03 14.53 16.69 13.32 17.26 12.18M13.72 14.37 C15.55 14.98 16.74 16.62 16.31 18.32 C15.88 20.03 13.8 20.99 12.56 19.66 C11.46 18.51 12.2 16.86 13.45 17.06M10.28 14.37 C10.26 16.3 9.07 17.93 7.32 18.05 C5.56 18.17 4.01 16.49 4.89 14.89 C5.64 13.49 7.44 13.69 7.63 14.95M9.21 11.09 C7.37 11.67 5.45 11.05 4.8 9.42 C4.14 7.78 5.26 5.78 7.05 6.13 C8.61 6.41 8.98 8.18 7.85 8.76', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 2.9, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 0.9, fill: 'currentColor', class: 'wm-a' }],
    ...DOTS.map(([cx, cy]) => ['circle', { cx, cy, r: 0.8, fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }]),
  ]
}
