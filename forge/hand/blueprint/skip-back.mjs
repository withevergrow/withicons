// forge/hand/blueprint/skip-back.mjs: the drafted skip-back, a full-height stop bar standing clear of a rounded
// reversed triangle. The generated drawing buried the bar under a dimension tick and two control rings so it read as a
// bare triangle with stray marks; here the bar carries no construction at all, the triangle is one closed stroke, and
// only the faint dimension line and a short centre chain inside the triangle remain.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M4.5 21.4H19.5M4.5 21.2V22.1M19.5 21.2V22.1', ...con(0.5) }],
    ['path', { d: 'M13 12h2.4m.7 0h.4m.7 0h.9', ...con(0.5) }],
    ['path', { d: 'M3.85 22.05L5.15 20.75M18.85 22.05L20.15 20.75', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M19.5 7.73A1.75 1.75 0 0 0 16.79 6.26L10.25 10.53A1.75 1.75 0 0 0 10.25 13.47L16.79 17.74A1.75 1.75 0 0 0 19.5 16.27Z', class: 'wm-k' }],
    ['path', { d: 'M4.5 5V19', class: 'wm-a' }],
  ]
}
