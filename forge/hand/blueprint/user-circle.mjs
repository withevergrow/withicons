// forge/hand/blueprint/user-circle.mjs — bust inside a clean ring; the shoulder ends tuck inside the ring stroke so the
// square caps no longer poke spurs through the circle, and the shoulders sit a touch fuller so the bust reads at 16px.
const DECO = { color: 'var(--with-accent, currentColor)', stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }

export default function render() {
  return [
    ['path', { d: 'M2.5 23H21.5M2.5 21.7V23.3M21.5 21.7V23.3', ...DECO }],
    ['path', { d: 'M12 3.9v.8M12 7.4v2.4m0 .7v.4M12 13.9v.9M12 18v2.1M3.9 12h2.4m.7 0h.4M16.1 12h2.4m.7 0h.4M9.9 9.5h2.4m.7 0h.4', ...DECO }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', ...DECO, 'stroke-width': 0.5, 'stroke-opacity': 0.75 }],
    ['path', { d: 'M21.5 12A9.5 9.5 0 0 1 2.5 12A9.5 9.5 0 0 1 21.5 12ZM15.5 9.5A3.5 3.5 0 0 1 8.5 9.5A3.5 3.5 0 0 1 15.5 9.5Z', class: 'wm-k' }],
    ['path', { d: 'M5.75 18.25C6.75 16.85 8 16 9.75 16H14.25C16 16 17.25 16.85 18.25 18.25', class: 'wm-k' }],
  ]
}
