// forge/hand/blueprint/holi-splash.mjs — the drafted Holi splat: one irregular many-lobed splash outline with a hollow
// centre and two drip dots, the same blob as the common line drawing (the generated sunburst-with-ruler read as a
// sun). Round joins keep the sharp lobes from spiking; the dimension line under the splat is the blueprint construction.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const ring = (cx, cy, r) => ({ cx, cy, r, color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-s' })

export default function render() {
  return [
    ['path', { d: 'M2 23H22M2 21.7V23.3M22 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M1.35 23.65L2.65 22.35M21.35 23.65L22.65 22.35', ...tick }],
    ['path', { d: 'M11.36 5.93 C11.59 5.17 11.78 2.6 12 2.6 C12.22 2.6 12.33 5.14 12.64 5.93 C12.95 6.72 13.33 7.05 13.83 7.24 C14.33 7.43 15.05 7.19 15.59 7.06 C16.12 6.94 16.79 6.36 16.95 6.5 C17.11 6.65 16.61 7.39 16.53 7.92 C16.46 8.45 16.27 9.16 16.5 9.61 C16.74 10.05 17.15 10.33 17.92 10.52 C18.69 10.72 20.98 10.52 21.01 10.73 C21.04 10.95 18.79 11.35 18.1 11.79 C17.4 12.23 17.08 12.73 16.93 13.32 C16.77 13.91 16.99 14.66 17.17 15.23 C17.35 15.8 18.12 16.51 17.99 16.68 C17.86 16.85 16.95 16.3 16.39 16.24 C15.83 16.18 15.13 16.06 14.7 16.33 C14.28 16.59 14.02 16.99 13.89 17.8 C13.75 18.61 14.15 21.05 13.93 21.1 C13.72 21.14 13.12 18.76 12.64 18.07 C12.16 17.37 11.68 17.12 11.11 17.02 C10.55 16.92 9.84 17.27 9.33 17.48 C8.81 17.7 8.26 18.39 8.08 18.28 C7.89 18.16 8.26 17.34 8.24 16.81 C8.23 16.27 8.29 15.54 7.98 15.14 C7.67 14.74 7.18 14.55 6.43 14.48 C5.67 14.41 3.6 14.96 3.54 14.75 C3.47 14.54 5.46 13.8 6.03 13.27 C6.61 12.74 6.87 12.21 6.91 11.64 C6.95 11.07 6.56 10.42 6.27 9.91 C5.97 9.41 5.07 8.86 5.17 8.67 C5.26 8.47 6.3 8.79 6.83 8.77 C7.35 8.74 8 8.81 8.27 8.52 C8.54 8.23 8.51 7.74 8.41 7.06 C8.32 6.39 7.51 4.66 7.7 4.55 C7.89 4.44 9.01 6 9.52 6.43 C10.03 6.86 10.37 7.16 10.68 7.07 C10.99 6.99 11.14 6.69 11.36 5.93 Z', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M12.48 9.29 C13.69 9.58 15.15 10.6 15.24 11.72 C15.32 12.83 14.12 13.83 12.86 14.35 C11.6 14.87 10.19 14.95 9.51 14.09 C8.83 13.23 9.09 11.48 9.75 10.42 C10.4 9.37 11.27 9.01 12.48 9.29 Z', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['circle', { cx: 15.44, cy: 3.04, r: 0.85, class: 'wm-s' }],
    ['circle', { cx: 17.23, cy: 20.05, r: 0.8, class: 'wm-s' }],
    ['circle', { cx: 2.52, cy: 11.34, r: 0.85, class: 'wm-s' }],
  ]
}
