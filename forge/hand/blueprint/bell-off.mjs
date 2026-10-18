const G = { color: "var(--with-accent, currentColor)", stroke: "currentColor", "stroke-width": 0.45, "stroke-opacity": 0.5, class: "wm-deco" };
const DIM = ["path", { d: "M4.5 23.2H19.5M4.5 22V23.6M19.5 22V23.6", ...G }];
export default function render() {
  return [
    DIM,
    ["path", { d: "M8.4 6.2A6 6 0 0 1 18 11V15M6 11V16.5L4.8 18.5H15.5", class: "wm-k" }],
    ["path", { d: "M9.5 18.5A2.5 2.5 0 0 0 14.5 18.5", class: "wm-a" }],
    ["path", { d: "M3.5 3.5L20.5 20.5", class: "wm-s" }],
  ];
}
