// utsav avatar-panda: cream face, plum ears with pink centres, tilted plum eye patches, pink bindu on the forehead, gold inner ring and dot work along the chin.
const INK = 'var(--with-utsav-ink, #3B0A45)';
const EDGE = 'var(--with-utsav-edge, #F4C95D)';
const SHINE = 'var(--with-utsav-shine, #FFF4DC)';
const C3 = 'var(--with-utsav-c3, #E11D74)';
const r2 = (n) => Math.round(n * 100) / 100;
const circ = (x, y, r) => `M${r2(x - r)} ${r2(y)}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`;
// tilted ellipse (rot deg clockwise) as two arcs through the ends of its tilted y axis
function tilt(cx, cy, rx, ry, rot) {
  const t = (rot * Math.PI) / 180;
  const dx = -ry * Math.sin(t), dy = ry * Math.cos(t);
  return `M${r2(cx + dx)} ${r2(cy + dy)}A${rx} ${ry} ${rot} 1 1 ${r2(cx - dx)} ${r2(cy - dy)}A${rx} ${ry} ${rot} 1 1 ${r2(cx + dx)} ${r2(cy + dy)}z`;
}

export default function render(icon) {
  const n = icon && icon.name ? icon.name : 'avatar-panda';
  const g = `wg-utsav-${n}-0`;
  const cx = 12, cy = 13.75;
  let dots = '';
  for (let a = 28; a <= 152; a += 13.8) {
    const t = (a * Math.PI) / 180;
    dots += circ(cx + 5.6 * Math.cos(t), cy + 5.6 * Math.sin(t), 0.3);
  }
  return [
    ['defs', {}, [
      ['linearGradient', { id: g, x1: 9, y1: 7, x2: 15, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': 'var(--with-utsav-shine, #FFF4DC)' }],
        ['stop', { offset: 1, 'stop-color': 'var(--with-utsav-edge, #F4C95D)', 'stop-opacity': 0.65 }],
      ]],
    ]],
    ['circle', { cx: 5.9, cy: 7, r: 2.9, fill: INK, stroke: EDGE, 'stroke-width': 0.7, class: 'wm-k' }],
    ['circle', { cx: 18.1, cy: 7, r: 2.9, fill: INK, stroke: EDGE, 'stroke-width': 0.7, class: 'wm-k' }],
    ['circle', { cx: 5.9, cy: 7, r: 1.2, fill: C3, class: 'wm-deco' }],
    ['circle', { cx: 18.1, cy: 7, r: 1.2, fill: C3, class: 'wm-deco' }],
    ['circle', { cx, cy, r: 8, fill: SHINE, class: 'wm-k' }],
    ['circle', { cx, cy, r: 8, fill: `url(#${g})`, stroke: INK, 'stroke-width': 0.62, class: 'wm-k' }],
    ['circle', { cx, cy, r: 6.9, fill: 'none', stroke: EDGE, 'stroke-width': 0.36, class: 'wm-shine' }],
    ['path', { d: dots, fill: C3, class: 'wm-shine' }],
    ['path', { d: tilt(8.7, 13, 1.9, 2.7, 30), fill: INK, class: 'wm-k' }],
    ['path', { d: tilt(15.3, 13, 1.9, 2.7, -30), fill: INK, class: 'wm-k' }],
    ['circle', { cx: 8.9, cy: 12.8, r: 0.85, fill: SHINE, class: 'wm-a' }],
    ['circle', { cx: 15.1, cy: 12.8, r: 0.85, fill: SHINE, class: 'wm-a' }],
    ['path', { d: 'M10.5 15.6Q12 14.9 13.5 15.6Q13.2 16.9 12 17.3Q10.8 16.9 10.5 15.6z', fill: INK, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['circle', { cx: 12, cy: 9.6, r: 0.8, fill: C3, stroke: INK, 'stroke-width': 0.3, class: 'wm-deco' }],
  ];
}
