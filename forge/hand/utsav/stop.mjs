// utsav stop: the common rounded-square stop button, drawn as a marigold plaque with a gold inner line, a ring of cream dots and a rani-pink stop square in the middle.
const INK = 'var(--with-utsav-ink, #3B0A45)';
const EDGE = 'var(--with-utsav-edge, #F4C95D)';
const SHINE = 'var(--with-utsav-shine, #FFF4DC)';
const C3 = 'var(--with-utsav-c3, #E11D74)';
const r2 = (n) => Math.round(n * 100) / 100;
const circ = (x, y, r) => `M${r2(x - r)} ${r2(y)}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`;
const rr = (x0, y0, x1, y1, r) =>
  `M${r2(x0 + r)} ${y0}H${r2(x1 - r)}A${r} ${r} 0 0 1 ${x1} ${r2(y0 + r)}V${r2(y1 - r)}A${r} ${r} 0 0 1 ${r2(x1 - r)} ${y1}H${r2(x0 + r)}A${r} ${r} 0 0 1 ${x0} ${r2(y1 - r)}V${r2(y0 + r)}A${r} ${r} 0 0 1 ${r2(x0 + r)} ${y0}z`;

export default function render(icon) {
  const n = icon && icon.name ? icon.name : 'stop';
  const g = `wg-utsav-${n}-0`;
  // dots on a rounded square ring (x 6..18), corners as quarter arcs
  const a = 6, b = 18, r = 2.2, step = 1.5;
  const pts = [];
  const side = (x0, y0, dx, dy, len) => { for (let t = step / 2; t < len; t += step) pts.push([x0 + dx * t, y0 + dy * t]); };
  const straight = b - a - 2 * r;
  side(a + r, a, 1, 0, straight);
  side(b, a + r, 0, 1, straight);
  side(b - r, b, -1, 0, straight);
  side(a, b - r, 0, -1, straight);
  const corner = (cx, cy, a0) => { for (const t of [0.17, 0.5, 0.83]) { const ang = a0 + t * Math.PI / 2; pts.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)]); } };
  corner(b - r, a + r, -Math.PI / 2);
  corner(b - r, b - r, 0);
  corner(a + r, b - r, Math.PI / 2);
  corner(a + r, a + r, Math.PI);
  const dots = pts.map(([x, y]) => circ(x, y, 0.3)).join('');
  return [
    ['defs', {}, [
      ['linearGradient', { id: g, x1: 9, y1: 3, x2: 15, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': 'var(--with-utsav-c1, #F59E0B)' }],
        ['stop', { offset: 1, 'stop-color': 'var(--with-utsav-c2, #F97316)' }],
      ]],
    ]],
    ['path', { d: rr(3.5, 3.5, 20.5, 20.5, 4), fill: `url(#${g})`, stroke: INK, 'stroke-width': 0.62, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: rr(4.7, 4.7, 19.3, 19.3, 3), fill: 'none', stroke: EDGE, 'stroke-width': 0.36, 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['path', { d: dots, fill: SHINE, class: 'wm-shine' }],
    ['path', { d: rr(8.5, 8.5, 15.5, 15.5, 1.6), fill: C3, stroke: INK, 'stroke-width': 0.62, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M9.9 10.9V10.6A.7 .7 0 0 1 10.6 9.9H11.4', fill: 'none', stroke: SHINE, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
