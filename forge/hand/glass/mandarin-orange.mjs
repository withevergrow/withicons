// glass / mandarin-orange: frosted oblate citrus, separate stem and leaf, dimple and rind pores.
const ID = 'wg-glass-mandarin-orange-';
const V = (r, h) => `var(--with-glass-${r}, ${h})`;

// body ellipse helper (as path) and leaf path, offset by dx, dy
const body = (dx, dy, rx = 8.9, ry = 6.9) => {
  const cx = 11.4 + dx, cy = 14.3 + dy;
  const f = (n) => Math.round(n * 100) / 100;
  return `M${f(cx - rx)} ${f(cy)}A${rx} ${ry} 0 1 0 ${f(cx + rx)} ${f(cy)}A${rx} ${ry} 0 1 0 ${f(cx - rx)} ${f(cy)}Z`;
};
const leaf = (dx, dy) => {
  const f = (n) => Math.round(n * 100) / 100;
  const p = (x, y) => `${f(x + dx)} ${f(y + dy)}`;
  return `M${p(12.6, 5.5)}C${p(13.3, 2.9)} ${p(15.9, 1.6)} ${p(19.4, 2)}C${p(18.7, 4.9)} ${p(16, 6.4)} ${p(12.6, 5.5)}Z`;
};

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: ID + '0', x1: '3', y1: '3', x2: '22', y2: '23', gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: '0', 'stop-color': V('back', '#7484FF') }],
        ['stop', { offset: '1', 'stop-color': V('shadow', '#6A45D6') }],
      ]],
      ['radialGradient', { id: ID + '1', cx: '16.5', cy: '18.5', r: '8', gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: '0', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0.6' }],
        ['stop', { offset: '0.5', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0.22' }],
        ['stop', { offset: '1', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0' }],
      ]],
      ['linearGradient', { id: ID + '2', x1: '2', y1: '1', x2: '20', y2: '22', gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: '0', 'stop-color': V('frost', '#FFFFFF'), 'stop-opacity': '0.6' }],
        ['stop', { offset: '0.4', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.55' }],
        ['stop', { offset: '1', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.42' }],
      ]],
    ]],
    // shadows
    ['path', { d: body(1.7, 1.9) + leaf(1.7, 1.9), fill: V('shadow', '#6A45D6'), 'fill-opacity': '0.07', class: 'wm-shadow' }],
    ['path', { d: body(1.4, 1.5, 9.1, 7.1), fill: V('shadow', '#6A45D6'), 'fill-opacity': '0.07', class: 'wm-shadow' }],
    // back body + leaf
    ['path', { d: body(1.1, 1.2), fill: `url(#${ID}0)`, class: 'wm-k' }],
    ['path', { d: body(1.1, 1.2), fill: `url(#${ID}1)`, class: 'wm-k' }],
    ['path', { d: leaf(1, 1.1), fill: `url(#${ID}0)`, class: 'wm-a' }],
    // stem
    ['path', { d: 'M11.8 7.6C11.7 6.6 11.5 5.8 11.1 5.1', stroke: V('etch', '#3E3A8C'), 'stroke-opacity': '0.75', 'stroke-width': '1.3', 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }],
    // front panes
    ['path', { d: body(0, 0), fill: `url(#${ID}2)`, stroke: 'currentColor', 'stroke-opacity': '0.2', 'stroke-width': '0.5', class: 'wm-k' }],
    ['path', { d: leaf(0, 0), fill: `url(#${ID}2)`, stroke: 'currentColor', 'stroke-opacity': '0.2', 'stroke-width': '0.5', class: 'wm-a' }],
    // leaf vein
    ['path', { d: 'M13.4 5.2C15 4.7 16.6 3.8 18.4 2.6', stroke: V('etch', '#3E3A8C'), 'stroke-opacity': '0.55', 'stroke-width': '0.6', 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    // dimple + rind pores
    ['path', { d: 'M10.2 8.1C11 8.6 12.2 8.6 13 8.1M15.4 12.1h.1M16.6 15.3h.1M14 16.9h.1M9.1 17.6h.1', stroke: V('etch', '#3E3A8C'), 'stroke-opacity': '0.6', 'stroke-width': '0.75', 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }],
    // shine
    ['path', { d: 'M3.8 14.6C3.8 11.6 6.1 9.2 9.3 8.2C9.6 8.1 9.8 8.4 9.5 8.6C7 9.7 5.1 11.8 4.6 14.4C4.5 15 3.9 15.1 3.8 14.6Z', fill: V('shine', '#FFFFFF'), 'fill-opacity': '0.85', class: 'wm-shine' }],
    ['path', { d: 'M13.6 4.9C14.6 3.6 16.2 2.8 18.3 2.6C16.8 3.2 15.3 4 14 5.1Z', fill: V('shine', '#FFFFFF'), 'fill-opacity': '0.7', class: 'wm-shine' }],
  ];
}
