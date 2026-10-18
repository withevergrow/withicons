const A = "var(--with-accent, currentColor)";
const f = (n) => Math.round(n * 100) / 100;
const H = [12, 8], R = 4.9;
// arc of an ear circle that lies outside the head circle
function ear(cx, cy, r, sweep) {
  const dx = cx - H[0], dy = cy - H[1], d = Math.hypot(dx, dy);
  const a = (R * R - r * r + d * d) / (2 * d), h = Math.sqrt(R * R - a * a);
  const mx = H[0] + a * dx / d, my = H[1] + a * dy / d;
  const p1 = [mx - h * dy / d, my + h * dx / d], p2 = [mx + h * dy / d, my - h * dx / d];
  return `M${f(p1[0])} ${f(p1[1])}A${r} ${r} 0 1 ${sweep} ${f(p2[0])} ${f(p2[1])}`;
}
export default function render() {
  return [
    ["path", { d: "M5 23H19M5 21.7V23.3M19 21.7V23.3", color: A, stroke: "currentColor", "stroke-width": 0.45, "stroke-opacity": 0.5, class: "wm-deco" }],
    ["path", { d: "M4.35 23.65L5.65 22.35M18.35 23.65L19.65 22.35", color: A, stroke: "currentColor", "stroke-width": 0.5, "stroke-opacity": 0.75, class: "wm-deco" }],
    ["path", { d: ear(6.7, 4.4, 2, 0), class: "wm-k" }],
    ["path", { d: ear(17.3, 4.4, 2, 0), class: "wm-k" }],
    ["circle", { cx: 12, cy: 8, r: R, class: "wm-k" }],
    ["path", { d: "M8.9 12C6.5 13.2 5 15.2 5 17.4C5 19.6 7.5 20.5 12 20.5C16.5 20.5 19 19.6 19 17.4C19 15.2 17.5 13.2 15.1 12", class: "wm-k" }],
    ["path", { d: "M9.9 6.7H10M14 6.7H14.1", "stroke-width": 1.6, class: "wm-a" }],
    ["ellipse", { cx: 12, cy: 9.5, rx: 1.8, ry: 1.3, class: "wm-a" }],
    ["path", { d: "M12 18.9C12 18.9 8.8 17.2 8.8 15.4C8.8 14.5 9.5 13.9 10.3 13.9C11.1 13.9 11.7 14.4 12 15C12.3 14.4 12.9 13.9 13.7 13.9C14.5 13.9 15.2 14.5 15.2 15.4C15.2 17.2 12 18.9 12 18.9Z", class: "wm-a" }],
    ["path", { d: "M5.9 15.6C6.2 17.2 7.1 18 8.4 18.1M18.1 15.6C17.8 17.2 16.9 18 15.6 18.1", class: "wm-a" }],
  ];
}
