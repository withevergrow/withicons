const f = (n) => Math.round(n * 100) / 100;
const rose = (cx, cy, r) =>
  `M${f(cx)} ${f(cy - r)}a${r} ${r} 0 1 1 0 ${f(2 * r)}a${r} ${r} 0 1 1 0-${f(2 * r)}Z` +
  `M${f(cx + 0.3)} ${f(cy - 1.8)}A1.8 1.8 0 0 0 ${f(cx + 0.3)} ${f(cy + 1.8)}A2.6 2.6 0 0 1 ${f(cx + 0.3)} ${f(cy - 1.8)}Z` +
  `M${f(cx - 0.1)} ${f(cy - 0.9)}A.9 .9 0 0 1 ${f(cx - 0.1)} ${f(cy + 0.9)}A1.3 1.3 0 0 0 ${f(cx - 0.1)} ${f(cy - 0.9)}Z`;
export default function render() {
  return [
    ['path', { class: 'wm-deco', d: 'M7.6 14.4Q4 15.6 2.6 13.4Q5.6 12 7.6 14.4ZM16.4 14.4Q20 15.6 21.4 13.4Q18.4 12 16.4 14.4Z' }],
    ['path', { class: 'wm-k', d: rose(12, 5.4, 3.3), 'fill-rule': 'evenodd' }],
    ['path', { class: 'wm-k', d: rose(6.4, 9.8, 3), 'fill-rule': 'evenodd' }],
    ['path', { class: 'wm-k', d: rose(17.6, 9.8, 3), 'fill-rule': 'evenodd' }],
    ['path', { class: 'wm-k', d: 'M6.8 13.6h10.4l-.9 1.8H7.7ZM9.3 18.6h5.4l-1.9 3.8a.9.9 0 0 1-1.6 0ZM8.6 13.95h2.2a.3 .3 0 0 1 0 .6H8.6a.3 .3 0 0 1 0-.6Z', 'fill-rule': 'evenodd' }],
    ['path', { class: 'wm-a', d: 'M11.2 17L7.6 15.8V18.2ZM12.8 17L16.4 15.8V18.2ZM12 16.2a.8.8 0 1 1 0 1.6a.8.8 0 1 1 0-1.6Z' }],
  ];
}
