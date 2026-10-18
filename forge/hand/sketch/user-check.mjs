// forge/hand/sketch/user-check.mjs — the pencilled figure with a larger, heavier marker check set clear of the head,
// replacing a thin little tick that faded out at 16px.
export default function render() {
  const pencil = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M8 9.2l2.3-1.8M9.1 19.5l2.8-2.1', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M2.3 22.2q-.3-1.9-.3-2.6 0-.6.2-1.1.2-.6.5-1 .3-.5.7-1 .4-.4.9-.7.4-.3.9-.6.5-.2 1-.3.5-.1 1.4-.1.9-.1 1.7-.1.9 0 1.4 0 .5.1 1 .3.5.1.9.4.5.3.9.6.3.4.6.8.3.5.5.9.2.5.3 1.2.1.7.1 2.9', ...pencil, class: 'wm-k' }],
    ['path', { d: 'M6.6 4q1-.3 1.4-.3.5.1 1 .2.4.1.8.4.4.2.8.6.4.3.7.7.3.4.5.9.2.4.3.9.1.5 0 1-.1.4-.2.8-.2.5-.5.8-.2.3-.6.6-.3.2-.7.4-.4.1-.8.2-.5.1-.9 0-.4 0-.9-.1-.4-.2-.7-.5-.4-.3-.7-.6-.3-.4-.5-.8-.2-.5-.4-.9-.1-.5-.2-1 0-.4.1-.9 0-.5.3-.9.2-.4.7-.7.4-.2.8-.3.4-.1 1.2-.1M1.8 21.8q.1-1.9.2-2.5.1-.5.4-1.1.3-.6.7-1.1.3-.5.7-.9.5-.4.9-.6.4-.3.9-.4.4-.2 1.1-.2.6-.1 1.6-.1.9-.1 1.7-.1.8 0 1.3.1.5.1 1 .3.5.3.9.6.4.4.7.8.3.4.5.9.3.5.4 1.1.1.6.3 2.6', class: 'wm-k' }],
    // the check: bigger and a touch heavier than the outline, one stroke with a sharp turn
    ['path', { d: 'M15.7 11.1Q16.9 12.3 18.2 13.65Q20.2 11.3 22.35 8.9', 'stroke-width': 1.65, class: 'wm-s' }],
  ]
}
