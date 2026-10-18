// forge/hand/blueprint/panel-left-open.mjs — the common open-sidebar panel: framed panel, left divider and one
// right-pointing chevron (the node dots made it read as a branch), with the style's dimension ticks.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3 23H21M3 21.7V23.3M21 21.7V23.3M.8 12H1.7M22.3 12H23.2M21 .9V2.3M23.1 3H21.7M.9 3H2.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', ...con(0.75, 0.5) }],
    ['path', { d: 'M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3ZM9 3V21', class: 'wm-k' }],
    ['path', { d: 'M13.5 8.5L17 12L13.5 15.5', class: 'wm-a' }],
  ]
}
