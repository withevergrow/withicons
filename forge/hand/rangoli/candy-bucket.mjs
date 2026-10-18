// rangoli candy-bucket: tapered pail with rim, arched handle, two wrapped candies and a lollipop.
export default function render() {
  const G0 = 'wg-rangoli-candy-bucket-0';
  const G1 = 'wg-rangoli-candy-bucket-1';
  const v = (r, h) => `var(--with-rangoli-${r}, ${h})`;
  const r = (n) => Math.round(n * 100) / 100;
  const candy = (cx, cy, col) => [
    ['path', { d: `M${r(cx - 2)} ${cy}L${r(cx - 4.4)} ${r(cy - 2)}V${r(cy + 2)}Z M${r(cx + 2)} ${cy}L${r(cx + 4.4)} ${r(cy - 2)}V${r(cy + 2)}Z`, fill: col, 'stroke-linejoin': 'round', stroke: v('ink', '#5A1240'), 'stroke-width': 0.5, class: 'wm-a' }],
    ['ellipse', { cx, cy, rx: 2.6, ry: 2.1, fill: col, stroke: v('ink', '#5A1240'), 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: `M${r(cx - 1.3)} ${r(cy - 0.9)}Q${cx} ${r(cy - 1.5)} ${r(cx + 1.2)} ${r(cy - 0.9)}`, stroke: v('shine', '#FFFFFF'), 'stroke-opacity': 0.7, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
  return [
    ['defs', {}, [
      ['linearGradient', { id: G0, x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': v('accent', '#FFC21A') }],
        ['stop', { offset: 1, 'stop-color': v('c1', '#FFB21F') }],
      ]],
      ['radialGradient', { id: G1, cx: 8, cy: 13, r: 14, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': v('c1', '#FFB21F') }],
        ['stop', { offset: 0.3, 'stop-color': v('c1', '#FFB21F') }],
        ['stop', { offset: 1, 'stop-color': v('c2', '#F2462C') }],
      ]],
    ]],
    // handle
    ['path', { d: 'M4.5 12.5C4.5 2.5 19.5 2.5 19.5 12.5', stroke: `url(#${G0})`, 'stroke-width': 1.8, 'stroke-linecap': 'round', class: 'wm-k' }],
    // lollipop
    ['line', { x1: 16.5, y1: 12, x2: 16.5, y2: 6.5, stroke: v('ink', '#5A1240'), 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['circle', { cx: 16.5, cy: 5.4, r: 2.4, fill: v('c2', '#F2462C'), stroke: v('ink', '#5A1240'), 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: 'M16.5 5.4m-1.2 0a1.2 1.2 0 1 1 1.2 1.2', stroke: v('accent', '#FFC21A'), 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-a' }],
    ...candy(7.4, 9.6, v('c3', '#E81F7A')),
    ...candy(12.6, 8.4, v('c4', '#7B2FE0')),
    // pail body
    ['path', { d: 'M4.6 14H19.4L17.9 20.6C17.7 21.4 17.1 22 16.2 22H7.8C6.9 22 6.3 21.4 6.1 20.6Z', fill: `url(#${G1})`, class: 'wm-k' }],
    ['path', { d: 'M6.1 20.6C6.3 21.4 6.9 22 7.8 22H16.2C17.1 22 17.7 21.4 17.9 20.6L18.2 19.3C17.5 20.2 16.8 20.6 15.8 20.6H8.2C7.2 20.6 6.5 20.2 5.8 19.3Z', fill: v('shadow', '#5A1240'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    // rim
    ['rect', { x: 3, y: 11.6, width: 18, height: 2.8, rx: 1.4, fill: `url(#${G1})`, class: 'wm-k' }],
    ['rect', { x: 3, y: 13.8, width: 18, height: 0.6, rx: 0.3, fill: v('shadow', '#5A1240'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: 'M4.4 12.5H13', stroke: v('shine', '#FFFFFF'), 'stroke-opacity': 0.7, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M7.4 15.8L7.9 19', stroke: v('shine', '#FFFFFF'), 'stroke-opacity': 0.6, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // deco sparkles
    ['path', { d: 'M2.4 17.2Q2.6 18.2 3.6 18.4Q2.6 18.6 2.4 19.6Q2.2 18.6 1.2 18.4Q2.2 18.2 2.4 17.2Z', fill: v('c3', '#E81F7A'), class: 'wm-deco' }],
  ];
}

