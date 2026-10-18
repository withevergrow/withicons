// forge/hand/sketch/circuit-board.mjs — the line design in pencil: rounded board, one trace from the top edge down to the
// lower-right pad and one from the bottom edge up to the top-left pad, with a pencil shadow and a little hatching.
export default function render() {
  const f = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M4.6 18.6l1.6 1.6M4.5 15.6l3.2 3.3M17.9 5.3l1.4 1.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M5.4 3.35L19.3 3.25C20.6 3.3 21.35 4.1 21.35 5.5L21.4 19.2C21.3 20.5 20.5 21.3 19.1 21.35L5.2 21.3C3.9 21.3 3.3 20.5 3.25 19.1L3.2 5.4C3.3 4.1 4.1 3.35 5.4 3.35Z', ...f, class: 'wm-k' }],
    ['path', { d: 'M5.1 3.05L19 3C20.3 3 21.05 3.8 21.05 5.2L21 19C21 20.3 20.2 21 18.9 21L5 21.05C3.7 21 3 20.3 3 19L3.05 5.1C3.1 3.8 3.9 3.05 5.3 3.1', class: 'wm-k' }],
    ['path', { d: 'M8 9.5L7.95 13.4L11.05 16.55L11 21', class: 'wm-a' }],
    ['path', { d: 'M16.05 14.5L16 10.6L13 7.55L13.05 3.05', class: 'wm-a' }],
    ['path', { d: 'M9.5 8.1C9.5 7.2 8.8 6.5 7.95 6.5C7.1 6.5 6.45 7.2 6.5 8.05C6.5 8.85 7.15 9.55 8.05 9.5C8.9 9.5 9.55 8.8 9.4 7.9', class: 'wm-a' }],
    ['path', { d: 'M17.5 16.1C17.5 15.2 16.8 14.5 15.95 14.5C15.1 14.5 14.45 15.2 14.5 16.05C14.5 16.85 15.15 17.55 16.05 17.5C16.9 17.5 17.55 16.8 17.4 15.9', class: 'wm-a' }],
  ]
}
