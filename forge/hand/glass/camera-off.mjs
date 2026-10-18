const r = (v) => String(Math.round(v * 100) / 100);
const V = (r, h) => `var(--with-glass-${r}, ${h})`;
const SH = V("shadow", "#6A45D6"), AC = V("accent", "#F2679E"), ET = V("etch", "#3E3A8C"), SN = V("shine", "#FFFFFF"), FR = V("frost", "#FFFFFF");
function defs(n) {
  const g = (i) => `wg-glass-${n}-${i}`;
  return [["defs", {}, [
    ["linearGradient", { id: g(0), x1: "3", y1: "3", x2: "23", y2: "23", gradientUnits: "userSpaceOnUse" }, [["stop", { offset: "0", "stop-color": V("back", "#7484FF") }], ["stop", { offset: "1", "stop-color": SH }]]],
    ["linearGradient", { id: g(1), x1: "1", y1: "2", x2: "21", y2: "21", gradientUnits: "userSpaceOnUse" }, [["stop", { offset: "0", "stop-color": FR, "stop-opacity": "0.6" }], ["stop", { offset: "0.4", "stop-color": V("pane", "#E4E8FF"), "stop-opacity": "0.55" }], ["stop", { offset: "1", "stop-color": V("pane", "#E4E8FF"), "stop-opacity": "0.42" }]]],
  ]]];
}
const layers = (n, shape, cls = "wm-k") => [
  ["path", { d: shape(1.6, 1.8), fill: SH, "fill-opacity": "0.08", class: "wm-shadow" }],
  ["path", { d: shape(1, 1), fill: `url(#wg-glass-${n}-0)`, class: cls }],
  ["path", { d: shape(0, 0), fill: `url(#wg-glass-${n}-1)`, stroke: "currentColor", "stroke-opacity": "0.2", "stroke-width": "0.5", "fill-rule": "evenodd", class: cls }],
];
const slash = [
  ["line", { x1: "3.2", y1: "3.2", x2: "20.8", y2: "20.8", stroke: FR, "stroke-width": "3.2", "stroke-linecap": "round", class: "wm-s" }],
  ["line", { x1: "3.2", y1: "3.2", x2: "20.8", y2: "20.8", stroke: AC, "stroke-width": "1.6", "stroke-linecap": "round", class: "wm-s" }],
];
const N = "camera-off";
const cam = (x, y) => { const p = (a, b) => r(a + x) + " " + r(b + y);
  return "M" + p(5, 7) + "L" + p(7.4, 7) + "L" + p(8.8, 4.8) + "L" + p(15.2, 4.8) + "L" + p(16.6, 7) + "L" + p(19, 7) + "Q" + p(21, 7) + " " + p(21, 9) + "L" + p(21, 17.5) + "Q" + p(21, 19.5) + " " + p(19, 19.5) + "L" + p(5, 19.5) + "Q" + p(3, 19.5) + " " + p(3, 17.5) + "L" + p(3, 9) + "Q" + p(3, 7) + " " + p(5, 7) + "Z"; };
export default function render() {
  return [...defs(N), ...layers(N, cam),
    ["circle", { cx: "12", cy: "13", r: "3.6", fill: SH, "fill-opacity": "0.55", stroke: ET, "stroke-opacity": "0.7", "stroke-width": "0.8", class: "wm-a" }],
    ["circle", { cx: "12", cy: "13", r: "1.5", fill: FR, "fill-opacity": "0.7", class: "wm-a" }],
    ["path", { d: "M5 8.2Q4.2 8.2 4.2 9.2L4.2 12", stroke: SN, "stroke-opacity": "0.85", "stroke-width": "0.8", "stroke-linecap": "round", class: "wm-shine" }],
    ...slash];
}
