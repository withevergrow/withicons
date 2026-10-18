// forge/hand/sketch/user-x.mjs — pencil bust with a larger, heavier X badge (6u span) so the "remove" reads at 16px
// instead of the generated small, thin cross that blurred into a speck.
export default function render() {
  const f = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M8.4 9.9l2.4-1.75m-.2-1.9l1-.75M8.9 19.7l3.2-2.35m.2 2.75l1.7-1.25', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M8.2 4.15C10.4 3.9 12.3 5.5 12.25 7.7C12.2 9.9 10.6 11.35 8.4 11.3C6.3 11.25 4.75 9.7 4.8 7.5C4.85 5.6 6.1 4.3 7.6 4.05M2.4 21.5C2.3 20.2 2.2 19.6 2.35 19C2.8 16.8 4.5 15.3 6.8 15.3L10.7 15.2C12.9 15.3 14.7 17.1 14.8 19.5L14.75 21.6', ...f, class: 'wm-k' }],
    ['path', { d: 'M8.6 4C10.7 4 12.15 5.6 12.1 7.6C12.05 9.7 10.5 11.2 8.5 11.2C6.4 11.2 4.9 9.6 4.9 7.55C4.9 5.5 6.5 3.95 8.9 4.1M2.1 21.3C2 20.5 2 19.9 2.05 19.4C2.2 16.9 4.1 15.1 6.6 15.05L10.5 15C13 15 14.95 16.9 14.95 19.4L14.9 21.3', class: 'wm-k' }],
    ['path', { d: 'M16.6 7.5Q19.1 10.1 21.6 12.75M21.75 7.4Q19.2 10 16.5 12.6', ...f, class: 'wm-s' }],
    ['path', { d: 'M16.2 7.15Q18.9 9.85 21.85 12.85M21.8 7.1Q19.05 9.9 16.15 12.9', 'stroke-width': 1.6, class: 'wm-s' }],
  ]
}
