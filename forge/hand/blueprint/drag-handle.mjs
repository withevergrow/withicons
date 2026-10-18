const G = { color: "var(--with-accent, currentColor)", stroke: "currentColor", "stroke-width": 0.45, "stroke-opacity": 0.5, class: "wm-deco" };
export default function render() {
  const dots = [];
  for (const y of [6, 12, 18]) for (const x of [9, 15]) dots.push(["circle", { cx: x, cy: y, r: 1.7, fill: "currentColor", stroke: "none", class: "wm-k" }]);
  return [["path", { d: "M5 2.5V21.5M19 2.5V21.5", ...G }], ...dots];
}
