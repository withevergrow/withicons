// forge/hand/sketch/building-2.mjs — steady tower and lower wing, ground line, clear window blocks and an arched door.
export default function render() {
  const f = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M3.9 21.3L3.8 5.1Q3.8 3.2 5.7 3.1L10.9 3.1Q12.8 3.2 12.8 5.1L12.7 21.3M12.8 9.8L18.8 9.8Q20.8 9.9 20.8 11.9L20.7 21.3', ...f, class: 'wm-k' }],
    ['path', { d: 'M3.6 21.6L3.5 4.8Q3.5 2.9 5.4 2.8L10.6 2.8Q12.5 2.9 12.5 4.8L12.4 21.6M12.5 9.5L18.5 9.5Q20.5 9.6 20.5 11.6L20.4 21.6', class: 'wm-k' }],
    ['path', { d: 'M1.8 21.7Q12 21.9 22.2 21.6', class: 'wm-k' }],
    ['path', { d: 'M6.4 6.2h.6M9 6.2h.6M6.4 10h.6M9 10h.6M6.4 13.8h.6M9 13.8h.6M15.2 13.2h.6M17.8 13.2h.6M15.2 17h.6M17.8 17h.6', 'stroke-width': 1.8, class: 'wm-a' }],
    ['path', { d: 'M6.6 21.5V19.2Q6.6 17.6 8 17.6Q9.4 17.6 9.4 19.2V21.5', class: 'wm-a' }],
  ]
}
