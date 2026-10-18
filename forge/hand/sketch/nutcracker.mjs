// forge/hand/sketch/nutcracker.mjs — the line design in doubled pencil strokes: pom loop on a tall hat, brim band, side ears, two eyes,
// a curled moustache and a beard block with a centre split, replacing a boxy robot with buttons.
const r2 = (n) => Math.round(n * 100) / 100
const gh = (d) => { let i = 0; return d.replace(/-?\d+(\.\d+)?/g, (m) => String(r2(+m + ((i++ % 2) ? 0.3 : 0.25)))) }
const sk = (d, cls = 'wm-k') => [['path', { d: gh(d), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: cls }], ['path', { d, class: cls }]]
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
export default function render() {
  return [
    ['path', { d: 'M9.3 6.6L9.7 8M14.7 6.6L15.1 8', ...HATCH }],
    ...sk('M10.6 3.4a1.4 1.4 0 1 0 2.8 0a1.4 1.4 0 1 0 -2.8 0Z', 'wm-a'),
    ...sk('M8.1 9L7.3 5.2L16.7 5.2L15.9 9'),
    ...sk('M6.6 9L17.4 9Q18 9 18 9.6L18 10.4Q18 11 17.4 11L6.6 11Q6 11 6 10.4L6 9.6Q6 9 6.6 9Z'),
    ...sk('M7.2 11L7.2 15.6Q7.2 18.2 9.6 18.8M16.8 11L16.8 15.6Q16.8 18.2 14.4 18.8'),
    ['path', { d: 'M7.2 12.6A1.2 1.2 0 0 0 7.2 15.2M16.8 12.6A1.2 1.2 0 0 1 16.8 15.2', 'stroke-width': 1, class: 'wm-k' }],
    ['path', { d: 'M9.6 13L9.7 13M14.4 13L14.5 13', 'stroke-width': 1.8, class: 'wm-s' }],
    ['path', { d: 'M12 15Q11 16.8 9 16.4M12 15Q13 16.8 15 16.4', class: 'wm-a' }],
    ...sk('M9.8 18.6L14.2 18.6L14.2 21.8L9.8 21.8Z'),
    ['path', { d: 'M12 18.6L12 21.8', 'stroke-width': 0.8, class: 'wm-a' }],
  ]
}
