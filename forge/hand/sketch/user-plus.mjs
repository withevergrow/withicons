// forge/hand/sketch/user-plus.mjs — pencil bust with a larger, heavier plus badge (arms 6.8u) so the "add" reads at 16px
// instead of the generated small, thin cross that faded beside the head.
export default function render() {
  const f = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M8.4 9.9l2.4-1.75m-.2-1.9l1-.75M8.9 19.7l3.2-2.35m.2 2.75l1.7-1.25', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M8.2 4.15C10.4 3.9 12.3 5.5 12.25 7.7C12.2 9.9 10.6 11.35 8.4 11.3C6.3 11.25 4.75 9.7 4.8 7.5C4.85 5.6 6.1 4.3 7.6 4.05M2.4 21.5C2.3 20.2 2.2 19.6 2.35 19C2.8 16.8 4.5 15.3 6.8 15.3L10.7 15.2C12.9 15.3 14.7 17.1 14.8 19.5L14.75 21.6', ...f, class: 'wm-k' }],
    ['path', { d: 'M8.6 4C10.7 4 12.15 5.6 12.1 7.6C12.05 9.7 10.5 11.2 8.5 11.2C6.4 11.2 4.9 9.6 4.9 7.55C4.9 5.5 6.5 3.95 8.9 4.1M2.1 21.3C2 20.5 2 19.9 2.05 19.4C2.2 16.9 4.1 15.1 6.6 15.05L10.5 15C13 15 14.95 16.9 14.95 19.4L14.9 21.3', class: 'wm-k' }],
    ['path', { d: 'M19.35 7Q19.2 10.1 19.3 13.1M16 10.35Q19.1 10.2 22 10.4', ...f, class: 'wm-s' }],
    ['path', { d: 'M19.05 6.6Q18.95 10 19 13.4M15.6 10.05Q18.95 9.9 22.4 10', 'stroke-width': 1.6, class: 'wm-s' }],
  ]
}
