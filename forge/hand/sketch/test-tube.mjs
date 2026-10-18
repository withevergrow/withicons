// Hand-drawn sketch test tube: tilted 45deg like line, thin rim line, liquid level + hatch.
const T = [19.3, 4.7]; // top centre of tube
const D = [-Math.SQRT1_2, Math.SQRT1_2]; // along axis (down-left)
const N = [Math.SQRT1_2, Math.SQRT1_2]; // across axis
const f = (v) => Math.round(v * 100) / 100;
const P = (x, y) => [f(T[0] + N[0] * x + D[0] * y), f(T[1] + N[1] * x + D[1] * y)];
const W = 2.8, L = 12;

function outline(j) {
  const pts = [];
  for (let i = 0; i <= 5; i++) pts.push(P(-W + j[0], (L * i) / 5 + (i % 2 ? j[1] : 0)));
  for (let i = 1; i < 12; i++) {
    const a = Math.PI - (Math.PI * i) / 12;
    pts.push(P(W * Math.cos(a) + j[0] * 0.5, L + W * Math.sin(a) + j[1]));
  }
  for (let i = 5; i >= 0; i--) pts.push(P(W - j[0], (L * i) / 5 + (i % 2 ? -j[1] : 0)));
  return 'M' + pts.map((p) => p.join(' ')).join('L');
}
const seg = (a, b) => `M${P(...a).join(' ')}L${P(...b).join(' ')}`;

export default function render() {
  return [
    ['path', { d: seg([-0.8, 8.8], [1.6, 7.2]) + seg([-1.6, 12.4], [1.8, 9.8]), 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: outline([0.15, 0.12]), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: outline([0, 0]), class: 'wm-k' }],
    ['path', { d: seg([-3.9, 0.1], [3.8, -0.1]), class: 'wm-k' }],
    ['path', { d: seg([-W, 6.3], [W, 6.1]), class: 'wm-a' }],
  ];
}
