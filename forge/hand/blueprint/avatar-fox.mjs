// forge/hand/blueprint/avatar-fox.mjs — the drafted fox face: one unbroken head outline with pointed ears, a forehead
// line and the white-muzzle mask line (stopped short of the nose), solid nose, no inner ears (clearance at 16/24px). The generated drawing broke the forehead into a speck between two
// control rings, dropped the muzzle (so it read as a cat or a bucket), ran the full keyline ring through both ears and
// cheeks and a centre chain down the face. Here the keyline chain is trimmed to the arcs clear of the silhouette, the
// centre line only marks above the brow and below the chin, and the only nodes sit on the two cheek tips.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    // keyline chain, trimmed clear of ears and cheeks
    ['path', { d: 'M10.8 2.07A10 10 0 0 1 13.2 2.07M13.89 2.18L14.28 2.26M10.11 2.18L9.72 2.26M21.09 7.82A10 10 0 0 1 21.82 10.1M21.93 10.79L21.97 11.19M2.91 7.82A10 10 0 0 0 2.18 10.1M2.07 10.79L2.03 11.19M18.75 19.37A10 10 0 0 1 16.81 20.77M16.18 21.08L15.82 21.24M19.52 18.59L19.25 18.88M5.25 19.37A10 10 0 0 0 7.19 20.77M7.82 21.08L8.18 21.24M4.48 18.59L4.75 18.88', ...con(0.34) }],
    // dimension line + centre marks above the brow and below the chin
    ['path', { d: 'M3.5 22.9H20.5M3.5 20.7V23.3M20.5 20.7V23.3', ...con(0.5) }],
    ['path', { d: 'M12 1.55V3.95M12 4.65V5.05M12 21.8V22.7', ...con(0.5) }],
    ['path', { d: 'M2.85 23.55L4.15 22.25M19.85 23.55L21.15 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // head: ears, brow, cheeks, chin — broken only at the cheek nodes
    ['path', { d: 'M4.27 13.88C4.76 12.84 5 11.79 5 10.75V4.75C5 3.75 5.75 3.5 6.5 4L10 7H14L17.5 4C18.25 3.5 19 3.75 19 4.75V10.75C19 11.79 19.24 12.84 19.73 13.88M19.12 16.01L16 17.75C14.5 18.5 13 19.5 12 20.5C11 19.5 9.5 18.5 8 17.75L4.88 16.01', class: 'wm-k' }],
    // muzzle mask lines, stopped well short of the nose so the two never merge
    ['path', { d: 'M5.02 14.86C6.9 14.4 8.5 14.55 9.7 15.55M18.98 14.86C17.1 14.4 15.5 14.55 14.3 15.55', class: 'wm-k' }],
    // nose, lifted to leave air above the chin
    ['path', { d: 'M10.75 16.75H13.25L12 18.25Z', fill: 'currentColor', 'stroke-width': 0.75, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // eyes
    ['path', { d: 'M9.5 12.25V12.75M14.5 12.25V12.75', class: 'wm-a' }],
    // cheek nodes
    ['path', { d: `${ring(3.5, 15.25)}${ring(20.5, 15.25)}`, color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
