// utsav eye-off: festive almond eye (iris ring, pupil, dotted trim) crossed by a slim magenta slash offset past the pupil.
const INK = 'var(--with-utsav-ink, #3B0A45)';
const EDGE = 'var(--with-utsav-edge, #F4C95D)';
const SHINE = 'var(--with-utsav-shine, #FFF4DC)';
const C3 = 'var(--with-utsav-c3, #E11D74)';
const r2 = (n) => Math.round(n * 100) / 100;

function bez(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const f = (i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i];
  return [f(0), f(1)];
}
const circ = (x, y, r) => `M${r2(x - r)} ${r2(y)}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`;

export default function render(icon) {
  const n = icon && icon.name ? icon.name : 'eye-off';
  const g = `wg-utsav-${n}-0`;
  const lid = 'M2 12C4.6 1.6 19.4 1.6 22 12C19.4 22.4 4.6 22.4 2 12z';
  const inner = 'M3.2 12C5.8 3.4 18.2 3.4 20.8 12C18.2 20.6 5.8 20.6 3.2 12z';
  // trim dots along an inset lid, on the sides only
  const curves = [
    [[3.9, 12], [6.4, 4.5], [17.6, 4.5], [20.1, 12]],
    [[3.9, 12], [6.4, 19.5], [17.6, 19.5], [20.1, 12]],
  ];
  let dots = '';
  for (const c of curves) {
    for (const t of [0.07, 0.15, 0.23, 0.31, 0.69, 0.77, 0.85, 0.93]) {
      const [x, y] = bez(c[0], c[1], c[2], c[3], t);
      dots += circ(x, y, 0.3);
    }
  }
  return [
    ['defs', {}, [
      ['linearGradient', { id: g, x1: 9, y1: 4, x2: 15, y2: 20, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': 'var(--with-utsav-c1, #F59E0B)' }],
        ['stop', { offset: 1, 'stop-color': 'var(--with-utsav-c2, #F97316)' }],
      ]],
    ]],
    ['path', {
      d: lid + circ(12, 12, 4.2) + circ(12, 12, 2.7),
      fill: `url(#${g})`, 'fill-rule': 'evenodd', stroke: INK, 'stroke-width': 0.62, 'stroke-linejoin': 'round', class: 'wm-k',
    }],
    ['path', { d: inner, fill: 'none', stroke: EDGE, 'stroke-width': 0.36, 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['circle', { cx: 12, cy: 12, r: 1.1, fill: INK, class: 'wm-k' }],
    ['path', { d: dots, fill: SHINE, class: 'wm-shine' }],
    ['line', { x1: 7, y1: 3.61, x2: 19.2, y2: 15.81, stroke: INK, 'stroke-width': 1.9, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['line', { x1: 7, y1: 3.61, x2: 19.2, y2: 15.81, stroke: C3, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-s' }],
  ];
}
