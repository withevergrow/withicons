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
  const d = "M4.5 9.5h3l4.5 -4v13l-4.5 -4h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1z";
  return [
    ["defs", {}, [grad("wg-christmas-volume-1-0", 3.5, 5.5, 12, 18.5)]],
    body("path", { d }, AC),
    ["path", { d, fill: "url(#wg-christmas-volume-1-0)", class: "wm-shine" }],
    ...line("M15.5 9a4.2 4.2 0 0 1 0 6", C1, "wm-a"),
  ];
}
