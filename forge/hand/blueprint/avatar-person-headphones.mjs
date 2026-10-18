// forge/hand/blueprint/avatar-person-headphones.mjs — the drafted person with headphones: hair under a headband, a round
// face with two eyes and a smile, a pill ear cup each side, shoulders below. The generated drawing stacked a keyline circle,
// handle rings, fillet marks and dimension ticks on top of all that, a wire cage at 16px; here only a baseline remains.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M6.2 23H17.8', ...con(0.5) }],
    ['path', { d: 'M3.85 23.65L5.15 22.35M18.85 23.65L20.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // face (open at the top where the hair closes it) with eyes and smile
    ['path', { d: 'M7 10.5A5 6 0 0 0 17 10.5M9.75 11V12.25M14.25 11V12.25M10.25 13.9C11 14.7 13 14.7 13.75 13.9', class: 'wm-k' }],
    // hair with a single fringe notch
    ['path', { d: 'M7 10.5C6.5 7 9 4.8 12 4.8C15 4.8 17.5 7 17 10.5C14.5 10 12.8 8.8 12 7.2C11.2 8.8 9.5 10 7 10.5Z', class: 'wm-k' }],
    // headband and the two ear cups
    ['path', { d: 'M5.25 9C5.25 5 8 2.5 12 2.5C16 2.5 18.75 5 18.75 9', class: 'wm-a' }],
    ['rect', { x: 3.5, y: 9, width: 3.5, height: 6, rx: 1.75, class: 'wm-a' }],
    ['rect', { x: 17, y: 9, width: 3.5, height: 6, rx: 1.75, class: 'wm-a' }],
    // shoulders
    ['path', { d: 'M5 21.5C5 19.5 6.7 18.25 8.75 18.25C10 18.25 10.75 18.9 12 18.9C13.25 18.9 14 18.25 15.25 18.25C17.3 18.25 19 19.5 19 21.5', class: 'wm-s' }],
  ]
}
