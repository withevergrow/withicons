// forge/hand/sketch/hand-heart.mjs — a larger pencil heart over a simple open hand (cuff, palm, cupped fingers), each with
// a faint second pass, replacing the generated drawing whose small heart and tight, scratchy hand blurred at 16px.
const r2 = v => Math.round(v * 100) / 100
const sh = (d, dx, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${r2(+x + dx)} ${r2(+y + dy)}`)
const F = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
const CUFF = 'M3.1 12.6 Q3 17.4 2.95 22.3'
const PALM = 'M2.6 14.55 Q5 14.4 7.5 14.5 C8.6 14.5 9.6 14.9 10.4 15.6 L11.15 16.25 Q12.6 16.3 14 16.25 C14.83 16.25 15.5 16.92 15.5 17.75 C15.5 18.58 14.83 19.25 14 19.25 Q11.6 19.3 9.2 19.2'
const BASE = 'M2.6 21.05 Q8 20.9 13.5 21 C14.6 21 15.6 20.6 16.4 19.9 L20.6 16.2 C21.24 15.59 21.27 14.58 20.66 13.94 C20.05 13.3 19.04 13.29 18.4 13.9 L15.2 16.55'
const HEART = 'M12 12.2 C11 11.6 6.5 8.9 6.5 5.2 C6.5 3.4 7.9 2 9.6 2 C10.7 2 11.5 2.6 12 3.5 C12.5 2.6 13.3 2 14.4 2 C16.1 2 17.5 3.4 17.5 5.2 C17.5 9 12.6 12 11.65 12.5'
export default function render() {
  return [
    ['path', { d: 'M11.6 9.9l3.4-2.7M13.4 10.3l2.2-1.8M5 20.1l2.6-2.1M8 20.2l1.3-1.05', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: [CUFF, PALM, BASE].map(d => sh(d, 0.3, -0.25)).join(''), ...F, class: 'wm-k' }],
    ['path', { d: sh(HEART, 0.3, -0.25), ...F, class: 'wm-a' }],
    ['path', { d: CUFF + PALM + BASE, class: 'wm-k' }],
    ['path', { d: HEART, class: 'wm-a' }],
  ]
}
