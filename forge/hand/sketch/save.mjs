// forge/hand/sketch/save.mjs — a pencil floppy whose shutter is a square metal plate with its slot, hung from the top edge,
// and a separate label, replacing a rounded collar-like shutter that read as a tank top.
export default function render() {
  return [
    ['path', { d: 'M15.9 12.1l2.9-2.6M17.6 12.2l1.9-1.7', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M5.4 3.45H15.6L20.55 8.4M3.45 18.6V5.6', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M5 3.1Q10.4 2.95 15.9 3.1L20.9 8.1Q21 13.5 20.9 19Q20.9 20.9 19 20.9Q12 21.05 5 20.9Q3.1 20.9 3.1 19Q3 12 3.1 5Q3.1 3.1 5 3.1Z', class: 'wm-k' }],
    ['path', { d: 'M8 3.2V7.1Q8 8 8.9 8H13.9Q14.8 8 14.8 7.1V3.2M12.6 4.7V6.4', class: 'wm-a' }],
    ['path', { d: 'M6.5 20.8V14.9Q6.5 13.5 7.9 13.5Q12 13.4 16.1 13.5Q17.5 13.5 17.5 14.9V20.8', class: 'wm-a' }],
  ]
}
