// forge/hand/sketch/user-minus.mjs — the pencilled figure with a longer, heavier marker minus, replacing a thin short
// dash that shrank to a speck at 16px.
export default function render() {
  const pencil = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  return [
    ['path', { d: 'M7.9 9.3l2.7-2.1M9 19.7l2.7-2.2', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M2.3 21.8q-.3-1.8-.4-2.4 0-.6.1-1.1.2-.4.4-.9.3-.5.7-.9.3-.4.8-.8.5-.3 1-.5.5-.2 1.1-.2.6-.1 1.6-.1.9 0 1.9 0 1 0 1.5 0 .6.1 1.1.3.5.1 1 .4.4.3.8.7.4.4.6.9.3.5.4 1 .2.5.2 1.2 0 .7-.2 2.8', ...pencil, class: 'wm-k' }],
    ['path', { d: 'M7 4.5q.9-.4 1.3-.5.5-.1 1 0 .5.1 1 .3.4.2.8.6.3.3.6.7.2.4.3.9.1.5.1.9 0 .5-.1.9-.1.5-.4.9-.2.4-.5.7-.3.3-.7.6-.3.3-.8.5-.4.2-.9.2-.4.1-.9 0-.5-.1-.9-.3-.5-.3-.8-.6-.4-.3-.6-.7-.2-.4-.3-.8-.2-.4-.2-.9 0-.4.1-.9.1-.4.3-.9.3-.4.5-.9.2-.4.5-.9.4-.5 1.3-1M1.9 21.5q-.1-1.8-.1-2.3.1-.6.2-1.1.2-.5.5-.9.3-.5.8-1 .4-.4.9-.7.5-.3 1-.4.5-.2 1.3-.2.8 0 1.8 0 1-.1 1.8-.1.8 0 1.4.2.6.1 1.1.4.5.2 1 .6.4.3.7.8.3.5.5 1 .2.5.3 1.1 0 .6-.1 2.7', class: 'wm-k' }],
    // the minus: longer and a touch heavier than the outline, with a faint marker bow
    ['path', { d: 'M15.8 10.6Q19 10.45 22.3 10.55', 'stroke-width': 1.65, class: 'wm-s' }],
  ]
}
