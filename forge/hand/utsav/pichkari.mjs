// utsav pichkari: the Holi water gun along the line axis (marigold barrel with pink band, plunger rod and pink T-handle at the left, teal nozzle at the right with a coloured spray fan).
const INK = 'var(--with-utsav-ink, #3B0A45)';
const EDGE = 'var(--with-utsav-edge, #F4C95D)';
const SHINE = 'var(--with-utsav-shine, #FFF4DC)';
const C3 = 'var(--with-utsav-c3, #E11D74)';
const C4 = 'var(--with-utsav-c4, #0F766E)';
const ACC = 'var(--with-utsav-accent, #D4A017)';
const r2 = (n) => Math.round(n * 100) / 100;
const circ = (x, y, r) => `M${r2(x - r)} ${r2(y)}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`;

const ANG = (-32 * Math.PI) / 180;
const CX = 11.4, CY = 13.2;
const P = (u, v) => [r2(CX + u * Math.cos(ANG) - v * Math.sin(ANG)), r2(CY + u * Math.sin(ANG) + v * Math.cos(ANG))];
const pt = (u, v) => P(u, v).join(' ');
// rounded rect in (u,v) space, rotated onto the gun axis
function rrot(u0, u1, v0, v1, r) {
  if (!r) return `M${pt(u0, v0)}L${pt(u1, v0)}L${pt(u1, v1)}L${pt(u0, v1)}z`;
  return `M${pt(u0 + r, v0)}L${pt(u1 - r, v0)}A${r} ${r} 0 0 1 ${pt(u1, v0 + r)}L${pt(u1, v1 - r)}A${r} ${r} 0 0 1 ${pt(u1 - r, v1)}L${pt(u0 + r, v1)}A${r} ${r} 0 0 1 ${pt(u0, v1 - r)}L${pt(u0, v0 + r)}A${r} ${r} 0 0 1 ${pt(u0 + r, v0)}z`;
}
const ln = (u0, v0, u1, v1, stroke, w, cls) => {
  const a = P(u0, v0), b = P(u1, v1);
  return ['line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke, 'stroke-width': w, 'stroke-linecap': 'round', class: cls }];
};
// bold two-layer streak: ink outline under a coloured core
const streak = (u0, v0, u1, v1, col) => [ln(u0, v0, u1, v1, INK, 2.8, 'wm-s'), ln(u0, v0, u1, v1, col, 1.5, 'wm-s')];
const drop = (u, v, r, col) => ['circle', { cx: P(u, v)[0], cy: P(u, v)[1], r, fill: col, stroke: INK, 'stroke-width': 0.5, class: 'wm-s' }];

export default function render(icon) {
  const n = icon && icon.name ? icon.name : 'pichkari';
  const g = `wg-utsav-${n}-0`;
  // long tapered nozzle from the front flange to a small round tip
  const nozzle = `M${pt(5.4, -1.6)}L${pt(8.4, -0.8)}A0.8 0.8 0 0 1 ${pt(8.4, 0.8)}L${pt(5.4, 1.6)}z`;
  return [
    ['defs', {}, [
      ['linearGradient', { id: g, x1: 5, y1: 8, x2: 14, y2: 18, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': 'var(--with-utsav-c1, #F59E0B)' }],
        ['stop', { offset: 1, 'stop-color': 'var(--with-utsav-c2, #F97316)' }],
      ]],
    ]],
    ...streak(9.6, -1.2, 10.6, -3.6, C3),
    ...streak(9.8, 0, 11.2, 0, ACC),
    ...streak(9.6, 1.2, 10.6, 3.6, C4),
    drop(11.6, -2.2, 0.85, SHINE), drop(11.4, 2.4, 0.85, C3),
    ln(-8.1, 0, -5, 0, INK, 3, 'wm-a'), ln(-8.1, 0, -5, 0, EDGE, 1.6, 'wm-a'),
    ln(-8.4, -2.9, -8.4, 2.9, INK, 4, 'wm-a'), ln(-8.4, -2.9, -8.4, 2.9, C3, 2.6, 'wm-a'),
    ['path', { d: nozzle, fill: C4, stroke: INK, 'stroke-width': 0.62, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: rrot(-4.9, 4.9, -3.5, 3.5, 0.9), fill: `url(#${g})`, stroke: INK, 'stroke-width': 0.62, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: rrot(-5.9, -4.5, -4.4, 4.4, 0.5), fill: C3, stroke: INK, 'stroke-width': 0.55, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: rrot(4.5, 5.9, -4.4, 4.4, 0.5), fill: C3, stroke: INK, 'stroke-width': 0.55, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: `M${pt(-3, -2.2)}L${pt(3, -2.2)}`, fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: `M${pt(-1.6, 1.6)}L${pt(1.6, 1.6)}`, fill: 'none', stroke: EDGE, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
