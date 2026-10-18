// forge/hand/sketch/traffic-cone.mjs — a pencil cone on a wide flat base slab, its orange sections hatched and two
// narrow bands left white, replacing a bare triangle on a line that read as a letter A or a pyramid.
export default function render() {
  return [
    ['path', { d: 'M10.7 7.1l2.5-2.1M12.7 7.1l1.3-1.1M8.7 12.1l2.9-2.4M11.5 12.1l2.9-2.4M14.2 12.1l1.3-1.1M7.5 18.1l3.5-2.9M10.7 18.1l3.5-2.9M13.9 18.1l3-2.5', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M6.45 18.25L10.65 4.4M13.4 3.8L17.65 18.3M3.3 18.8Q12 18.65 20.75 18.85', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M6.1 18.5Q8.2 11.3 10.4 4.1Q10.6 3.5 11.2 3.5Q12 3.45 12.8 3.5Q13.4 3.5 13.6 4.1Q15.8 11.3 17.9 18.5', class: 'wm-k' }],
    ['path', { d: 'M3.6 18.5Q12 18.4 20.4 18.5Q21 18.5 21 19.1V20.4Q21 21 20.4 21Q12 21.1 3.6 21Q3 21 3 20.4V19.1Q3 18.5 3.6 18.5Z', class: 'wm-k' }],
    ['path', { d: 'M9.4 7.5Q12 7.42 14.6 7.5M8.85 9.25Q12 9.33 15.15 9.25M7.9 12.5Q12 12.42 16.1 12.5M7.35 14.25Q12 14.33 16.65 14.25', class: 'wm-a' }],
  ]
}
