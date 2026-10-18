const D = { color: "var(--with-accent, currentColor)", stroke: "currentColor", "stroke-width": 0.45, "stroke-opacity": 0.5, class: "wm-deco" };
const T = { color: "var(--with-accent, currentColor)", stroke: "currentColor", "stroke-width": 0.5, "stroke-opacity": 0.75, class: "wm-deco" };
const dim = (a, b) => [["path", { d: `M${a} 23H${b}M${a} 21.7V23.3M${b} 21.7V23.3`, ...D }], ["path", { d: `M${a - 0.65} 23.65L${a + 0.65} 22.35M${b - 0.65} 23.65L${b + 0.65} 22.35`, ...T }]];
export default function render() {
  return [
    ...dim(3, 21),
    ["path", { d: "M12 3.3L9.71 9.44L3.15 9.73L8.29 13.81L6.53 20.12L12 16.5Z", fill: "currentColor", "fill-opacity": 0.45, stroke: "none", class: "wm-a" }],
    ["path", { d: "M12 3.3L14.29 9.44L20.85 9.73L15.71 13.81L17.47 20.12L12 16.5L6.53 20.12L8.29 13.81L3.15 9.73L9.71 9.44Z", class: "wm-k" }],
    ["path", { d: "M12 3.3V16.5", "stroke-width": 1.75, class: "wm-k" }]
  ];
}
