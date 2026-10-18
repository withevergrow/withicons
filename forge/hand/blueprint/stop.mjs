// forge/hand/blueprint/stop.mjs — the common stop button: one rounded square, drafted with a dimension line and
// extension ticks (the old drawing was an octagon with an inner square, which read as a road stop sign).
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3 23H21M3 21.7V23.3M21 21.7V23.3M.8 12H2.2M21.8 12H23.2M12 .8V2.2', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', ...con(0.75, 0.5) }],
    ['path', { d: 'M6 3H18A3 3 0 0 1 21 6V18A3 3 0 0 1 18 21H6A3 3 0 0 1 3 18V6A3 3 0 0 1 6 3Z', class: 'wm-k' }],
  ]
}
