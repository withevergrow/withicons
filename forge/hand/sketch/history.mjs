const r2 = (n) => Math.round(n * 100) / 100;
const gh = (d) => { let i = 0; return d.replace(/-?\d+(\.\d+)?/g, (m) => String(r2(+m + ((i++ % 2) ? 0.3 : 0.25)))); };
const sk = (d, cls = "wm-k") => [["path", { d: gh(d), "stroke-width": 0.5, "stroke-opacity": 0.5, class: cls }], ["path", { d, class: cls }]];
const hatch = (d) => ["path", { d, "stroke-width": 0.8, "stroke-opacity": 0.5 }];
const dot = (cx, cy, r, cls) => [["circle", { cx: r2(cx + 0.25), cy: r2(cy + 0.3), r, "stroke-width": 0.5, "stroke-opacity": 0.5, class: cls }], ["circle", { cx, cy, r, class: cls }]];

export default function render() {
  return [
    ...sk("M4.6 12.5Q4.6 4 12.9 3.9Q21.6 4 21.6 12.4Q21.6 20.9 13 20.9Q9.6 20.9 7.6 19.4"),
    ...sk("M2.6 10.6L4.6 12.8L6.6 10.6"),
    ...sk("M13 8.2L13 12.6L16.2 14.6", "wm-a"),
  ];
}
