// forge/hand/sketch/battery-charging.mjs — one closed pencil battery with a bold outlined bolt inside and a terminal nub,
// replacing the generated body split around a thin crossing zigzag that fragmented at 16px.
export default function render() {
  const f = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M15 16.4l2.3-1.65m-.2-2.5l.6-.45M8.4 6.6l1.3-.1', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M4.4 6.35L16.9 6.25C18.2 6.3 19.2 7.2 19.25 8.5L19.3 15.7C19.25 17 18.3 18 17 18L4.2 18.1C2.9 18.05 1.95 17.1 1.9 15.8L1.85 8.6C1.9 7.3 3 6.35 4.4 6.35Z', ...f, class: 'wm-k' }],
    ['path', { d: 'M4.1 6.05L17 6C18.2 6 19.05 6.9 19.05 8.1L19 15.95C19 17.1 18.1 17.95 16.95 17.95L4.05 18C2.9 18 2 17.1 2 15.9L2.05 8.05C2.1 6.9 2.95 6.05 4.4 6.1', class: 'wm-k' }],
    ['path', { d: 'M22.1 10.2Q22 12 22.05 13.8', class: 'wm-a' }],
    ['path', { d: 'M12.45 8.35L8.35 12.85H11L9.8 15.75L13.85 11.5H11.3L12.35 8.5', ...f, class: 'wm-s' }],
    ['path', { d: 'M12.2 8L8 12.7H10.8L9.5 16L13.6 11.3H11L12.2 8Z', class: 'wm-s' }],
  ]
}
