// bento/cast: rounded tile, screen with a quarter cut-out and cast waves in the lower-left corner.
const C1 = 'var(--with-bento-c1, #6366F1)';
const SH = 'var(--with-bento-shadow, #312E81)';
const SN = 'var(--with-bento-shine, #FFFFFF)';
const TILE = 'M9.4 2H14.6C20.08 2 22 3.92 22 9.4V14.6C22 20.08 20.08 22 14.6 22H9.4C3.92 22 2 20.08 2 14.6V9.4C2 3.92 3.92 2 9.4 2Z';
const screen = (dy) => {
  const y = (v) => (v + dy).toFixed(2);
  return `M6.1 ${y(9.6)}V${y(8.36)}A1.18 1.18 0 0 1 7.28 ${y(7.18)}H16.72A1.18 1.18 0 0 1 17.9 ${y(8.36)}V${y(15.44)}A1.18 1.18 0 0 1 16.72 ${y(16.62)}H13.1A7.02 7.02 0 0 0 6.1 ${y(9.6)}Z`;
};
const outline = (dy) => {
  const y = (v) => (v + dy).toFixed(2);
  return `M6.1 ${y(9.4)}V${y(8.36)}A1.18 1.18 0 0 1 7.28 ${y(7.18)}H16.72A1.18 1.18 0 0 1 17.9 ${y(8.36)}V${y(15.44)}A1.18 1.18 0 0 1 16.72 ${y(16.62)}H14.2`;
};
const waves = (dy) => {
  const y = (v) => (v + dy).toFixed(2);
  return `M6.1 ${y(13.5)}A3.12 3.12 0 0 1 9.22 ${y(16.62)}M6.1 ${y(11)}A5.62 5.62 0 0 1 11.72 ${y(16.62)}`;
};

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-bento-cast-0', x1: 0, y1: 2, x2: 0, y2: 22, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': C1, 'stop-opacity': 0.17 }],
      ]],
      ['linearGradient', { id: 'wg-bento-cast-1', x1: 2, y1: 0, x2: 22, y2: 0, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SN, 'stop-opacity': 0 }],
        ['stop', { offset: 0.3, 'stop-color': SN, 'stop-opacity': 0.95 }],
        ['stop', { offset: 0.7, 'stop-color': SN, 'stop-opacity': 0.95 }],
        ['stop', { offset: 1, 'stop-color': SN, 'stop-opacity': 0 }],
      ]],
      ['linearGradient', { id: 'wg-bento-cast-2', x1: 0, y1: 7.18, x2: 0, y2: 16.62, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1, 'stop-opacity': 0.3 }],
        ['stop', { offset: 1, 'stop-color': C1, 'stop-opacity': 0.55 }],
      ]],
    ]],
    ['path', { d: TILE, fill: 'var(--with-bento-tint, #EEF0FF)', class: 'wm-deco' }],
    ['path', { d: TILE, fill: 'url(#wg-bento-cast-0)', stroke: C1, 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62', stroke: 'url(#wg-bento-cast-1)', 'stroke-width': 0.5, class: 'wm-deco' }],
    ['path', { d: screen(0.55), fill: SH, stroke: SH, 'stroke-width': 2.6, opacity: 0.07, class: 'wm-shadow' }],
    ['path', { d: screen(0.3), fill: SH, stroke: SH, 'stroke-width': 1.55, opacity: 0.08, class: 'wm-shadow' }],
    ['path', { d: screen(0), fill: SN }],
    ['path', { d: screen(0), fill: 'url(#wg-bento-cast-2)' }],
    ['path', { d: outline(0), stroke: SH, 'stroke-width': 1.1 }],
    ['circle', { cx: 6.75, cy: 15.97, r: 0.95, fill: SH, class: 'wm-a' }],
    ['path', { d: waves(0), stroke: SH, 'stroke-width': 1.1, class: 'wm-a' }],
    ['path', { d: waves(0), stroke: C1, 'stroke-opacity': 0.72, 'stroke-width': 1.1, class: 'wm-a' }],
  ];
}
