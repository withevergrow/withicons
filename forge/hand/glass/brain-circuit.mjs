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
const N = "brain-circuit";
const brain = (x, y) => { const p = (a, b) => r(a + x) + " " + r(b + y);
  return "M" + p(13, 4.2) + "A2.6 2.6 0 0 0 " + p(8.4, 4.6) + "A2.8 2.8 0 0 0 " + p(5, 8) + "A3 3 0 0 0 " + p(3.6, 13) + "A3 3 0 0 0 " + p(5.2, 17.6) + "A2.8 2.8 0 0 0 " + p(8.6, 20.2) + "A2.6 2.6 0 0 0 " + p(13, 19.8) + "Z"; };
const node = (cx, cy) => ["circle", { cx, cy, r: "1.5", fill: AC, stroke: FR, "stroke-width": "0.9", class: "wm-a" }];
const tr = (d) => [["path", { d, stroke: FR, "stroke-width": "2.4", "stroke-linecap": "round", "stroke-linejoin": "round", class: "wm-a" }], ["path", { d, stroke: AC, "stroke-width": "1.3", "stroke-linecap": "round", "stroke-linejoin": "round", class: "wm-a" }]];
export default function render() {
  return [...defs(N), ...layers(N, brain),
    ["path", { d: "M13 7.5Q10.4 7.5 9.6 9.4M13 12Q10.6 12 8.6 13.4M6 11.4Q7.6 11 8.2 9.6M13 16.4Q10.8 16.2 10 18", stroke: SH, "stroke-opacity": "0.9", "stroke-width": "1.1", "stroke-linecap": "round" }],
    ["path", { d: "M8 5.6Q6.4 6 6 7.6", stroke: SN, "stroke-opacity": "0.85", "stroke-width": "0.8", "stroke-linecap": "round", class: "wm-shine" }],
    ...tr("M12.4 7.5L16 7.5L17.6 5.9"), ...tr("M12.4 12L18.5 12"), ...tr("M12.4 16.5L16 16.5L17.6 18.1"),
    node("18.6", "5"), node("20", "12"), node("18.6", "19")];
}
