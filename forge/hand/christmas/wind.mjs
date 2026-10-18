const INK = "var(--with-christmas-ink, #3A0F17)";
const C1 = "var(--with-christmas-c1, #C8203A)";
const C2 = "var(--with-christmas-c2, #1F6E46)";
const C4 = "var(--with-christmas-c4, #FFF5E6)";
const AC = "var(--with-christmas-accent, #F4C24D)";
const SHINE = "var(--with-christmas-shine, #FFFFFF)";
const SHADOW = "var(--with-christmas-shadow, #4A0716)";
const R = { "stroke-linecap": "round", "stroke-linejoin": "round" };
const line = (d, c, cls = "wm-k") => [["path", { d, stroke: INK, "stroke-width": 3, ...R, class: cls }], ["path", { d, stroke: c, "stroke-width": 1.8, ...R, class: cls }]];
const grad = (id, x1, y1, x2, y2) => ["linearGradient", { id, x1, y1, x2, y2, gradientUnits: "userSpaceOnUse" }, [
  ["stop", { offset: 0, "stop-color": SHINE, "stop-opacity": 0.34 }], ["stop", { offset: 0.42, "stop-color": SHINE, "stop-opacity": 0 }],
  ["stop", { offset: 0.58, "stop-color": SHADOW, "stop-opacity": 0 }], ["stop", { offset: 1, "stop-color": SHADOW, "stop-opacity": 0.42 }]]];
const body = (tag, a, fill, cls = "wm-k") => ["" + tag, { ...a, fill, stroke: INK, "stroke-width": 0.6, "stroke-linejoin": "round", class: cls }];

export default function render() {
  return [
    ...line("M3 8h9.5a2.5 2.5 0 1 0 -2.5 -2.5", C2),
    ...line("M3 12h14.5a2.5 2.5 0 1 1 -2.5 2.5", C2, "wm-a"),
    ...line("M3 16h7", C2),
    ["path", { d: "M20 3.2Q20.3 4.4 21.5 4.7Q20.3 5 20 6.2Q19.7 5 18.5 4.7Q19.7 4.4 20 3.2z", fill: AC, stroke: INK, "stroke-width": 0.28, "stroke-linejoin": "round", class: "wm-deco" }],
  ];
}
