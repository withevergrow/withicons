// sketch / champagne-toast: two flutes leaning in, rims clinking, liquid hatched, sparkle above.
const r = (n) => Math.round(n * 100) / 100;

function flute(fx, fy, deg) {
  const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
  const P = (x, y) => `${r(fx + x * c - y * s)} ${r(fy + x * s + y * c)}`;
  const body =
    `M${P(-3, 0.2)}Q${P(0, -0.3)} ${P(3, 0.1)}` + // foot
    `M${P(0, 0)}L${P(0.05, -6)}` + // stem
    `M${P(0, -6)}Q${P(-2.7, -8)} ${P(-2.4, -15.5)}` + // bowl left
    `Q${P(0, -15.3)} ${P(2.4, -15.5)}` + // rim
    `Q${P(2.7, -8)} ${P(0, -6)}`; // bowl right
  const ghost =
    `M${P(-2.6, 0.6)}Q${P(0.3, 0.1)} ${P(3.2, 0.5)}` +
    `M${P(0.3, -0.4)}L${P(0.3, -6.2)}` +
    `M${P(0.3, -6.3)}Q${P(-2.5, -8.4)} ${P(-2.1, -15.8)}` +
    `Q${P(0.2, -15.7)} ${P(2.7, -15.8)}Q${P(2.9, -8.4)} ${P(0.3, -6.3)}`;
  const hatch =
    `M${P(-1.1, -7.6)}L${P(0.9, -8.6)}` +
    `M${P(-1.8, -9.2)}L${P(1.7, -10.9)}` +
    `M${P(-2.1, -11)}L${P(2.1, -12.1)}`;
  const liquid = `M${P(-2.3, -12.4)}Q${P(0, -12.1)} ${P(2.3, -12.5)}`;
  const [bx, by] = P(0.4, -13.9).split(' ');
  return { body, ghost, hatch, liquid, bubble: [+bx, +by] };
}

export default function render() {
  const L = flute(6, 21.5, 14);
  const R = flute(18, 21.5, -14);
  return [
    ['path', { d: L.hatch + R.hatch, 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: L.ghost + R.ghost, 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: L.body + R.body, class: 'wm-k' }],
    ['path', { d: L.liquid + R.liquid, 'stroke-width': 1, class: 'wm-a' }],
    ['circle', { cx: L.bubble[0], cy: L.bubble[1], r: 0.45, fill: 'currentColor', stroke: 'none', class: 'wm-a' }],
    ['circle', { cx: R.bubble[0] - 0.8, cy: R.bubble[1] + 0.3, r: 0.4, fill: 'currentColor', stroke: 'none', class: 'wm-a' }],
    ['path', { d: 'M12 4.6q.1-1.3 0-2.6M8.9 4.1q-.5-.9-1.2-1.6M15.1 4.1q.5-.9 1.2-1.6', class: 'wm-s' }],
  ];
}
