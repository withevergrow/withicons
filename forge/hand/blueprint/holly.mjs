const A="var(--with-accent, currentColor)";const G=(d,o=0.5)=>["path",{d,color:A,stroke:"currentColor","stroke-width":0.45,"stroke-opacity":o,class:"wm-deco"}];const N=(pts)=>["path",{d:pts.map(([x,y])=>`M${(x+0.8).toFixed(2)} ${y}A.8.8 0 1 0 ${(x-0.8).toFixed(2)} ${y}A.8.8 0 1 0 ${(x+0.8).toFixed(2)} ${y}`).join(""),color:A,stroke:"currentColor","stroke-width":0.5,class:"wm-k"}];const f=n=>+n.toFixed(2);
function leaf(bx, by, tx, ty) {
  const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const P = (t, w) => f(bx + dx * t + nx * w) + " " + f(by + dy * t + ny * w);
  const W = (t) => 3.9 * Math.sin(Math.PI * t);
  let d = "M" + P(0, 0);
  for (const s of [1, -1]) {
    const ts = s > 0 ? [0, 1 / 3, 2 / 3, 1] : [1, 2 / 3, 1 / 3, 0];
    for (let i = 1; i < 4; i++) { const m = (ts[i - 1] + ts[i]) / 2; d += "Q" + P(m, s * W(m) * 0.45) + " " + P(ts[i], s * W(ts[i])); }
  }
  return d + "ZM" + P(0.1, 0) + "L" + P(0.85, 0);
}
export default function render() {
  return [
    G("M2.75 22.75H21.25M2.75 21.95V23.55M21.25 21.95V23.55"),
    ["path", { d: leaf(10.9, 13.6, 1.6, 21) + leaf(13.1, 13.6, 22.4, 21), class: "wm-k" }],
    ["path", { d: "M14.2 10.4A2.2 2.2 0 1 1 9.8 10.4A2.2 2.2 0 1 1 14.2 10.4ZM11.5 5.4A2.2 2.2 0 1 1 7.1 5.4A2.2 2.2 0 1 1 11.5 5.4ZM16.9 5.4A2.2 2.2 0 1 1 12.5 5.4A2.2 2.2 0 1 1 16.9 5.4Z", fill: "currentColor", "fill-opacity": 0.25, class: "wm-a" }],
  ];
}
