// forge/hand/sketch/wifi-off.mjs — three whole pencil arcs and a dot, broken only where one clean slash crosses them with
// clear gaps, replacing the generated drawing whose arcs fragmented into short dashes that crowded the slash.
export default function render() {
  const f = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M5.55 12.65A8.9 8.9 0 0 1 7.75 10.7M12.6 9.55A8.9 8.9 0 0 1 18.45 12.6M2.5 10.05A12.9 12.9 0 0 1 4.6 8.05M9.95 5.75A12.9 12.9 0 0 1 21.5 10.05', ...f, class: 'wm-k' }],
    ['path', { d: 'M8.36 15.45A4.75 4.75 0 0 1 10.22 14.1M5.3 12.88A8.75 8.75 0 0 1 7.63 10.92M12.46 9.76A8.8 8.8 0 0 1 15.84 10.64A8.7 8.7 0 0 1 18.7 12.88M2.23 10.3A12.75 12.75 0 0 1 4.51 8.19M9.79 5.94A12.8 12.8 0 0 1 16.36 6.52A12.7 12.7 0 0 1 21.77 10.3', class: 'wm-k' }],
    ['circle', { cx: 12, cy: 18.55, r: 0.6, fill: 'currentColor', class: 'wm-k' }],
    ['path', { d: 'M3.4 2.95Q12.1 11.9 20.9 20.6', ...f, class: 'wm-s' }],
    ['path', { d: 'M3 3Q12 11.95 21 21', class: 'wm-s' }],
  ]
}
