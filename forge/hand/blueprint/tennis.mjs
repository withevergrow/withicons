// forge/hand/blueprint/tennis.mjs — a drafted tennis racket and ball. The generated drawing had a small head crowded
// with hatching, a ball with a dot in the corner and a stray node at the handle's end; here the head is a large oval
// tilted 45 degrees with two strings in each direction, the handle is a plain grip, and the ball is an open circle.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3 22.9H21M3 20.7V23.3M21 20.7V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.55L3.65 22.25M20.35 23.55L21.65 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // head, throat and grip
    ['path', { d: 'M3.91 3.91A7.2 5.7 45 1 1 14.09 14.09A7.2 5.7 45 1 1 3.91 3.91ZM14.09 14.09L15.6 15.6', class: 'wm-k' }],
    // solid grip
    ['path', { d: 'M16.52 14.68L20.72 18.88L18.88 20.72L14.68 16.52Z', fill: 'currentColor', class: 'wm-k' }],
    // strings
    ['path', { d: 'M15.22 12.25L5.76 2.79M12.25 15.22L2.79 5.76M14.6 7.08L7.08 14.6M10.92 3.4L3.4 10.92', class: 'wm-k' }],
    // ball
    ['circle', { cx: 18.75, cy: 5.25, r: 3, class: 'wm-s' }],
    ['path', { d: 'M20.4 3.6C19 4.8 19 5.8 20.4 7', 'stroke-width': 0.9, class: 'wm-s' }],
  ]
}
