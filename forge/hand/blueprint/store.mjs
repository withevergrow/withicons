// forge/hand/blueprint/store.mjs — the drafted shop front with an unbroken awning and a clear door (the generated
// drawing ran a chain centre line down through the awning and the door, broke the roof corners open for control rings
// and added fillet marks at the base, so roof and door blurred at 16px): the object lines stay whole and mitred, and
// only the faint keyline arcs and one dimension line under the awning show the drafting.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3.2 16.75a10 10 0 0 1-.88-2.23m-.15-.69l-.07-.39m-.07-.7a10 10 0 0 1 .11-2.39M21.86 10.31a10 10 0 0 1 .12 2.39m-.08.7l-.06.39m-.15.69a10 10 0 0 1-.86 2.22', ...con(0.34) }],
    ['path', { d: 'M3 23H21M3 21.4V23.6M21 21.4V23.6', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M6 3H18L21 8.5A3 2.5 0 0 1 15 8.5A3 2.5 0 0 1 9 8.5A3 2.5 0 0 1 3 8.5ZM4.5 10.5V19A2 2 0 0 0 6.5 21H17.5A2 2 0 0 0 19.5 19V10.5', class: 'wm-k' }],
    ['path', { d: 'M10 3L9 8.5M14 3L15 8.5M9.5 21V16.5A1.5 1.5 0 0 1 11 15H13A1.5 1.5 0 0 1 14.5 16.5V21', class: 'wm-a' }],
  ]
}
