// forge/hand/sketch/copy-check.mjs — a bold front sheet with a big sharp tick and a full-weight back sheet edge shaded
// only in its free corner, replacing thin doubled outlines whose back sheet and small check vanished at 16px.
export default function render() {
  return [
    ['path', { d: 'M4.8 7.7L7.7 4.8M4.7 10.7L10.7 4.7', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M15.05 5.1Q14.95 3.1 13 3.05Q9 2.95 5.05 3.05Q3.05 3.1 3.05 5.1Q2.95 9 3.05 12.95Q3.1 14.9 5 14.95', class: 'wm-a' }],
    ['path', { d: 'M11.05 9.05Q15 8.95 18.95 9.05Q20.95 9.1 20.95 11.05Q21.05 15 20.95 18.95Q20.9 20.95 18.95 20.95Q15 21.05 11.05 20.95Q9.05 20.9 9.05 18.95Q8.95 15 9.05 11.05Q9.1 9.15 11.3 9', 'stroke-width': 1.45, class: 'wm-k' }],
    ['path', { d: 'M12.2 15.05L14.5 17.4L18 12.7', 'stroke-width': 1.7, class: 'wm-s' }],
  ]
}
