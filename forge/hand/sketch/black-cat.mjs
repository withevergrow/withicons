// forge/hand/sketch/black-cat.mjs: arched Halloween cat in one clean pencil silhouette (tail hooked up, big head with
// two pointed ears, hind and front legs with a belly arch) and two bold slit-pupil eyes; no collar, no bow, no scribble.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const BODY = 'M12.9 3.2L14.9 5.1Q16.9 4.7 18.9 5.1L20.9 3.2Q21.9 6.6 21 9.4Q20.2 11.2 17.9 11.4L17.7 13.4L17.9 20.5L15.3 20.5L15.1 17Q11.7 14.4 8.7 17L8.5 20.5L5.9 20.5Q5.2 15.5 6.3 12.2Q7.6 8.4 10.8 8.1Q12.2 8.1 12.7 8.9Q12.3 6 12.9 3.2'
const TAIL = 'M6 14Q2.8 13.2 2.8 9.4Q2.8 6.2 4.8 4.6'
export default function render() {
  return [
    ['path', { d: ghost(BODY, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['path', { d: TAIL, class: 'wm-a' }],
    ['path', { d: 'M14 7.9Q15.1 6.6 16.2 7.9Q15.1 9.2 14 7.9ZM17.4 7.9Q18.5 6.6 19.6 7.9Q18.5 9.2 17.4 7.9Z', 'stroke-width': 0.8, class: 'wm-s' }],
    ['path', { d: 'M15.1 7V8.8M18.5 7V8.8', 'stroke-width': 1.1, class: 'wm-s' }],
  ]
}
