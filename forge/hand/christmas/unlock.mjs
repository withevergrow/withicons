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
  const b = "M6.5 10.5h11a2.5 2.5 0 0 1 2.5 2.5v6a2.5 2.5 0 0 1 -2.5 2.5h-11a2.5 2.5 0 0 1 -2.5 -2.5v-6a2.5 2.5 0 0 1 2.5 -2.5z";
  return [
    ["defs", {}, [grad("wg-christmas-unlock-0", 4, 10.5, 14, 21.5)]],
    ...line("M8 10.5v-4a4 4 0 0 1 7.6 -1.7", C4, "wm-a"),
    body("path", { d: b }, C1),
    ["path", { d: b, fill: "url(#wg-christmas-unlock-0)", class: "wm-shine" }],
    ["path", { d: "M12 13.6a1.4 1.4 0 0 1 .7 2.6v1.8h-1.4v-1.8a1.4 1.4 0 0 1 .7 -2.6z", fill: INK, class: "wm-k" }],
  ];
}
