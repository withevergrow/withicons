// forge/hand/sketch/notebook.mjs — a firm pencil cover with three looped binding rings hooked through the spine and
// a title line, replacing thin spine ticks that read as a clipboard list at small sizes.
export default function render() {
  return [
    ['path', { d: 'M10 14.5l4-3.2M9.5 18.6l7.4-6M12.6 20.1l5-4M16 20.2l1.9-1.5', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M8.4 2.85Q13 2.7 17.7 2.8Q19.75 2.85 19.8 4.8Q19.95 12 19.8 19.25Q19.75 21.2 17.75 21.2Q13 21.35 8.3 21.2Q6.35 21.15 6.3 19.2Q6.15 12 6.35 4.8Q6.4 2.9 8.4 2.85', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M8 2.5Q13 2.45 18 2.5Q20 2.55 20 4.5Q20.05 12 20 19.5Q19.95 21.5 18 21.5Q13 21.55 8 21.5Q6 21.45 6 19.5Q5.95 12 6 4.5Q6.05 2.5 8 2.5Z', class: 'wm-k' }],
    ['path', { d: 'M11.8 7.8Q14 7.7 16.2 7.85', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M11.5 7.5Q13.75 7.45 16 7.55', class: 'wm-a' }],
    ['path', { d: 'M8.5 6.25H4.75Q3.25 6.25 3.25 7.5Q3.25 8.75 4.75 8.75H6M8.5 11.25H4.75Q3.25 11.25 3.25 12.5Q3.25 13.75 4.75 13.75H6M8.5 16.25H4.75Q3.25 16.25 3.25 17.5Q3.25 18.75 4.75 18.75H6', class: 'wm-a' }],
  ]
}
