// forge/hand/sketch/list-checks.mjs — two crisp single-stroke ticks with a sharp vertex and three straight pencil
// lines, replacing wobbly doubled checks whose arms bent and blurred at small sizes.
export default function render() {
  return [
    ['path', { d: 'M12.2 6.3Q16.6 6.15 20.9 6.25M12.15 12.25Q16.5 12.1 20.85 12.3M12.2 18.25Q16.6 18.15 20.9 18.3', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M12 6Q16.5 5.95 21 6M12 12Q16.5 12.05 21 12M12 18Q16.5 17.95 21 18', class: 'wm-k' }],
    ['path', { d: 'M2.5 6.05L4.5 8L8 4M2.5 18.05L4.5 20L8 16', 'stroke-width': 1.5, class: 'wm-a' }],
  ]
}
