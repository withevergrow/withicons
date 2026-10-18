const ring = 'M12 3.4Q15.6 3.3 18 5.9Q20.6 8.5 20.5 12.2Q20.4 15.8 17.8 18.2Q15.3 20.6 11.8 20.5Q8.3 20.4 5.9 17.9Q3.5 15.4 3.6 11.8Q3.7 8.3 6.2 5.8Q8.6 3.5 12.6 3.5';
export default function render() {
  return [
    ['path', { d: 'M13.9 18.3l1.3-1.2M15.6 16.9l1.4-1.4M17 15l1-1.1', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: ring, 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: ring, class: 'wm-k' }],
    ['path', { d: 'M10.3 8.4Q12.1 10.3 14 12Q12.1 13.8 10.3 15.6', class: 'wm-a' }],
  ];
}
