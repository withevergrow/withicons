// forge/hand/sketch/book.mjs — hard cover with a drawn spine and a page block (cover curve + one page line) so it reads
// as a bound book, not a notebook; hachure only on the cover face.
export default function render() {
  return [
    ['path', { d: 'M10 12.5l7.3-5.7M10.2 15l7.7-6.1M13.6 15l4.7-3.6', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M4.2 6Q4.1 12 4.3 18.6M7.4 2.25Q13 2.1 18.3 2.3M19.8 4.6Q19.95 12 19.75 19.6M19.6 16.1Q13 16.3 7.1 16.2', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M7 2.6Q12.5 2.4 18 2.55Q19.5 2.6 19.45 4.1Q19.6 12 19.4 20Q19.4 21.45 17.9 21.4Q12.5 21.6 7 21.45Q4.55 21.4 4.5 19Q4.4 12 4.6 5Q4.6 2.6 7.3 2.55', class: 'wm-k' }],
    ['path', { d: 'M19.4 16.45Q13 16.65 7 16.5Q4.6 16.6 4.55 19M7.7 2.9Q7.6 9.5 7.75 16.2', class: 'wm-k' }],
    ['path', { d: 'M8.3 19Q13.5 18.85 19.1 19', 'stroke-width': 0.8, 'stroke-opacity': 0.7, class: 'wm-k' }],
  ]
}
