// forge/hand/blueprint/sun.mjs — central disc and eight short rays as in line, drafted with a thin radius line and a
// dimension line under it (the reticle and dashed outer ring read as a target, so both are gone).
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M2 23.3H22M2 22.1V23.6M22 22.1V23.6', ...con(0.5) }],
    ['path', { d: 'M1.35 23.95L2.65 22.65M21.35 23.95L22.65 22.65', ...con(0.75, 0.5) }],
    ['path', { d: 'M12 12L15.18 8.82', ...con(0.6) }],
    ['path', { d: 'M16.5 12A4.5 4.5 0 0 1 7.5 12A4.5 4.5 0 0 1 16.5 12Z', class: 'wm-k' }],
    ['path', { d: 'M12 4V2M17.66 6.34L19.07 4.93M20 12H22M17.66 17.66L19.07 19.07M12 20V22M6.34 17.66L4.93 19.07M4 12H2M6.34 6.34L4.93 4.93', class: 'wm-a' }],
  ]
}
