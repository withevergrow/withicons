// forge/hand/sketch/split.mjs — one firm stem forking at a raised junction into two clean 45-degree branches with
// single-stroke corner heads, replacing thin wobbling stems and head ticks that blurred the Y at 16px.
export default function render() {
  return [
    ['path', { d: 'M12.35 20.6Q12.15 16.6 12.3 13.1', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M12 21Q11.85 16.75 12 12.5Q8.4 8.9 5.3 5.8M12 12.5Q15.6 8.9 18.7 5.8', 'stroke-width': 1.45, class: 'wm-k' }],
    ['path', { d: 'M4.5 10.5Q4.45 7.75 4.5 5Q7.25 4.95 10 5M19.5 10.5Q19.55 7.75 19.5 5Q16.75 5.05 14 5', class: 'wm-a' }],
  ]
}
