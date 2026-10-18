// forge/hand/sketch/dragon-head.mjs: the line dragon (branched antlers, brows, eyes, snout with nostrils, curled whiskers, spiky beard) in wobbly pencil.
const r2 = v => Math.round(v * 100) / 100
const sh = (d, dx, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${r2(+x + dx)} ${r2(+y + dy)}`)
const jit = (d, s, a) => { let i = 0; return d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => { i++; const n = s + i * 1.7; return `${r2(+x + Math.sin(n * 2.3) * a)} ${r2(+y + Math.cos(n * 3.1) * a)}` }) }
const HEAD = 'M12 4.6 C16.6 4.6 18.8 6.8 18.6 9.7 C18.5 11.6 17.2 12.6 16.1 13.3 L16.4 15.6 C17.6 16.2 17.8 18 16.8 19 C16.3 19.5 15.7 19.8 15.1 19.9 L14.4 22.2 L13.1 20.4 L12 22.9 L10.9 20.4 L9.6 22.2 L8.9 19.9 C8.3 19.8 7.7 19.5 7.2 19 C6.2 18 6.4 16.2 7.6 15.6 L7.9 13.3 C6.8 12.6 5.5 11.6 5.4 9.7 C5.2 6.8 7.4 4.6 12 4.6'
const ANT = 'M9.6 5.2 C8.8 3.9 8.1 2.8 7.8 1.4 M8.4 3.6 C7.4 3.4 6.5 2.9 5.9 2 M14.4 5.2 C15.2 3.9 15.9 2.8 16.2 1.4 M15.6 3.6 C16.6 3.4 17.5 2.9 18.1 2'
const WHI = 'M7.4 16.5 C5.4 16.1 3.6 16.5 2.4 16.3 C1.2 16.1 1 14.7 2 14.3 C2.8 14 3.4 14.7 3 15.3 M16.6 16.5 C18.6 16.1 20.4 16.5 21.6 16.3 C22.8 16.1 23 14.7 22 14.3 C21.2 14 20.6 14.7 21 15.3'
const BROW = 'M7.1 6.8 L10.8 8.9 M16.9 6.8 L13.2 8.9'
const SNOUT = 'M8.6 15.9 C10.6 15.3 13.4 15.3 15.4 15.9'
const BEARD = 'M9.2 18.5 C11 19.1 13 19.1 14.8 18.5 M10.1 18.8 L10.4 19.7 M13.9 18.8 L13.6 19.7'
const EARS = 'M5.6 10.6 C4.3 10.7 3.1 10.2 2.5 9.3 C3.2 9.3 3.7 9.1 4 8.8 C3.3 8.3 3 7.6 3 6.9 M18.4 10.6 C19.7 10.7 20.9 10.2 21.5 9.3 C20.8 9.3 20.3 9.1 20 8.8 C20.7 8.3 21 7.6 21 6.9'
const F = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const head = jit(HEAD, 1, 0.12), ant = jit(ANT, 5, 0.1), whi = jit(WHI, 9, 0.1), ears = jit(EARS, 13, 0.1)
  return [
    ['path', { d: 'M9.6 11.8l-1.2 1.4M7.4 11.4l-.9 1', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: sh(head + ears, 0.3, -0.25), ...F, class: 'wm-k' }],
    ['path', { d: sh(ant + whi, 0.3, -0.25), ...F, class: 'wm-a' }],
    ['path', { d: head + ears, class: 'wm-k' }],
    ['path', { d: ant, class: 'wm-a' }],
    ['path', { d: whi, class: 'wm-a' }],
    ['path', { d: jit(BROW, 17, 0.08), class: 'wm-a' }],
    ['path', { d: 'M9.5 10.6h.01M14.5 10.6h.01', 'stroke-width': 2.2, class: 'wm-a' }],
    ['path', { d: jit(SNOUT, 21, 0.08), class: 'wm-a' }],
    ['path', { d: 'M10.5 17h.01M13.5 17h.01', 'stroke-width': 1.5, class: 'wm-a' }],
    ['path', { d: jit(BEARD, 25, 0.08), class: 'wm-s' }],
  ]
}
