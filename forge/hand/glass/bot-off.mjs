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
const N = "bot-off";
const head = (x, y) => { const p = (a, b) => r(a + x) + " " + r(b + y);
  return "M" + p(7, 8) + "L" + p(17, 8) + "Q" + p(20, 8) + " " + p(20, 11) + "L" + p(20, 17) + "Q" + p(20, 20) + " " + p(17, 20) + "L" + p(7, 20) + "Q" + p(4, 20) + " " + p(4, 17) + "L" + p(4, 11) + "Q" + p(4, 8) + " " + p(7, 8) + "Z"
   + "M" + p(2, 12.5) + "L" + p(3.2, 12.5) + "L" + p(3.2, 15.5) + "L" + p(2, 15.5) + "Z M" + p(20.8, 12.5) + "L" + p(22, 12.5) + "L" + p(22, 15.5) + "L" + p(20.8, 15.5) + "Z"; };
export default function render() {
  return [...defs(N),
    ["line", { x1: "12", y1: "8", x2: "12", y2: "4.6", stroke: ET, "stroke-opacity": "0.7", "stroke-width": "1.1", "stroke-linecap": "round", class: "wm-a" }],
    ["circle", { cx: "12", cy: "3.6", r: "1.4", fill: AC, stroke: ET, "stroke-opacity": "0.4", "stroke-width": "0.5", class: "wm-a" }],
    ...layers(N, head),
    ["circle", { cx: "8.8", cy: "13.4", r: "1.5", fill: ET, "fill-opacity": "0.85" }],
    ["circle", { cx: "15.2", cy: "13.4", r: "1.5", fill: ET, "fill-opacity": "0.85" }],
    ["path", { d: "M9.5 17L14.5 17", stroke: ET, "stroke-opacity": "0.6", "stroke-width": "1", "stroke-linecap": "round" }],
    ["path", { d: "M6 9.2Q5 9.2 5 10.5L5 12.5", stroke: SN, "stroke-opacity": "0.85", "stroke-width": "0.8", "stroke-linecap": "round", class: "wm-shine" }],
    ...slash];
}
