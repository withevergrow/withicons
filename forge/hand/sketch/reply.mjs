// forge/hand/sketch/reply.mjs — a marker arrowhead drawn as one stroke through a rounded tip and a separate curving
// shaft that stops short of it, replacing crossed arrowhead strokes whose pencil overshoots left a stray mark at the tip.
export default function render() {
  const pencil = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M6.2 10.05Q9.6 9.95 13.1 10.05Q19.2 10.55 19.55 17L19.5 20.3', ...pencil, class: 'wm-k' }],
    ['path', { d: 'M9.1 4.95Q6.5 7.3 4 9.5Q6.5 11.75 8.95 14.25', ...pencil, class: 'wm-a' }],
    ['path', { d: 'M4.6 9.55Q8.8 9.45 13 9.5Q16 9.55 18 11.55Q20.05 13.6 20 16.6L20.05 19.7', class: 'wm-k' }],
    ['path', { d: 'M8.6 4.4Q6.1 6.9 3.6 9.45Q6.1 12 8.55 14.6', class: 'wm-a' }],
  ]
}
