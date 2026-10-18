// forge/hand/blueprint/kanban.mjs: the common kanban board drafted as a rounded-square frame holding three tall
// pill columns of different heights (the middle one is the live part), with a dimension line under the frame.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })
const pill = (x, y, h, cls) => ['rect', { x, y, width: 3, height: h, rx: 1.5, fill: 'currentColor', stroke: 'none', class: cls }]

export default function render() {
  return [
    ['path', { d: 'M3 23H21M3 21.7V23.3M21 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', ...con(0.75, 0.5) }],
    ['path', { d: 'M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z', class: 'wm-k' }],
    pill(5.75, 7, 9.5, 'wm-k'),
    pill(10.5, 7, 5, 'wm-a'),
    pill(15.25, 7, 7.5, 'wm-k'),
  ]
}
