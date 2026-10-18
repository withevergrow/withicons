// forge/hand/blueprint/gavel.mjs — the drafted gavel with its head drawn as one closed, mitred block (the generated
// drawing broke all four head corners open for control rings and ringed the sound block end, so at 16px the head
// shattered into four loose dashes and the gavel read as a hammer sketch): the head, the handle from its long side and
// the sound block stay whole, with the keyline arcs and the dimension line faint behind.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M18.07 19.95a10 10 0 0 1-2.07 1.21m-.65.26l-.38.13m-.67.18a10 10 0 0 1-2.37.27M5.58 19.67a10 10 0 0 1-1.64-1.75m-.39-.57l-.21-.35m-.33-.61a10 10 0 0 1-.78-2.27m-.13-.68l-.05-.4m-.04-.7l-.01-.09M2.69 8.34a10 10 0 0 1 1.14-2.11m.42-.55l.26-.31m.48-.51a10 10 0 0 1 1.9-1.46m.62-.33l.36-.18M12.22 2a10 10 0 0 1 2.37.34m.67.21l.38.14m.64.27a10 10 0 0 1 2.03 1.28m.52.46l.29.28m.47.51a10 10 0 0 1 1.33 2m.3.63l.14.37m.23.67a10 10 0 0 1 .4 2.36m.01.7l-.02.4m-.07.69a10 10 0 0 1-.59 2.32m-.28.64l-.18.36m-.34.61l-.55.81', ...con(0.34) }],
    ['path', { d: 'M3 23H19.5M3 22.2V23.3M19.5 21.2V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M18.85 23.65L20.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M3.5 10.5L10.5 3.5L13.5 6.5L6.5 13.5Z', class: 'wm-k' }],
    ['path', { d: 'M10 10L19.5 19.5', class: 'wm-a' }],
    ['path', { d: 'M3 21H11', class: 'wm-s' }],
  ]
}
