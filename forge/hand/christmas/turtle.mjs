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
  const s = "M3 15a8 7.5 0 0 1 16 0z";
  return [
    ["defs", {}, [grad("wg-christmas-turtle-0", 3, 7.5, 13, 16)]],
    body("rect", { x: 4.5, y: 14.5, width: 3, height: 4.5, rx: 1.3 }, C2),
    body("rect", { x: 14.5, y: 14.5, width: 3, height: 4.5, rx: 1.3 }, C2),
    body("circle", { cx: 20.3, cy: 13.2, r: 2.4 }, C2, "wm-a"),
    ["circle", { cx: 21, cy: 12.6, r: 0.5, fill: INK, class: "wm-a" }],
    body("path", { d: s }, AC),
    ["path", { d: s, fill: "url(#wg-christmas-turtle-0)", class: "wm-shine" }],
    ["path", { d: "M9 10h4l1.5 2.5h-7zM9 10l-1.6 -1.6M13 10l1.6 -1.6M7.5 12.5l-3.4 1.2M14.5 12.5l3.4 1.2M9.3 12.5v2.5M12.7 12.5v2.5", stroke: C2, "stroke-width": 0.9, ...R, class: "wm-k" }],
    body("rect", { x: 2.5, y: 14.3, width: 17, height: 2.2, rx: 1.1 }, C2),
  ];
}
