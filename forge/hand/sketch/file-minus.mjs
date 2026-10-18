// forge/hand/sketch/file-minus.mjs — a clean folded-corner page with a wide, firm minus bar, replacing a short faint
// dash that read as a generic line rather than remove.
export default function render() {
  return [
    ['path', { d: 'M12.4 12.1l2.6-2.1M7.4 20l3.6-2.9M12.6 20.1l4.9-4M15.6 20.2l2.4-1.9', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M14.2 2.85Q10.6 2.75 7.25 2.85Q5.35 2.9 5.3 4.8Q5.15 12 5.3 19.25Q5.35 21.2 7.3 21.2Q12 21.35 16.75 21.2Q18.7 21.15 18.75 19.2Q18.85 13.5 18.75 7.75', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M14 2.5Q10.5 2.45 7 2.5Q5 2.55 5 4.5Q4.95 12 5 19.5Q5.05 21.5 7 21.5Q12 21.55 17 21.5Q19 21.45 19 19.5Q19.05 13.5 19 7.5Q16.5 5 14 2.5Z', class: 'wm-k' }],
    ['path', { d: 'M14 2.5Q13.95 4.25 14 6Q14.05 7.5 15.5 7.5Q17.25 7.55 19 7.5', class: 'wm-a' }],
    ['path', { d: 'M8.3 14.8Q12 14.65 15.8 14.85', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M8 14.5Q12 14.4 16 14.55', 'stroke-width': 1.75, class: 'wm-a' }],
  ]
}
