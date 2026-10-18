// forge/hand/sketch/avatar-dino.mjs: the line dino bust (spiked back, snout facing right, open neck) in wobbly pencil with hatched neck and jaw.
const r2 = v => Math.round(v * 100) / 100
const sh = (d, dx, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${r2(+x + dx)} ${r2(+y + dy)}`)
const jit = (d, s, a) => { let i = 0; return d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => { i++; const n = s + i * 1.7; return `${r2(+x + Math.sin(n * 2.3) * a)} ${r2(+y + Math.cos(n * 3.1) * a)}` }) }
const BODY = 'M6 21.5 L6.5 19 L3 17.25 L7 16 L7.25 14 L4 12 L7.75 11 L8 9.25 L5.25 7.5 L8.5 6.75 C8.75 4.25 10.75 2.75 13 2.75 C14.25 2.75 15.25 3 16 3.75 C16.5 4.25 17 4.25 17.75 4.25 L19.75 4.25 C20.75 4.25 21.5 5 21.5 6 L21.5 6.25 C21.5 7 21 7.5 20.25 7.5 L14 9.5 L18.75 12.75 C19.5 13.25 19.5 14.25 18.75 14.75 C17.5 15.5 16 15.75 14.5 15.75 C12.5 15.75 11 16.5 11 18.25 L11 21.5'
const F = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const main = jit(BODY, 3, 0.14)
  return [
    ['path', { d: 'M7.6 20.6l3-3M7.5 18.4l3-2.9M12.6 14.6l2.6-1.8M12.9 12.6l1.7-1.1', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: sh(main, 0.3, -0.25), ...F, class: 'wm-k' }],
    ['path', { d: main, class: 'wm-k' }],
    ['path', { d: 'M15 6l.01.4', 'stroke-width': 1.8, class: 'wm-k' }],
  ]
}
