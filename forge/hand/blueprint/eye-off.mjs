const G = { color: "var(--with-accent, currentColor)", stroke: "currentColor", "stroke-width": 0.45, "stroke-opacity": 0.5, class: "wm-deco" };
const DIM = ["path", { d: "M4.5 23.2H19.5M4.5 22V23.6M19.5 22V23.6", ...G }];
export default function render() {
  return [
    DIM,
    ["path", { d: "M2.5 12Q4.69 9.81 6.87 8.64M9.34 7.62Q15.42 5.92 21.5 12M2.5 12Q8.58 18.08 14.66 16.38M17.13 15.36Q19.31 14.18 21.5 12", "stroke-width": 1.5, class: "wm-k" }],
    ["path", { d: "M9.56 10.84A2.7 2.7 0 0 0 13.16 14.44ZM10.84 9.56A2.7 2.7 0 0 1 14.44 13.16Z", fill: "currentColor", stroke: "none", class: "wm-a" }],
    ["path", { d: "M4 4L20 20", "stroke-width": 1.9, class: "wm-s" }],
  ];
}
