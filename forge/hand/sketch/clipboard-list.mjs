// forge/hand/sketch/clipboard-list.mjs: clipboard with a rounded clip and three clearly separate rows: bold bullet
// dots plus short clean dashes; no body hachure (a few strokes only in the bottom-right corner).
export default function render() {
  const body = 'M8.4 4.6Q7.4 4.5 6.6 4.6Q4.7 4.8 4.6 6.7Q4.4 13 4.6 19.4Q4.7 21.3 6.6 21.4Q12 21.6 17.4 21.4Q19.3 21.3 19.4 19.4Q19.6 13 19.4 6.7Q19.3 4.8 17.4 4.6Q16.4 4.5 15.6 4.6'
  const ghost = 'M8.1 4.9Q7.2 4.8 6.4 4.9Q4.5 5.1 4.4 7Q4.2 13 4.4 19.7Q4.5 21.5 6.4 21.7Q12 21.9 17.2 21.7Q19.1 21.6 19.2 19.7'
  const clip = 'M9.5 2.6Q12 2.4 14.5 2.6Q15.5 2.7 15.6 3.6V5.4Q15.5 6.4 14.5 6.5Q12 6.7 9.5 6.5Q8.5 6.4 8.4 5.4V3.6Q8.5 2.7 9.5 2.6Z'
  return [
    ['path', { d: 'M14.6 20.6l3-2.4M12.4 20.7l1.6-1.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: ghost, 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: body, class: 'wm-k' }],
    ['path', { d: clip, class: 'wm-a' }],
    ['path', { d: 'M8.5 10.5h.01M8.5 14h.01M8.5 17.5h.01', 'stroke-width': 1.9, class: 'wm-a' }],
    ['path', { d: 'M11.6 10.5Q13.6 10.3 15.8 10.5M11.6 14Q13.7 13.8 15.8 14M11.6 17.5Q13 17.4 14.4 17.5', class: 'wm-a' }],
  ]
}
