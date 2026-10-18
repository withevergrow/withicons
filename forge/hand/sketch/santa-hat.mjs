// forge/hand/sketch/santa-hat.mjs — a bold drooping cone over a chunky rounded brim, with a separate hachured pompom
// hanging clear of the tip so the silhouette and the pompom both survive at 16px.
export default function render() {
  return [
    ['path', { d: 'M12.8 15.3L15.6 12.5M13.1 12.4L15.8 9.7M14.6 8.4L16.4 6.6', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M5.6 15.9Q5.9 7.4 11.6 4.8Q16.2 2.9 18.4 7.6M16.6 15.9Q15.5 9.6 17.1 7.2', 'stroke-width': 1.5, class: 'wm-k' }],
    ['path', { d: 'M4.6 16.05Q12 15.75 19.4 16Q21 16.05 20.95 17.8Q21 19.6 19.4 19.6Q12 19.85 4.6 19.6Q3 19.55 3.05 17.8Q3 16 4.85 16.05', 'stroke-width': 1.5, class: 'wm-k' }],
    ['path', { d: 'M7 19.3L9.1 16.3M11.2 19.4L13.4 16.2M15.5 19.4L17.6 16.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M17.55 10.2A2.05 2.05 0 1 1 17.9 10.8M18.5 11.6L20.4 9.7', 'stroke-width': 1.4, class: 'wm-a' }],
  ]
}
