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
const N = "cloud-lightning";
const cloud = (x, y) => { const p = (a, b) => r(a + x) + " " + r(b + y);
  return "M" + p(7, 16) + "A4 4 0 0 1 " + p(6.4, 8.05) + "A5.6 5.6 0 0 1 " + p(17, 7.2) + "A4.4 4.4 0 0 1 " + p(17.4, 16) + "Z"; };
export default function render() {
  return [...defs(N), ...layers(N, cloud),
    ["path", { d: "M6 10Q6.6 8.6 8 8.4", stroke: SN, "stroke-opacity": "0.85", "stroke-width": "0.8", "stroke-linecap": "round", class: "wm-shine" }],
    ["path", { d: "M14.4 9.6L8 17.4L11.8 17.4L10 23L17 14.6L13 14.6L15.8 9.6Z", fill: "none", stroke: FR, "stroke-width": "2.2", "stroke-linejoin": "round", class: "wm-a" }],
    ["path", { d: "M14.4 9.6L8 17.4L11.8 17.4L10 23L17 14.6L13 14.6L15.8 9.6Z", fill: AC, stroke: AC, "stroke-width": "0.8", "stroke-linejoin": "round", class: "wm-a" }],
    ["path", { d: "M14.2 10.8L10.4 15.8", stroke: SN, "stroke-opacity": "0.8", "stroke-width": "0.7", "stroke-linecap": "round", class: "wm-shine" }]];
}
