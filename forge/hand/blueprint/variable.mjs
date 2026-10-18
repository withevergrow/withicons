// forge/hand/blueprint/variable.mjs: an italic x with an equals sign (the line drawing's metaphor). The earlier
// bracketed (x) read as a generic group or multiply; here two drafted strokes make the x, two bars make the equals,
// and a sheared stance and one dimension line keep the blueprint voice without touching the letter.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3.5 21.4H21.5M3.5 21.2V22.1M21.5 21.2V22.1', ...con(0.5) }],
    ['path', { d: 'M2.85 22.05L4.15 20.75M20.85 22.05L22.15 20.75', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M5.5 7.5L11.5 16.5M13.5 7.5L3.5 16.5', class: 'wm-k' }],
    ['path', { d: 'M16.5 10H21.5M16.5 14H21.5', class: 'wm-a' }],
  ]
}
