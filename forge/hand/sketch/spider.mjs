// forge/hand/sketch/spider.mjs — eight clean, single-stroke bent legs fanned wide around a round head and oval abdomen,
// with no pencil doubling on the legs, so they stay eight distinct segments at 16px instead of a scribble.
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${Math.round((+x + dx) * 100) / 100} ${Math.round((+y + dy) * 100) / 100}`)
const BODY = 'M11.7 11.3Q15.25 11.2 15.3 15Q15.25 18.75 12 18.8Q8.75 18.75 8.7 15Q8.75 11.35 12.7 11.2' +
  'M11.8 7.35Q13.9 7.3 13.95 9.25Q13.9 11.15 12 11.2Q10.1 11.15 10.05 9.25Q10.1 7.4 12.5 7.3'
const LEGS = 'M13.6 10.25L16.75 6.7L20.1 8.05M14.6 12.75L18.75 11L21.4 13.4M15.1 16L19.05 16.8L20.85 19.65M13.2 18.45L16.3 20.3L16.85 21.9' +
  'M10.4 10.25L7.25 6.7L3.9 8.05M9.4 12.75L5.25 11L2.6 13.4M8.9 16L4.95 16.8L3.15 19.65M10.8 18.45L7.7 20.3L7.15 21.9'
export default function render() {
  return [
    ['path', { d: 'M12.3 17.4L14 16.05', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: g(BODY), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['path', { d: LEGS, class: 'wm-a' }],
    ['path', { d: 'M12 1.6Q12.1 4.5 12 7.3', class: 'wm-s' }],
  ]
}
