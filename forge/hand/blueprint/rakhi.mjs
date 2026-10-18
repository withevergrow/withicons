const A = "var(--with-accent, currentColor)";
const f = (n) => Math.round(n * 100) / 100;
const dot = (cx, cy, c = "wm-k") => ["circle", { cx, cy, r: 0.8, color: A, stroke: "currentColor", "stroke-width": 0.5, class: c }];
// scalloped medallion: n arcs bulging by b outside radius r
function scallop(cx, cy, r, n, b) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a0 = i * 2 * Math.PI / n, a1 = (i + 1) * 2 * Math.PI / n, am = (a0 + a1) / 2;
    const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
    const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
    const q = [cx + (r + b) * Math.cos(am), cy + (r + b) * Math.sin(am)];
    d += (i ? "" : `M${f(p0[0])} ${f(p0[1])}`) + `Q${f(q[0])} ${f(q[1])} ${f(p1[0])} ${f(p1[1])}`;
  }
  return d + "Z";
}
// diagonal thread through the medallion centre (12,12), point-symmetric
const side = (s) => {
  const P = (u, v) => [f(12 + s * (0.7071 * u + 0.7071 * v)), f(12 + s * (-0.7071 * u + 0.7071 * v))];
  const a0 = P(6.2, -0.85), a1 = P(9, -0.85), b0 = P(6.2, 0.85), b1 = P(9, 0.85);
  const k = P(10, 0);
  const t1 = P(12, -1.1), t2 = P(12, 1.1);
  return {
    strands: `M${a0[0]} ${a0[1]}L${a1[0]} ${a1[1]}M${b0[0]} ${b0[1]}L${b1[0]} ${b1[1]}`,
    tails: `M${k[0]} ${k[1]}L${t1[0]} ${t1[1]}M${k[0]} ${k[1]}L${t2[0]} ${t2[1]}`,
    knot: k,
  };
};
export default function render() {
  const A1 = side(1), B1 = side(-1);
  return [
    ["path", { d: "M6 23H18M6 21.7V23.3M18 21.7V23.3", color: A, stroke: "currentColor", "stroke-width": 0.45, "stroke-opacity": 0.5, class: "wm-deco" }],
    ["path", { d: "M5.35 23.65L6.65 22.35M17.35 23.65L18.65 22.35", color: A, stroke: "currentColor", "stroke-width": 0.5, "stroke-opacity": 0.75, class: "wm-deco" }],
    ["path", { d: A1.strands + B1.strands, class: "wm-k" }],
    ["path", { d: A1.tails + B1.tails, class: "wm-a" }],
    ["path", { d: scallop(12, 12, 4.6, 8, 1.8), class: "wm-k" }],
    ["circle", { cx: 12, cy: 12, r: 2.7, class: "wm-k" }],
    dot(12, 12, "wm-s"),
    dot(A1.knot[0], A1.knot[1]),
    dot(B1.knot[0], B1.knot[1]),
  ];
}
