// forge/hand/sketch/love-lock.mjs — a padlock whose body is a heart: a roomy shackle floating clear above the lobes
// (a 3u gap so the two never fuse at 16-24px), a bold dot-and-slot keyhole, and two light hachures in the right lobe.
export default function render() {
  const pencil = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M15.4 16.8l2.8-2.6m-3.8-.5l1.6-1.5', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    // pencil ghost of the heart
    ['path', { d: 'M12.2 22.4C8.6 20.2 3.2 17.2 3.3 14.2C3.3 12.4 4.9 11.2 6.7 11.2C8.8 11.2 10.4 12 11.5 13.4', ...pencil, class: 'wm-k' }],
    ['path', { d: 'M12 22C8.5 19.8 3.4 17 3.4 14C3.4 12.2 4.9 11 6.8 11C9.1 11 11 12.2 12 13.5C13 12.2 14.9 11 17.2 11C19.1 11 20.6 12.2 20.6 14C20.6 17 15.5 19.8 12 22', class: 'wm-k' }],
    // keyhole: ring + slot
    ['circle', { cx: 12, cy: 16.6, r: 1.45, class: 'wm-k' }],
    ['path', { d: 'M12 18.1Q11.95 18.9 12 19.7', class: 'wm-k' }],
    // shackle, ending 3u above the lobes
    ['path', { d: 'M8.8 7.7Q8.75 6.5 8.8 5.4C8.8 3.6 10.2 2.3 12 2.3C13.8 2.3 15.2 3.6 15.2 5.4Q15.25 6.5 15.2 7.7', class: 'wm-a' }],
  ]
}
