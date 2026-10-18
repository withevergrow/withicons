// forge/hand/sketch/columns.mjs: one firm frame with a single divider stroke (no doubled divider), hachure on the
// right pane only so the two panes read as two columns, not a book or window.
export default function render() {
  const frame = 'M5.2 3.1Q12 2.8 18.8 3.1Q21 3.3 20.9 5.4Q21.2 12 20.9 18.7Q20.9 20.9 18.7 20.9Q12 21.2 5.3 20.9Q3.1 20.8 3.1 18.6Q2.8 12 3.1 5.3Q3.2 3.2 5.2 3.1'
  const ghost = 'M5.5 3.5Q12 3.3 18.6 3.5Q20.6 3.7 20.5 5.6Q20.8 12 20.5 18.5Q20.5 20.5 18.5 20.5Q12 20.8 5.5 20.5Q3.5 20.5 3.5 18.4Q3.2 12 3.5 5.5Q3.6 3.7 5.5 3.5'
  const hatch = 'M14.4 8.4l3.8-3.1M14.3 12.2l4.6-3.8M14.4 16.1l4.5-3.7M14.7 19l3.9-3.2'
  return [
    ['path', { d: hatch, 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: ghost, 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: frame, class: 'wm-k' }],
    ['path', { d: 'M11.9 3.2Q11.8 12 12 20.8', class: 'wm-a' }],
  ]
}
