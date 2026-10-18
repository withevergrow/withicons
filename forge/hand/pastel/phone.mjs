const B = 'M4.5 1.8l-.7 .2-.6 .3-.7 .6-.4 .7-.3 .7v.6l.1 2 .3 1.7 .3 1.1 .5 1.5 .4 .9 .4 .9 .9 1.5 1.3 1.7 .6 .7 1.2 1.1 1.6 1.2 .9 .6 1.5 .8 2 .8 1.4 .4 .8 .2 2 .2h1.1l.6-.1 .4-.1 .5-.2 .6-.4 .4-.4 .4-.6 .2-.6 .1-.6v-3.6l-.2-.7-.4-.7-.7-.6-.7-.3-.5-.1h-2l-.6 .1-.6 .2-.9 .6h-.3-.7l-1-.2-.8-.3-.7-.4-.8-.7-.8-1-.5-1-.2-.9-.1-.6v-.7l.7-1 .2-.4 .1-.6v-2.2l-.2-.6-.3-.5-.4-.5-.4-.3-.5-.3-.5-.1-.5-.1h-3z';
export default function render() {
  return [
    ['path', { d: B, fill: 'var(--with-pastel-shadow, #7DAEEA)', 'fill-opacity': '0.18', class: 'wm-shadow' }],
    ['path', { d: B, fill: 'var(--with-pastel-c1, #B7D6FA)', stroke: 'var(--with-pastel-edge, #9AC2F2)', 'stroke-width': '0.6', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M3.4 3.4q.6-.6 1.4-.6h2.6q1 0 1.1 1v1.6q-.6-.6-1.3-.6h-2.6q-1 0-1.6 .9q-.1-1.6 .4-2.3z', fill: 'var(--with-pastel-c2, #F7B8CF)', class: 'wm-a' }],
    ['path', { d: 'M15.2 15.1q.5-.3 1.1-.3h2.4q1 0 1.4 1v1.7q-.4-.8-1.4-.8h-2.2q-.6 0-1.1 .3l-1 .5q.3-1.8 .8-2.4z', fill: 'var(--with-pastel-c2, #F7B8CF)', class: 'wm-a' }],
    ['path', { d: 'M14 3.2a6.8 6.8 0 0 1 6.8 6.8M14 6a4 4 0 0 1 4 4', fill: 'none', stroke: 'var(--with-pastel-c3, #C9B6F2)', 'stroke-width': '1.4', 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: 'M3.5 4.6q.3-.9 1.2-1.1', fill: 'none', stroke: 'var(--with-pastel-shine, #FFFFFF)', 'stroke-opacity': '0.6', 'stroke-width': '0.6', 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
