const r2 = (n) => Math.round(n * 100) / 100;
const gh = (d) => { let i = 0; return d.replace(/-?\d+(\.\d+)?/g, (m) => String(r2(+m + ((i++ % 2) ? 0.3 : 0.25)))); };
const sk = (d, cls = "wm-k") => [["path", { d: gh(d), "stroke-width": 0.5, "stroke-opacity": 0.5, class: cls }], ["path", { d, class: cls }]];
const hatch = (d) => ["path", { d, "stroke-width": 0.8, "stroke-opacity": 0.5 }];
const dot = (cx, cy, r, cls) => [["circle", { cx: r2(cx + 0.25), cy: r2(cy + 0.3), r, "stroke-width": 0.5, "stroke-opacity": 0.5, class: cls }], ["circle", { cx, cy, r, class: cls }]];

export default function render() {
  return [
    hatch("M10.8 16.6L11.6 15.6M11.4 19L12.3 18M19.4 16.6L20.2 15.6M19.9 19L20.8 18M15.1 10.2L15.9 9.2"),
    ...sk("M2 15.6L4.2 13.2L10.8 13.2L12.6 15.6L12.2 20.2L2.4 20.2Z"),
    ...sk("M2 15.6L12.6 15.6"),
    ...sk("M11.4 15.6L13.4 13.2L20 13.2L22 15.6L21.6 20.2L12.4 20.2"),
    ...sk("M12.6 15.6L22 15.6"),
    ...sk("M6.6 13.2L6.4 10.4L8.6 8L15 8L16.8 10.4L17 13.2", "wm-a"),
    ...sk("M6.4 10.4L16.8 10.4", "wm-a"),
  ];
}
