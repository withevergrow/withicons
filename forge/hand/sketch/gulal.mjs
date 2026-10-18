const r2 = (n) => Math.round(n * 100) / 100;
const gh = (d) => { let i = 0; return d.replace(/-?\d+(\.\d+)?/g, (m) => String(r2(+m + ((i++ % 2) ? 0.3 : 0.25)))); };
const sk = (d, cls = "wm-k") => [["path", { d: gh(d), "stroke-width": 0.5, "stroke-opacity": 0.5, class: cls }], ["path", { d, class: cls }]];
const hatch = (d) => ["path", { d, "stroke-width": 0.8, "stroke-opacity": 0.5 }];
const dot = (cx, cy, r, cls) => [["circle", { cx: r2(cx + 0.25), cy: r2(cy + 0.3), r, "stroke-width": 0.5, "stroke-opacity": 0.5, class: cls }], ["circle", { cx, cy, r, class: cls }]];

export default function render() {
  return [
    hatch("M7 15.4L9 13.4M10.4 15.4L13.4 12.4M14.6 15.4L16.6 13.4"),
    ...sk("M2.6 13.4L21.4 13.4Q20.6 20.6 12 20.6Q3.4 20.6 2.6 13.4Z"),
    ...sk("M5.6 13.4Q8 8.2 12 8Q16 8.2 18.4 13.4", "wm-a"),
    ...dot(15.6, 3.8, 1.1, "wm-s"),
    ...dot(19.2, 6.4, 1, "wm-s"),
    ...dot(11.4, 3.6, 0.8, "wm-s"),
  ];
}
