// suite/cast: clean screen frame open at the bottom-left, three cast waves in the corner.
const FRAME = 'M1 8V6a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-7a1.25 1.25 0 0 1 0-2.5h6.5a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1h-15a1 1 0 0 0-1 1v1.5a1.25 1.25 0 0 1-2.5 0z';
const SHADOW = 'M22.9 18.6c-.3 1.4-1.5 2.4-2.9 2.4h-7a1.25 1.25 0 0 1-1.2-.9 1.25 1.25 0 0 0 1.2 1.6h7c1.6 0 2.9-1.3 2.9-3.1z';
const WAVES = 'M2 15.5a5 5 0 0 1 5 5M2 11.5a9 9 0 0 1 9 9';
export default function render() {
  const g = (n, a, b) => ['stop', { offset: n, 'stop-color': a, ...(b != null ? { 'stop-opacity': b } : {}) }];
  const sheen = (id, x1, y1, x2, y2) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, [
    g('0', 'var(--with-suite-shine, #FFFFFF)', '0.3'), g('0.5', 'var(--with-suite-shine, #FFFFFF)', '0'),
    g('0.5', 'var(--with-suite-shadow, #0B1E5B)', '0'), g('1', 'var(--with-suite-shadow, #0B1E5B)', '0.24')]];
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-suite-cast-0', x1: '0', y1: '3', x2: '0', y2: '21', gradientUnits: 'userSpaceOnUse' }, [
        g('0', 'var(--with-suite-c1, #3478F6)'), g('1', 'var(--with-suite-shadow, #0B1E5B)')]],
      sheen('wg-suite-cast-1', '1', '3', '23', '21'),
    ]],
    ['path', { d: SHADOW, fill: 'url(#wg-suite-cast-0)', class: 'wm-shadow' }],
    ['path', { d: FRAME, fill: 'var(--with-suite-c1, #3478F6)', class: 'wm-k' }],
    ['path', { d: FRAME, fill: 'url(#wg-suite-cast-1)', class: 'wm-k' }],
    ['path', { d: WAVES, stroke: 'var(--with-suite-c2, #7B61F0)', 'stroke-width': '2.5', 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['circle', { cx: '2.6', cy: '19.9', r: '1.6', fill: 'var(--with-suite-c2, #7B61F0)', class: 'wm-a' }],
  ];
}
