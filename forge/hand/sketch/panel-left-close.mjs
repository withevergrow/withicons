// forge/hand/sketch/panel-left-close.mjs — a firm framed window with a hatched sidebar and a large open chevron
// pointing into it, replacing a tiny doubled chevron that blurred to a dot at 16px.
export default function render() {
  return [
    ['path', { d: 'M4.6 11.4l2.6-2.1M4.6 15.6l3.2-2.6M4.9 19.4l2.9-2.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M5.4 3.35Q12 3.2 18.7 3.3Q20.7 3.35 20.75 5.3Q20.9 12 20.75 18.75Q20.7 20.7 18.75 20.7Q12 20.85 5.3 20.7Q3.35 20.65 3.3 18.7Q3.15 12 3.3 5.3Q3.35 3.4 5.4 3.35M9.3 3.4Q9.2 12 9.35 20.6', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M5 3Q12 2.95 19 3Q21 3.05 21 5Q21.05 12 21 19Q20.95 21 19 21Q12 21.05 5 21Q3 20.95 3 19Q2.95 12 3 5Q3.05 3 5 3ZM9 3Q8.95 12 9.05 21', class: 'wm-k' }],
    ['path', { d: 'M16.75 8.35Q14.85 10.2 13 12.05Q14.85 13.9 16.7 15.75', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M16.5 8Q14.5 10 12.5 12Q14.5 14 16.5 16', 'stroke-width': 1.5, class: 'wm-a' }],
  ]
}
