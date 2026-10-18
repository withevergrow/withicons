// engrave candy-bucket: tapered pail with rim, open arched handle, a lollipop and a wrapped candy above the rim; hatched shading.
export default function render() {
  const hatch = [];
  for (let i = 0; i < 6; i++) {
    const x = 12.5 + i * 1.1;
    hatch.push(`M${x.toFixed(2)} 20L${(x + 1.5).toFixed(2)} 13.75`);
  }
  return [
    ['path', { d: 'M5.25 11.5 C5.25 -0.5 18.75 -0.5 18.75 11.5', 'stroke-width': 0.9, class: 'wm-a' }],
    ['path', { d: 'M8.75 9.5 V11', class: 'wm-s' }],
    ['circle', { cx: 8.75, cy: 7.5, r: 2, class: 'wm-s' }],
    ['path', { d: 'M8.75 7.5 a.9 .9 0 1 1 .9 .9', 'stroke-width': 0.6, class: 'wm-s' }],
    ['ellipse', { cx: 15, cy: 9, rx: 1.75, ry: 1.25, class: 'wm-s' }],
    ['path', { d: 'M13.25 9 L11.9 8 V10 Z M16.75 9 L18.1 8 V10 Z', fill: 'currentColor', class: 'wm-s' }],
    ['path', { d: 'M5.25 13 L7 20.25 Q7.25 21 8 21 H16 Q16.75 21 17 20.25 L18.75 13', class: 'wm-k' }],
    ['rect', { x: 3.75, y: 11, width: 16.5, height: 2, rx: 1, class: 'wm-k' }],
    ['path', { d: hatch.join(''), 'stroke-width': 0.4, class: 'wm-shadow' }],
  ];
}
