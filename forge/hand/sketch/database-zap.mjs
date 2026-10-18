// forge/hand/sketch/database-zap.mjs — pencil cylinder with one mid band and a bold closed bolt kept inside the frame,
// replacing the generated drawing whose thin bolt ran off the bottom edge and dissolved into its own pencil echo.
const sh = (d, dx, dy) => d.replace(/([MLHVZCQ ]|^)(-?\d*\.?\d+)[ ,](-?\d*\.?\d+)/g, (_, c, x, y) => `${c}${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)
const TOP = 'M4 5.5C4.05 3.85 7.6 2.5 12 2.5C16.4 2.5 19.95 3.85 20 5.5C19.95 7.15 16.4 8.5 12 8.5C7.6 8.5 4.05 7.15 4 5.5Z'
const BODY = 'M4 5.6L4.05 18.5C4.1 20.15 7.6 21.5 12 21.5L12.6 21.5M20 5.6L19.95 9.4'
const BAND = 'M4.05 12C4.1 13.65 7.4 14.95 11.6 15'
const BOLT = 'M18.6 11.1L14.2 16.9H17.15L16.55 21.4L21.25 15.6H18.2L18.6 11.1Z'
export default function render() {
  const pencil = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M6.3 18.4l1.9-1.4M8.7 19.7l1.7-1.25', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M4.3 5.3C4.4 3.6 7.9 2.25 12.3 2.3C16.6 2.35 20.1 3.7 20.2 5.4C20.1 7 16.5 8.3 12.1 8.25M3.75 5.9L3.8 18.3C3.95 19.9 7.4 21.3 11.9 21.3M20.3 5.8L20.25 9.2', ...pencil, class: 'wm-k' }],
    ['path', { d: TOP + BODY, class: 'wm-k' }],
    ['path', { d: 'M3.8 12.3C3.95 13.85 7.2 15.2 11.3 15.25', ...pencil, class: 'wm-a' }],
    ['path', { d: BAND, class: 'wm-a' }],
    ['path', { d: sh(BOLT, 0.3, -0.25), ...pencil, class: 'wm-s' }],
    ['path', { d: BOLT, 'stroke-width': 1.55, class: 'wm-s' }],
  ]
}
