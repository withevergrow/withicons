// forge/hand/sketch/heart-handshake.mjs — a heavier pencil heart holding one clean grip line and two short finger ticks
// with wide gaps, replacing the generated drawing whose doubled interior contours and hatching turned muddy at 16px.
const sh = (d, dx, dy) => d.replace(/([MLHVZCQ ]|^)(-?\d*\.?\d+)[ ,](-?\d*\.?\d+)/g, (_, c, x, y) => `${c}${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)
const HEART = 'M12 20.4C12 20.4 3.05 15.2 3 8.95C3 6.25 5.1 4.05 7.8 4.05C9.6 4 11.1 5 12 6.5C12.9 5 14.45 4 16.2 4.05C18.9 4.05 21 6.2 21 8.9C20.95 15.25 12 20.4 12 20.4'
const GRIP = 'M12 6.5L9.05 9.45C8.35 10.2 8.4 11.35 9.15 12.05C9.85 12.7 10.95 12.65 11.6 11.95L13.3 10.25C14.05 9.55 15.2 9.5 16 10.2L19.35 12.95'
export default function render() {
  const pencil = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M5.4 11.9l1.5-1.15M6.9 14.3l1.5-1.15', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: sh(HEART, 0.3, -0.25), ...pencil, class: 'wm-k' }],
    ['path', { d: HEART, 'stroke-width': 1.5, class: 'wm-k' }],
    ['path', { d: sh(GRIP, 0.25, 0.3), ...pencil, class: 'wm-a' }],
    ['path', { d: GRIP + 'M16.2 14.35L14.75 12.9M13.55 16.6L12.15 15.2', class: 'wm-a' }],
  ]
}
