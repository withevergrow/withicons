const r2 = (n) => Math.round(n * 100) / 100;
function defs(n) {
  const g = (i) => `wg-liquid-${n}-${i}`;
  const lin = (i, x1, y1, x2, y2, stops) => ["linearGradient", { id: g(i), x1, y1, x2, y2, gradientUnits: "userSpaceOnUse" }, stops.map(([o, c, op]) => ["stop", op == null ? { offset: o, "stop-color": c } : { offset: o, "stop-color": c, "stop-opacity": op }])];
  const C1 = "var(--with-liquid-c1, #4A9DFF)", C2 = "var(--with-liquid-c2, #A77BFF)", C3 = "var(--with-liquid-c3, #1C3F9E)", SH = "var(--with-liquid-shine, #FFFFFF)";
  return ["defs", {}, [
    lin(0, 3, 3, 21, 21, [[0, C1, 0.14], [0.6, C1, 0.36], [1, C1, 0.62]]),
    lin(1, 3, 3, 21, 21, [[0, C2, 0.3], [1, C2, 0.75]]),
    lin(2, 3, 3, 21, 21, [[0, C3, 0.36], [1, C3, 0.95]]),
    ["radialGradient", { id: g(4), cx: 9, cy: 8, r: 10, gradientUnits: "userSpaceOnUse" }, [["stop", { offset: 0, "stop-color": SH, "stop-opacity": 0.8 }], ["stop", { offset: 1, "stop-color": SH, "stop-opacity": 0 }]]],
    lin(5, 3, 10, 9, 23, [[0, "var(--with-liquid-shadow, #0C1A3A)", 0.1], [1, "var(--with-liquid-c4, #FF7EC1)", 0.32]]),
  ]];
}
function part(n, shape, cls, fill, shadow = true) {
  const u = (i) => `url(#wg-liquid-${n}-${i})`;
  const out = [];
  if (shadow) out.push(shape(0.4, 0.8, { fill: u(5), class: "wm-shadow" }));
  out.push(shape(0, 0, { fill: fill || u(0), stroke: "currentColor", "stroke-opacity": 0.3, "stroke-width": 0.22, class: cls }));
  out.push(shape(0, 0, { stroke: u(2), "stroke-width": 0.5, "stroke-linejoin": "round", class: cls }));
  out.push(shape(0, 0, { fill: u(4), class: cls === "wm-k" ? "wm-shine" : cls }));
  return out;
}
const rect = (x, y, w, h, rx) => (dx, dy, a) => ["rect", { x: r2(x + dx), y: r2(y + dy), width: w, height: h, rx, ...a }];
const ell = (cx, cy, rx, ry) => (dx, dy, a) => ["ellipse", { cx: r2(cx + dx), cy: r2(cy + dy), rx, ry, ...a }];
const pth = (f) => (dx, dy, a) => ["path", { d: f(dx, dy), ...a }];
const EDGE = "var(--with-liquid-edge, #B9E6FF)", ACC = "var(--with-liquid-accent, #FF5F8F)", C3V = "var(--with-liquid-c3, #1C3F9E)", C2V = "var(--with-liquid-c2, #A77BFF)";

export default function render() {
  const n = "cloud-off";
  const cloud = pth((dx, dy) => `M${r2(7 + dx)} ${r2(18.5 + dy)}h10a4.2 4.2 0 0 0 .5-8.37a6 6 0 0 0-11.3 1.07a3.7 3.7 0 0 0 .8 7.3z`);
  return [defs(n), ...part(n, cloud, "wm-k"),
    ["line", { x1: 3.5, y1: 3.5, x2: 20.5, y2: 20.5, stroke: EDGE, "stroke-width": 3.2, "stroke-linecap": "round", class: "wm-s" }],
    ["line", { x1: 3.5, y1: 3.5, x2: 20.5, y2: 20.5, stroke: ACC, "stroke-width": 1.6, "stroke-linecap": "round", class: "wm-s" }]];
}
