// forge/hand/sketch/dental-chair.mjs — a pencil dental chair with a big separate headrest pad, a thick reclined back,
// seat and leg rest, a pedestal on a foot bar and a compact overhead lamp, replacing a thin single loop whose headrest
// and tiny lamp did not parse at 16px.
const BODY = 'M4.3 7.6Q4.7 6.55 5.75 6.6Q6.75 6.65 7.15 7.5Q8.2 9.3 9.45 11.05Q12.5 11.1 15.55 11Q17.8 13.2 20.05 15.45Q20.65 16.35 19.85 17Q19.05 17.6 18.25 16.95Q16.45 15.3 14.6 13.65Q11.5 13.7 8.4 13.6Q7.6 13.6 7.2 12.9Q5.7 10.25 4.3 7.6Z'
const HEAD = 'M5.08 2.36Q5.45 3.1 5.78 3.86Q6.05 4.95 4.95 5.25Q3.95 5.5 3.42 4.94Q3.05 4.2 2.72 3.44Q2.45 2.4 3.6 2.05Q4.6 1.85 5.08 2.36Z'
const LAMP = 'M13.4 7.6Q13.6 5.15 16.1 5.1Q18.6 5.15 18.8 7.6Q16.1 7.65 13.4 7.6ZM16.1 5.1Q16.05 3.8 16.1 2.4'
function shift(d, dx, dy) {
  let i = 0
  return d.replace(/-?\d+(\.\d+)?/g, n => (Math.round((+n + (i++ % 2 ? dy : dx)) * 100) / 100).toString())
}
export default function render() {
  return [
    ['path', { d: 'M5.6 9.9L7.3 8.9M6.5 11.6L8.3 10.4M10.4 12.9L11.6 11.6M12.4 13L13.8 11.5M14.6 13.1L15.8 11.9M16.4 14.4L17.2 13.6', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: shift(BODY, 0.35, 0.4) + 'M11.95 13.9Q12 16.7 11.95 19.7M7.9 20.6Q11.9 20.5 15.9 20.65', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['path', { d: HEAD, class: 'wm-k' }],
    ['path', { d: 'M11.6 13.7Q11.65 16.75 11.6 19.9M7 20.15Q11.6 20.05 16.2 20.2', class: 'wm-k' }],
    ['path', { d: shift(LAMP, 0.3, 0.35), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: LAMP, class: 'wm-a' }],
  ]
}
