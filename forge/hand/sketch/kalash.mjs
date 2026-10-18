// forge/hand/sketch/kalash.mjs — a round pencil pot with a narrow neck under a wide flat mouth rim, a round coconut with its stalk and
// two open mango leaves, replacing the generated drawing that read as a bowl or bell with a crown on top.
const sh = (d, dx, dy) => d.replace(/([MLHVZCQ ]|^)(-?\d*\.?\d+)[ ,](-?\d*\.?\d+)/g, (_, c, x, y) => `${c}${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)
const POT = 'M9.3 12.1C9.3 13.1 4.9 14.1 4.5 16.9C4.25 19.5 7.6 21.5 12 21.5C16.4 21.5 19.75 19.5 19.5 16.9C19.1 14.1 14.7 13.1 14.7 12.1'
const RIM = 'M7.3 10.25H16.7C17.2 10.25 17.6 10.65 17.6 11.15C17.6 11.65 17.2 12.05 16.7 12.05H7.3C6.8 12.05 6.4 11.65 6.4 11.15C6.4 10.65 6.8 10.25 7.3 10.25Z'
const BAND = 'M5.95 17.15C9.6 18.15 14.4 18.15 18.05 17.15'
const TOPS = 'M9.6 10.2C9.05 7.3 10.2 4.8 12 4.8C13.8 4.8 14.95 7.3 14.4 10.2M12 4.8L12.3 3.1M8.1 10.2C7.15 8.3 5.25 7.05 2.5 7.05C3.2 9.2 5.2 10.25 8.1 10.2M15.9 10.2C16.85 8.3 18.75 7.05 21.5 7.05C20.8 9.2 18.8 10.25 15.9 10.2'
export default function render() {
  const pencil = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M13.4 16.1l1.9-1.35M15.9 16.4l1.4-1', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: sh(POT + RIM + BAND, 0.3, -0.25), ...pencil, class: 'wm-k' }],
    ['path', { d: POT + RIM + BAND, class: 'wm-k' }],
    ['path', { d: sh(TOPS, 0.3, -0.25), ...pencil, class: 'wm-a' }],
    ['path', { d: TOPS, class: 'wm-a' }],
  ]
}
