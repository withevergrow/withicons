// forge/hand/sketch/chart-column-stacked.mjs — three wide pencil columns, each split by horizontal dividers into stacked segments,
// standing on a wobbly baseline; a faint ghost pass and one sparse hatch stroke in the top segment only (stays clean at 16px).
export default function render() {
  const f = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M5.6 11.3l1.5-1.4M12.2 6l1.5-1.4M18.2 8.4l1.5-1.4', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M3.5 20.2L3.45 11.3C3.5 10.6 3.9 10.4 4.4 10.4L7.2 10.35C7.9 10.4 8.3 10.7 8.3 11.4L8.25 20.2M9.5 20.2L9.45 5.6C9.5 4.9 9.9 4.7 10.4 4.7L13.2 4.65C13.9 4.7 14.3 5 14.3 5.7L14.25 20.2M15.5 20.2L15.45 8.7C15.5 8 15.9 7.8 16.4 7.8L19.2 7.75C19.9 7.8 20.3 8.1 20.3 8.8L20.25 20.2', ...f, class: 'wm-k' }],
    ['path', { d: 'M3.2 20.1L3.15 11C3.2 10.2 3.7 10 4.2 10L7 9.95C7.7 10 8.05 10.4 8 11.1L8.05 20.1', class: 'wm-k' }],
    ['path', { d: 'M9.2 20.1L9.15 5.3C9.2 4.5 9.7 4.3 10.2 4.3L13 4.25C13.7 4.3 14.05 4.7 14 5.4L14.05 20.1', class: 'wm-k' }],
    ['path', { d: 'M15.2 20.1L15.15 8.4C15.2 7.6 15.7 7.4 16.2 7.4L19 7.35C19.7 7.4 20.05 7.8 20 8.5L20.05 20.1', class: 'wm-k' }],
    ['path', { d: 'M3.3 15.6L8.1 15.5M9.3 9.6L14.1 9.7M9.3 14.4L14.1 14.3M15.3 14.3L20.1 14.4', 'stroke-width': 1, class: 'wm-a' }],
    ['path', { d: 'M2 20.7L8 20.55L14 20.8L22 20.6', class: 'wm-a' }],
  ]
}
